import { useEffect, useRef, useState, useCallback } from 'react'
import type { Recipe } from '../../data/types'
import { useCookSessionStore } from '../../stores/cookSessionStore'
import { usePantryStore } from '../../stores/pantryStore'
import { SousChefVoice } from './SousChefVoice'
import { parseCommand, type VoiceCommand } from './commands'
import { resolveIngredient } from '../substitute'
import { speakQty, formatTimer } from '../format'

export interface MicState {
  supported: boolean
  listening: boolean
  level: number
}

/** Step text with any applied swaps woven in ("butter" → "olive oil"). */
export function useStepText(): string {
  const recipe = useCookSessionStore((s) => s.recipe)
  const stepIndex = useCookSessionStore((s) => s.stepIndex)
  const swaps = useCookSessionStore((s) => s.swaps)
  if (!recipe) return ''
  let text = recipe.steps[stepIndex]?.text ?? ''
  for (const sw of swaps) {
    text = text.replace(new RegExp(`\\b${sw.from.name}\\b`, 'gi'), sw.to.name)
  }
  return text
}

/**
 * Drives a hands-free cook session: narration, continuous command
 * recognition, no-confirm substitution, and the step timer.
 */
export function useCookSession(recipe: Recipe | undefined, onComplete: () => void) {
  const [mic, setMic] = useState<MicState>({ supported: true, listening: false, level: 0 })
  const voiceRef = useRef<SousChefVoice | null>(null)
  const pendingSkipRef = useRef<string | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const speakStep = useCallback((prefix = '') => {
    const s = useCookSessionStore.getState()
    if (!s.recipe) return
    let text = s.recipe.steps[s.stepIndex]?.text ?? ''
    for (const sw of s.swaps) {
      text = text.replace(new RegExp(`\\b${sw.from.name}\\b`, 'gi'), sw.to.name)
    }
    void voiceRef.current?.speak(
      `${prefix}Step ${s.stepIndex + 1} of ${s.recipe.steps.length}. ${text}`,
    )
  }, [])

  const advance = useCallback(() => {
    const s = useCookSessionStore.getState()
    const moved = s.next()
    if (moved) {
      speakStep()
    } else {
      s.finish()
      void voiceRef.current
        ?.speak("That's the last step — you did it! Enjoy your meal.")
        .then(() => onCompleteRef.current())
    }
  }, [speakStep])

  const handleCommand = useCallback(
    (cmd: VoiceCommand, heardRaw: string) => {
      const s = useCookSessionStore.getState()
      const voice = voiceRef.current
      if (!s.recipe || !voice) return

      switch (cmd.type) {
        case 'next':
          if (s.status === 'paused') s.pauseToggle()
          advance()
          break
        case 'prev':
          s.prev()
          speakStep()
          break
        case 'repeat':
          speakStep()
          break
        case 'pause':
          if (s.status !== 'paused') s.pauseToggle()
          void voice.speak('Paused. Say resume when you are ready.')
          break
        case 'resume':
          if (s.status === 'paused') s.pauseToggle()
          speakStep('Resuming. ')
          break
        case 'start-timer': {
          s.startTimer()
          const t = useCookSessionStore.getState().timerRemaining
          void voice.speak(`Timer started: ${formatTimer(t).replace(':', ' ')} on the clock.`)
          break
        }
        case 'stop-timer':
          if (s.timerRunning) s.toggleTimer()
          void voice.speak('Timer paused.')
          break
        case 'whats-next': {
          const nxt = s.recipe.steps[s.stepIndex + 1]
          void voice.speak(nxt ? `Coming up next: ${nxt.text}` : 'This is the final step.')
          break
        }
        case 'how-much': {
          const ing = resolveIngredient(s.ingredients, cmd.ingredient)
          void voice.speak(
            ing
              ? `You need ${speakQty(ing.quantity)} ${ing.unit} of ${ing.name}.`
              : `I couldn't find ${cmd.ingredient} in this recipe.`,
          )
          break
        }
        case 'swap': {
          // the money feature — no confirm step
          const pantry = new Set(usePantryStore.getState().items)
          const result = s.requestSwap(cmd.ingredient, heardRaw, pantry)
          if (result.ok) {
            void voice.speak(result.spoken).then(() => speakStep('Back to it. '))
          } else {
            if (result.reason === 'no-substitute' && result.ingredientName) {
              pendingSkipRef.current = result.ingredientName
            }
            void voice.speak(result.spoken)
          }
          break
        }
        case 'skip-ingredient': {
          const name = pendingSkipRef.current
          pendingSkipRef.current = null
          void voice
            .speak(
              name
                ? `Okay, we'll cook without ${name}. It will still be delicious.`
                : 'Okay, skipping ahead.',
            )
            .then(() => {
              if (!name) advance()
            })
          break
        }
        case 'keep-ingredient':
          pendingSkipRef.current = null
          void voice.speak('Got it, keeping the recipe as written.')
          break
        case 'finish':
          s.finish()
          void voice.speak('Great cooking! Wrapping up.').then(() => onCompleteRef.current())
          break
      }
    },
    [advance, speakStep],
  )

  const handleCommandRef = useRef(handleCommand)
  handleCommandRef.current = handleCommand

  // boot the session + voice engine
  useEffect(() => {
    if (!recipe) return
    useCookSessionStore.getState().start(recipe)

    const voice = new SousChefVoice({
      onTranscript: (text) => {
        const cmd = parseCommand(text)
        if (cmd) handleCommandRef.current(cmd, text)
      },
      onListeningChange: (listening) => setMic((m) => ({ ...m, listening })),
      onLevel: (level) => setMic((m) => (Math.abs(m.level - level) > 0.03 ? { ...m, level } : m)),
      onUnsupported: () => setMic((m) => ({ ...m, supported: false, listening: false })),
    })
    voiceRef.current = voice

    // Start the live mic meter immediately (prompts for permission up front and
    // animates the waveform during the welcome). Recognition is suppressed while
    // speaking and auto-resumes when the welcome utterance's onend fires, so no
    // second startListening() is needed here.
    void voice.speak(
      `Welcome to Sous-Chef mode for ${recipe.title}. I'm listening the whole time — you never need to touch the screen. Step 1 of ${recipe.steps.length}. ${recipe.steps[0].text}`,
    )
    void voice.startListening()

    // demo/debug hook: feed a phrase through the exact same path as the mic
    ;(window as unknown as Record<string, unknown>).sousChefSay = (phrase: string) => {
      const cmd = parseCommand(phrase)
      if (cmd) handleCommandRef.current(cmd, phrase)
      return cmd ? `→ ${cmd.type}` : '(not understood)'
    }

    return () => {
      delete (window as unknown as Record<string, unknown>).sousChefSay
      voice.dispose()
      voiceRef.current = null
    }
  }, [recipe])

  // 1-second timer tick; announce when a timer finishes
  useEffect(() => {
    const id = setInterval(() => {
      const before = useCookSessionStore.getState().timerRemaining
      useCookSessionStore.getState().tick()
      const after = useCookSessionStore.getState().timerRemaining
      if (before === 1 && after === 0) {
        void voiceRef.current?.speak('Time is up for this step. Say next when you are ready.')
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // tap controls mirror the voice commands
  const controls = {
    next: advance,
    prev: () => {
      useCookSessionStore.getState().prev()
      speakStep()
    },
    pauseToggle: () => {
      const s = useCookSessionStore.getState()
      s.pauseToggle()
      const paused = useCookSessionStore.getState().status === 'paused'
      if (paused) voiceRef.current?.stopSpeaking()
      else speakStep('Resuming. ')
    },
    toggleTimer: () => useCookSessionStore.getState().toggleTimer(),
    undoSwap: () => useCookSessionStore.getState().undoLastSwap(),
    keepSwap: () => useCookSessionStore.getState().dismissSwapCard(),
    exit: () => {
      voiceRef.current?.dispose()
      useCookSessionStore.getState().exit()
    },
    /** demo affordance so reviewers without a mic can trigger the money feature */
    simulateSwapCommand: (phrase: string) => {
      const cmd = parseCommand(phrase)
      if (cmd) handleCommandRef.current(cmd, phrase)
    },
  }

  return { mic, controls }
}

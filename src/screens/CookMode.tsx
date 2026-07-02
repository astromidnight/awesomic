import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, SkipBack, SkipForward, Pause, Play } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar, HomeIndicator } from '../components/StatusBar'
import { ProgressSegments, TimerCard, VoiceSwapCard, MicIndicator } from '../components/cook'
import { repo } from '../data/repository'
import { useCookSession, useStepText } from '../lib/voice/useCookSession'
import { useCookSessionStore } from '../stores/cookSessionStore'

export function CookMode() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const recipe = repo.byId(id)

  const onComplete = useCallback(() => navigate(`/done/${id}`), [navigate, id])
  const { mic, controls } = useCookSession(recipe, onComplete)

  const stepIndex = useCookSessionStore((s) => s.stepIndex)
  const status = useCookSessionStore((s) => s.status)
  const lastSwap = useCookSessionStore((s) => s.lastSwap)
  const lastSwapSummary = useCookSessionStore((s) => s.lastSwapSummary)
  const timerRemaining = useCookSessionStore((s) => s.timerRemaining)
  const timerRunning = useCookSessionStore((s) => s.timerRunning)
  const stepText = useStepText()

  if (!recipe) {
    navigate('/', { replace: true })
    return null
  }

  const totalSteps = recipe.steps.length
  const hasTimer = (recipe.steps[stepIndex]?.timerSeconds ?? 0) > 0 || timerRemaining > 0
  const paused = status === 'paused'

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />
      <div className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-5 pt-[6px] pb-[14px] no-scrollbar">
        {/* top bar */}
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            onClick={() => {
              controls.exit()
              navigate(`/recipe/${recipe.id}`)
            }}
            aria-label="Exit Cook Mode"
            className="flex size-10 items-center justify-center rounded-full bg-ink-0 shadow-topbtn"
          >
            <X size={18} className="text-ink-900" />
          </button>
          <p className="text-[15px] font-semibold text-ink-900">{recipe.title}</p>
          <span className="size-10" aria-hidden />
        </div>

        <ProgressSegments total={totalSteps} current={stepIndex} />

        {/* the step — large, high-contrast, hands-free readable */}
        <div className="flex w-full flex-col gap-2">
          <p className="text-[11px] font-bold tracking-[0.06em] text-ink-600">
            STEP {stepIndex + 1} OF {totalSteps}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-[26px] leading-[1.25] font-bold text-ink-900"
              aria-live="polite"
            >
              {stepText}
            </motion.p>
          </AnimatePresence>
        </div>

        {hasTimer && (
          <TimerCard
            remaining={timerRemaining}
            running={timerRunning}
            onToggle={controls.toggleTimer}
          />
        )}

        {/* the substitution moment */}
        <AnimatePresence>
          {lastSwap && (
            <VoiceSwapCard
              swap={lastSwap}
              summary={lastSwapSummary}
              onUndo={controls.undoSwap}
              onKeep={controls.keepSwap}
            />
          )}
        </AnimatePresence>

        <div className="min-h-2 flex-1" />

        <MicIndicator listening={mic.listening && !paused} level={mic.level} supported={mic.supported} />

        {/* demo helper when speech is unavailable: same command path, by tap */}
        {!mic.supported && (
          <button
            type="button"
            onClick={() => controls.simulateSwapCommand("I don't have butter")}
            className="mx-auto rounded-full border border-ink-200 bg-ink-0 px-4 py-2 text-[12px] font-semibold text-ink-600"
          >
            Try a voice swap: “I don’t have butter”
          </button>
        )}
      </div>

      {/* controls */}
      <div className="flex h-[116px] w-full shrink-0 flex-col items-center gap-3 bg-ink-0 pt-[14px] pb-[10px] shadow-nav">
        <div className="flex items-center gap-[30px]">
          <button
            type="button"
            onClick={controls.prev}
            disabled={stepIndex === 0}
            aria-label="Previous step"
            className="flex size-14 items-center justify-center rounded-full border-[1.5px] border-ink-200 bg-ink-0 shadow-ctl disabled:opacity-40"
          >
            <SkipBack size={22} className="text-ink-900" />
          </button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={controls.pauseToggle}
            aria-label={paused ? 'Resume' : 'Pause'}
            className="flex size-[68px] items-center justify-center rounded-full bg-emerald-500 shadow-play"
          >
            {paused ? (
              <Play size={26} weight="fill" className="text-ink-0" />
            ) : (
              <Pause size={26} weight="fill" className="text-ink-0" />
            )}
          </motion.button>
          <button
            type="button"
            onClick={controls.next}
            aria-label="Next step"
            className="flex size-14 items-center justify-center rounded-full border-[1.5px] border-ink-200 bg-ink-0 shadow-ctl"
          >
            <SkipForward size={22} className="text-ink-900" />
          </button>
        </div>
        <HomeIndicator />
      </div>
    </Page>
  )
}

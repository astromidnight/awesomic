export type VoiceCommand =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'repeat' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'start-timer' }
  | { type: 'stop-timer' }
  | { type: 'whats-next' }
  | { type: 'how-much'; ingredient: string }
  | { type: 'swap'; ingredient: string; heard: string }
  | { type: 'skip-ingredient' }
  | { type: 'keep-ingredient' }
  | { type: 'finish' }

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Map a final speech transcript to a command.
 * Order matters: substitution phrases first (they contain common words),
 * then questions, then navigation.
 */
export function parseCommand(transcript: string): VoiceCommand | null {
  const t = clean(transcript)
  if (!t) return null

  // ——— substitution (the money feature) ———
  const dontHave = t.match(/(?:i )?(?:don'?t|do not) have (?:any |the )?(.+)$/)
  if (dontHave) return { type: 'swap', ingredient: dontHave[1], heard: transcript.trim() }

  const outOf = t.match(/(?:i'?m |i am |we'?re )?out of (?:the )?(.+)$/)
  if (outOf) return { type: 'swap', ingredient: outOf[1], heard: transcript.trim() }

  const replace = t.match(/^replace (?:the )?(.+?)(?: with .+)?$/)
  if (replace) return { type: 'swap', ingredient: replace[1], heard: transcript.trim() }

  const swap = t.match(/^swap (?:out )?(?:the )?(.+?)(?: for .+)?$/)
  if (swap) return { type: 'swap', ingredient: swap[1], heard: transcript.trim() }

  // ——— clarification answers ———
  if (/^(skip|skip it|skip the ingredient|skip that|cook without it)$/.test(t))
    return { type: 'skip-ingredient' }
  if (/^(keep|keep it|leave it|never mind|nevermind|cancel)$/.test(t))
    return { type: 'keep-ingredient' }

  // ——— questions ———
  const howMuch = t.match(/^how (?:much|many) (?:of )?(?:the )?(.+?)(?: do i need)?$/)
  if (howMuch) return { type: 'how-much', ingredient: howMuch[1] }

  if (/^what'?s next$|^what is next$|^what comes next$/.test(t)) return { type: 'whats-next' }

  // ——— timer ———
  if (/\bstart (?:the |a )?timer\b/.test(t)) return { type: 'start-timer' }
  if (/\b(?:stop|pause) (?:the )?timer\b/.test(t)) return { type: 'stop-timer' }

  // ——— navigation ———
  if (/^(next|next step|continue|done|move on|go on)$/.test(t)) return { type: 'next' }
  if (/^(previous|previous step|go back|back|back up)$/.test(t)) return { type: 'prev' }
  if (/^(repeat|repeat that|say that again|again|come again)$/.test(t)) return { type: 'repeat' }
  if (/^(pause|hold on|wait|stop)$/.test(t)) return { type: 'pause' }
  if (/^(resume|keep going|unpause|carry on|play)$/.test(t)) return { type: 'resume' }
  if (/^(finish|finished|we'?re done|end cooking|all done)$/.test(t)) return { type: 'finish' }

  return null
}

import { Microphone, Timer, Pause, Play, ArrowCounterClockwise, Check } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AppliedSwap } from '../data/types'
import { formatTimer } from '../lib/format'

/** Segmented step progress bar. */
export function ProgressSegments({ total, current }: { total: number; current: number }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-label={`Step ${current + 1} of ${total}`}
      className="flex w-full gap-[6px]"
    >
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          animate={{ backgroundColor: i <= current ? '#10b981' : '#e2e5ea' }}
          className="h-[6px] min-w-px flex-1 rounded-full"
        />
      ))}
    </div>
  )
}

interface TimerCardProps {
  remaining: number
  running: boolean
  label?: string
  onToggle: () => void
}

export function TimerCard({ remaining, running, label, onToggle }: TimerCardProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl bg-ink-0 py-[14px] pr-4 pl-[14px] shadow-timer">
      <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <Timer size={22} className="text-emerald-700" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[22px] font-bold text-ink-900 tabular-nums" aria-live="polite">
          {formatTimer(remaining)}
        </span>
        <span className="text-[12px] text-ink-600">
          {label ?? (running ? 'Step timer running' : remaining === 0 ? 'Timer done' : 'Timer paused')}
        </span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-label={running ? 'Pause timer' : 'Start timer'}
        className="relative after:absolute after:-inset-3 after:content-['']"
      >
        {running ? (
          <Pause size={22} className="text-ink-900" />
        ) : (
          <Play size={22} className="text-ink-900" />
        )}
      </button>
    </div>
  )
}

interface VoiceSwapCardProps {
  swap: AppliedSwap
  summary: string
  onUndo: () => void
  onKeep: () => void
}

/** Slides in at the substitution moment; Undo/Keep are optional affordances. */
export function VoiceSwapCard({ swap, summary, onUndo, onKeep }: VoiceSwapCardProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      role="status"
      className="flex w-full flex-col gap-[10px] rounded-2xl border-[1.5px] border-emerald-500 bg-ink-0 px-4 py-[14px] shadow-swap"
    >
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-[6px]">
          <Microphone size={15} weight="fill" className="text-emerald-700" />
          <span className="text-[11px] font-bold tracking-[0.04em] text-emerald-700">
            VOICE SWAP
          </span>
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-[3px] text-[10px] font-semibold text-emerald-700">
          applied
        </span>
      </div>
      <p className="text-[13px] font-medium text-ink-600">You said “{swap.heard}”</p>
      <p className="text-[18px] font-bold text-ink-900">→ Swapped to {swap.to.name}</p>
      <p className="text-[12px] text-ink-600">{summary}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onUndo}
          className="flex min-h-9 items-center gap-[5px] rounded-full border-[1.3px] border-ink-200 bg-ink-0 py-[7px] pr-[14px] pl-3"
        >
          <ArrowCounterClockwise size={14} className="text-ink-900" />
          <span className="text-[12px] font-semibold text-ink-900">Undo</span>
        </button>
        <button
          type="button"
          onClick={onKeep}
          className="flex min-h-9 items-center gap-[5px] rounded-full bg-emerald-700 py-[7px] pr-[14px] pl-3"
        >
          <Check size={14} className="text-ink-0" />
          <span className="text-[12px] font-semibold text-ink-0">Keep swap</span>
        </button>
      </div>
    </motion.div>
  )
}

const BASE_HEIGHTS = [10, 20, 34, 16, 28, 12, 24, 32, 14, 22]

interface WaveformProps {
  /** 0..1 input level; bars idle gently when not speaking */
  level: number
  active: boolean
}

export function Waveform({ level, active }: WaveformProps) {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden className="flex h-[34px] items-center gap-1">
      {BASE_HEIGHTS.map((h, i) => {
        const target = active ? Math.max(6, h * (0.35 + level * 1.1)) : 6
        return (
          <motion.span
            key={i}
            animate={{ height: target }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: 'spring', stiffness: 300, damping: 14, delay: i * 0.015 }
            }
            className={`w-1 rounded-full ${active ? 'bg-emerald-500' : 'bg-ink-200'}`}
            style={{ height: 6 }}
          />
        )
      })}
    </div>
  )
}

interface MicIndicatorProps {
  listening: boolean
  level: number
  supported: boolean
}

/** Persistent mic-listening indicator with live waveform. */
export function MicIndicator({ listening, level, supported }: MicIndicatorProps) {
  const reduced = useReducedMotion()
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className={`relative flex size-24 items-center justify-center rounded-full ${
          listening ? 'bg-emerald-100' : 'bg-ink-100'
        }`}
      >
        {listening && !reduced && (
          <motion.span
            className="absolute inset-0 rounded-full bg-emerald-100"
            animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.4, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span
          className={`relative flex size-[72px] items-center justify-center rounded-full shadow-mic ${
            listening ? 'bg-emerald-500' : 'bg-ink-400'
          }`}
        >
          <Microphone size={34} className="text-ink-0" />
        </span>
      </div>
      <p className="text-[14px] font-semibold text-ink-900" aria-live="polite">
        {supported ? (listening ? 'Listening…' : 'Mic paused') : 'Voice unavailable — use the buttons'}
      </p>
      <Waveform level={level} active={listening} />
      <p className="w-[300px] text-center text-[11px] text-ink-600">
        Say: “next” · “repeat” · “how much salt” · “pause”
      </p>
    </div>
  )
}

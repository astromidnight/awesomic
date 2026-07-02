import { Check } from '@phosphor-icons/react'
import { useRef, useCallback } from 'react'

export function Checkbox({ checked, label }: { checked: boolean; label?: string }) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`flex size-[22px] shrink-0 items-center justify-center rounded-[6px] ${
        checked ? 'bg-emerald-500' : 'border-[1.4px] border-ink-600 bg-ink-0'
      }`}
    >
      {checked && <Check size={14} weight="bold" className="text-ink-0" />}
    </span>
  )
}

interface SegmentedProps<T extends string> {
  options: readonly T[]
  value: T | null
  onChange: (v: T | null) => void
}

/** Tap the active segment again to clear it. */
export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" className="flex w-full rounded-[10px] bg-ink-100 p-[3px]">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? null : opt)}
            className={`min-h-10 flex-1 rounded-lg py-[9px] text-center text-[12.5px] transition-all ${
              active ? 'bg-ink-0 font-semibold text-ink-900 shadow-seg' : 'font-medium text-ink-600'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

interface SliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  label: string
}

export function Slider({ min, max, step, value, onChange, label }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pct = ((value - min) / (max - min)) * 100

  const fromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const raw = min + ((clientX - rect.left) / rect.width) * (max - min)
      const snapped = Math.min(max, Math.max(min, Math.round(raw / step) * step))
      onChange(snapped)
    },
    [min, max, step, onChange],
  )

  return (
    <div
      ref={trackRef}
      className="relative flex h-[22px] w-full touch-none items-center"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        fromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) fromClientX(e.clientX)
      }}
    >
      <div className="h-[5px] w-full overflow-hidden rounded-full bg-ink-200">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onChange(Math.max(min, value - step))
          if (e.key === 'ArrowRight') onChange(Math.min(max, value + step))
        }}
        className="absolute size-[22px] -translate-x-1/2 rounded-full border border-ink-200 bg-ink-0 shadow-thumb"
        style={{ left: `${pct}%` }}
      />
    </div>
  )
}

interface TabsProps {
  tabs: readonly string[]
  active: string
  onChange: (t: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div role="tablist" className="flex gap-6">
      {tabs.map((t) => {
        const isActive = t === active
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t)}
            className="flex min-h-10 flex-col items-center gap-[7px]"
          >
            <span
              className={`text-[14px] ${isActive ? 'font-semibold text-ink-900' : 'font-normal text-ink-600'}`}
            >
              {t}
            </span>
            <span
              className={`h-[2.5px] rounded-full transition-all ${
                isActive ? 'w-[58px] bg-emerald-500' : 'w-px bg-transparent'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

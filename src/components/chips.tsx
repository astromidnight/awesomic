import { X } from '@phosphor-icons/react'

interface TagChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

export function TagChip({ label, selected = false, onClick }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative inline-flex h-[34px] shrink-0 items-center justify-center rounded-full px-[14px] text-[13px] font-medium whitespace-nowrap transition-colors after:absolute after:-inset-y-2 after:inset-x-0 after:content-[''] ${
        selected
          ? 'bg-emerald-500 text-ink-0'
          : 'border border-ink-200 bg-ink-0 text-ink-900 active:bg-ink-50'
      }`}
    >
      {label}
    </button>
  )
}

interface FilterPillProps {
  label: string
  onRemove: () => void
}

export function FilterPill({ label, onRemove }: FilterPillProps) {
  return (
    <span className="flex shrink-0 items-center gap-[6px] rounded-full bg-emerald-50 py-[7px] pr-[9px] pl-[12px] text-[12px] font-semibold text-emerald-700">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="relative flex items-center after:absolute after:-inset-2.5 after:content-['']"
      >
        <X size={12} weight="bold" />
      </button>
    </span>
  )
}

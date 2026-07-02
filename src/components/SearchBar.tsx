import { MagnifyingGlass, Camera } from '@phosphor-icons/react'

interface SearchBarProps {
  placeholder?: string
  onClick?: () => void
}

/** Home search bar with AI cue and camera affordance. Acts as a search trigger. */
export function SearchBar({ placeholder = 'Ingredients or a photo', onClick }: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search recipes with AI"
      className="flex h-[54px] w-full items-center gap-[10px] rounded-2xl bg-ink-0 pr-2 pl-[14px] shadow-search"
    >
      <MagnifyingGlass size={20} className="shrink-0 text-ink-600" />
      <span className="flex-1 text-left text-[13.5px] text-ink-600">{placeholder}</span>
      <Camera size={20} className="shrink-0 text-ink-600" />
      <span className="flex shrink-0 items-center gap-[5px] rounded-full bg-emerald-50 px-3 py-2">
        <span className="size-[6px] rounded-full bg-emerald-500" />
        <span className="text-[13px] font-semibold text-emerald-700">AI</span>
      </span>
    </button>
  )
}

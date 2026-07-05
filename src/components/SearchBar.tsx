import { MagnifyingGlass, Camera } from '@phosphor-icons/react'

interface SearchBarProps {
  placeholder?: string
  onClick?: () => void
}

/** Home search bar with camera affordance. Acts as a search trigger. */
export function SearchBar({ placeholder = 'Ingredients or a photo', onClick }: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search recipes"
      className="flex h-[54px] w-full shrink-0 items-center gap-[10px] rounded-2xl bg-ink-0 pr-[14px] pl-[14px] shadow-search"
    >
      <MagnifyingGlass size={20} className="shrink-0 text-ink-600" />
      <span className="flex-1 text-left text-[13.5px] text-ink-600">{placeholder}</span>
      <Camera size={20} className="shrink-0 text-ink-600" />
    </button>
  )
}

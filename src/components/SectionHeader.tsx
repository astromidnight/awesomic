interface SectionHeaderProps {
  title: string
  onSeeAll?: () => void
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="text-[17px] font-semibold text-ink-900">{title}</h2>
      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="relative text-[13px] font-semibold text-emerald-700 after:absolute after:-inset-2 after:content-['']"
        >
          See all
        </button>
      )}
    </div>
  )
}

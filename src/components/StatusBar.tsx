export function StatusBar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const c = theme === 'dark' ? 'bg-ink-900' : 'bg-ink-0'
  return (
    <div
      aria-hidden
      className={`flex h-[44px] w-full shrink-0 items-center justify-between px-[26px] ${
        theme === 'dark' ? 'text-ink-900' : 'text-ink-0'
      }`}
    >
      <span className="text-[15px] font-semibold">9:41</span>
      <div className="flex items-center gap-[6px]">
        <span className={`h-[11px] w-[18px] rounded-[2px] ${c}`} />
        <span className={`h-[11px] w-[16px] rounded-[2px] ${c}`} />
        <span className={`h-[12px] w-[24px] rounded-[3px] ${c}`} />
      </div>
    </div>
  )
}

/** iOS home indicator bar */
export function HomeIndicator({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div
      aria-hidden
      className={`mx-auto h-[5px] w-[130px] shrink-0 rounded-full ${theme === 'dark' ? 'bg-ink-900' : 'bg-ink-0'}`}
    />
  )
}

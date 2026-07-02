export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-ink-100 ${className}`} />
}

export function ResultCardSkeleton() {
  return (
    <div className="flex w-full items-start gap-3 rounded-2xl bg-ink-0 py-[10px] pr-[14px] pl-[10px] shadow-result">
      <Skeleton className="size-[88px] shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

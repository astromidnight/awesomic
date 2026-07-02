import type { PantryMatch } from '../data/types'

export function PantryBanner({ match }: { match: PantryMatch }) {
  const missing = match.total - match.owned
  return (
    <div className="flex w-full flex-col gap-[9px] rounded-[14px] bg-emerald-50 px-[14px] py-[13px]">
      <div className="flex w-full items-center justify-between text-[13px] text-emerald-700">
        <span className="font-semibold">
          You have {match.owned} of {match.total} ingredients
        </span>
        <span className="font-bold">{match.pct}%</span>
      </div>
      <div className="h-[7px] w-full overflow-hidden rounded-full bg-mint-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${match.pct}%` }}
        />
      </div>
      <p className="text-[11.5px] text-ink-600">
        {missing === 0
          ? 'Everything is in your pantry — you are ready to cook.'
          : `${missing} missing — swap by voice in Cook Mode, or add to your list.`}
      </p>
    </div>
  )
}

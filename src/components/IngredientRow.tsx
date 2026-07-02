import { Microphone, Plus } from '@phosphor-icons/react'
import type { Ingredient } from '../data/types'
import { formatQty } from '../lib/format'
import { Checkbox } from './inputs'

export type IngredientRowState = 'pantry' | 'swap' | 'add' | 'swapped'

interface IngredientRowProps {
  ingredient: Ingredient
  state: IngredientRowState
  onAdd?: () => void
  onSwapHint?: () => void
}

/**
 * Ingredient list row. State is derived from the pantry:
 * pantry = owned · swap = missing but substitutable · add = missing.
 */
export function IngredientRow({ ingredient, state, onAdd, onSwapHint }: IngredientRowProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <Checkbox checked={state !== 'add'} label={ingredient.name} />
      <p className="flex min-w-0 flex-1 items-center gap-[5px] text-[13px] text-ink-900">
        <span className="font-semibold">
          {formatQty(ingredient.quantity)} {ingredient.unit}
        </span>
        <span className="truncate">{ingredient.name}</span>
      </p>
      {state === 'pantry' && (
        <span className="text-[11px] font-semibold text-ink-600">In pantry</span>
      )}
      {state === 'swapped' && (
        <span className="rounded-full bg-emerald-50 px-2 py-[3px] text-[11px] font-semibold text-emerald-700">
          swapped in
        </span>
      )}
      {state === 'swap' && (
        <button
          type="button"
          onClick={onSwapHint}
          className="relative flex items-center gap-1 rounded-full bg-emerald-50 py-[5px] pr-[11px] pl-[9px] after:absolute after:-inset-1.5 after:content-['']"
        >
          <Microphone size={13} className="text-emerald-700" />
          <span className="text-[11px] font-semibold text-emerald-700">Swap</span>
        </button>
      )}
      {state === 'add' && (
        <button
          type="button"
          onClick={onAdd}
          className="relative flex items-center gap-1 rounded-full border-[1.3px] border-ink-200 bg-ink-0 py-[5px] pr-[11px] pl-[9px] after:absolute after:-inset-1.5 after:content-['']"
        >
          <Plus size={13} className="text-ink-900" />
          <span className="text-[11px] font-semibold text-ink-900">Add</span>
        </button>
      )}
    </div>
  )
}

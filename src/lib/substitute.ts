import type { Ingredient, AppliedSwap } from '../data/types'
import { findSubstitutes } from '../data/substitutions'
import { formatQty, speakQty } from './format'

export type SwapResult =
  | { ok: true; swap: AppliedSwap; ingredients: Ingredient[]; spoken: string; summary: string }
  | { ok: false; reason: 'not-found' | 'no-substitute'; spoken: string; ingredientName?: string }

/** Find the recipe ingredient the cook most likely meant. */
export function resolveIngredient(ingredients: Ingredient[], said: string): Ingredient | undefined {
  const s = said.toLowerCase().trim()
  return (
    ingredients.find((i) => i.name.toLowerCase() === s) ??
    ingredients.find((i) => i.name.toLowerCase().includes(s) || s.includes(i.name.toLowerCase())) ??
    // last resort: match any word ("cream" → "heavy cream")
    ingredients.find((i) => i.name.toLowerCase().split(' ').some((w) => s.split(' ').includes(w)))
  )
}

/**
 * The money feature: swap an ingredient with no confirm step.
 * Prefers a substitute the cook actually has in their pantry, recomputes
 * quantity via the table ratio, and reports kcal / time deltas.
 */
export function applySubstitution(
  ingredients: Ingredient[],
  saidIngredient: string,
  heard: string,
  pantry: ReadonlySet<string>,
): SwapResult {
  const from = resolveIngredient(ingredients, saidIngredient)
  if (!from) {
    return {
      ok: false,
      reason: 'not-found',
      spoken: `I couldn't find ${saidIngredient} in this recipe. You can say, for example, "I don't have butter".`,
    }
  }

  const candidates = findSubstitutes(from.id)
  const choice = candidates.find((c) => pantry.has(c.to)) ?? candidates[0]
  if (!choice) {
    return {
      ok: false,
      reason: 'no-substitute',
      ingredientName: from.name,
      spoken: `I don't have a substitute for ${from.name}. Say "skip it" to cook without it, or "keep it" to leave the recipe as written.`,
    }
  }

  const quantity = Math.round(from.quantity * choice.ratio * 4) / 4
  const to: Ingredient = {
    id: choice.to,
    name: choice.to,
    quantity,
    unit: choice.unit ?? from.unit,
    substitutable: false,
  }
  const swap: AppliedSwap = {
    from,
    to,
    deltaKcal: choice.deltaKcal,
    deltaTimeMinutes: choice.deltaTimeMinutes,
    heard,
  }

  const timePart =
    choice.deltaTimeMinutes === 0
      ? 'same cook time'
      : choice.deltaTimeMinutes > 0
        ? `plus ${choice.deltaTimeMinutes} minutes`
        : `minus ${-choice.deltaTimeMinutes} minutes`
  const kcalPart =
    choice.deltaKcal === 0
      ? 'same calories'
      : choice.deltaKcal > 0
        ? `plus ${choice.deltaKcal} calories`
        : `minus ${-choice.deltaKcal} calories`

  return {
    ok: true,
    swap,
    ingredients: ingredients.map((i) => (i.id === from.id ? to : i)),
    summary: `${formatQty(quantity)} ${to.unit} · ${timePart} · ${kcalPart.replace('minus ', '−').replace('plus ', '+').replace(' calories', ' kcal')}`,
    spoken: `No problem. Swapped ${from.name} for ${to.name}: ${speakQty(quantity)} ${to.unit}, ${timePart}, ${kcalPart}. Carrying on.`,
  }
}

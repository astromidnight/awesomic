import type { Recipe, PantryMatch, Ingredient } from '../data/types'

/** owned / total and a percentage — drives "% in pantry" everywhere. */
export function pantryMatch(recipe: Recipe, pantry: ReadonlySet<string>): PantryMatch {
  const missing: Ingredient[] = recipe.ingredients.filter((i) => !pantry.has(i.id))
  const total = recipe.ingredients.length
  const owned = total - missing.length
  return {
    owned,
    total,
    pct: total === 0 ? 0 : Math.round((owned / total) * 100),
    missing,
  }
}

import type { Substitution } from './types'

/**
 * Local substitution table. Order matters: earlier rows are preferred,
 * but a substitute the user actually has in their pantry always wins.
 */
export const substitutions: Substitution[] = [
  { from: 'butter', to: 'olive oil', ratio: 1, deltaKcal: -40, deltaTimeMinutes: 0 },
  { from: 'butter', to: 'coconut oil', ratio: 1, deltaKcal: -10, deltaTimeMinutes: 0 },
  { from: 'heavy cream', to: 'coconut cream', ratio: 1, deltaKcal: -90, deltaTimeMinutes: 0 },
  { from: 'heavy cream', to: 'milk', ratio: 1.25, deltaKcal: -320, deltaTimeMinutes: 5 },
  { from: 'parmesan', to: 'nutritional yeast', ratio: 0.5, deltaKcal: -80, deltaTimeMinutes: 0 },
  { from: 'parmesan', to: 'pecorino', ratio: 1, deltaKcal: 10, deltaTimeMinutes: 0 },
  { from: 'milk', to: 'oat milk', ratio: 1, deltaKcal: -30, deltaTimeMinutes: 0 },
  { from: 'sour cream', to: 'greek yogurt', ratio: 1, deltaKcal: -60, deltaTimeMinutes: 0 },
  { from: 'honey', to: 'maple syrup', ratio: 1, deltaKcal: 0, deltaTimeMinutes: 0 },
  { from: 'lime', to: 'lemon', ratio: 1, deltaKcal: 0, deltaTimeMinutes: 0 },
  { from: 'lemon', to: 'lime', ratio: 1, deltaKcal: 0, deltaTimeMinutes: 0 },
  { from: 'chicken breast', to: 'tofu', ratio: 1, deltaKcal: -120, deltaTimeMinutes: -5 },
  { from: 'soy sauce', to: 'tamari', ratio: 1, deltaKcal: 0, deltaTimeMinutes: 0 },
  { from: 'pasta', to: 'rice noodles', ratio: 1, deltaKcal: -30, deltaTimeMinutes: -3 },
  { from: 'greek yogurt', to: 'sour cream', ratio: 1, deltaKcal: 60, deltaTimeMinutes: 0 },
  { from: 'cilantro', to: 'parsley', ratio: 1, deltaKcal: 0, deltaTimeMinutes: 0 },
  { from: 'shallot', to: 'onion', ratio: 1, deltaKcal: 0, deltaTimeMinutes: 0 },
  { from: 'sesame oil', to: 'olive oil', ratio: 1, deltaKcal: 0, deltaTimeMinutes: 0 },
]

export function findSubstitutes(from: string): Substitution[] {
  return substitutions.filter((s) => s.from === from)
}

/**
 * kcal per (quantity=1, unit) for the demo ingredient set.
 * Small but real enough to recompute a recipe's nutrition after a swap.
 */
export const kcalPerUnit: Record<string, number> = {
  'pasta|cups': 200,
  'butter|tbsp': 102,
  'olive oil|tbsp': 119,
  'coconut oil|tbsp': 117,
  'garlic|cloves': 4,
  'heavy cream|cup': 820,
  'coconut cream|cup': 550,
  'milk|cup': 150,
  'oat milk|cup': 120,
  'parmesan|cup': 430,
  'nutritional yeast|cup': 250,
  'chicken breast|pieces': 190,
  'rice|cup': 210,
  'egg|large': 72,
  'bread|slices': 80,
  'avocado|whole': 240,
  'tortillas|pieces': 90,
  'salmon|fillet': 280,
  'tofu|block': 180,
  'honey|tbsp': 64,
  'maple syrup|tbsp': 52,
  'soy sauce|tbsp': 9,
}

export function kcalFor(id: string, unit: string, quantity: number): number | undefined {
  const v = kcalPerUnit[`${id}|${unit}`]
  return v === undefined ? undefined : Math.round(v * quantity)
}

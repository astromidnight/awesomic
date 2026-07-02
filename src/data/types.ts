export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Diet = 'Vegan' | 'Vegetarian' | 'Keto' | 'Pescatarian'
export type Intolerance = 'Gluten-free' | 'Dairy-free' | 'Nut-free'
export type Equipment = 'Air-fryer' | 'Oven' | 'Stovetop' | 'Microwave'

export interface Ingredient {
  /** canonical ingredient id, e.g. "butter" */
  id: string
  name: string
  quantity: number
  unit: string
  /** ingredient can be swapped without breaking the dish */
  substitutable?: boolean
}

export interface RecipeStep {
  text: string
  /** optional per-step timer */
  timerSeconds?: number
}

export interface Recipe {
  id: string
  title: string
  /** bundled photo url, or undefined → gradient placeholder */
  image?: string
  /** warm gradient placeholder [from, to] pulled from Figma */
  gradient: [string, string]
  rating: number
  ratingCount: number
  timeMinutes: number
  difficulty: Difficulty
  kcal: number
  ingredients: Ingredient[]
  steps: RecipeStep[]
  tags: string[]
  equipment: Equipment[]
  diets: Diet[]
  /** intolerances this recipe is safe for */
  freeOf: Intolerance[]
}

export interface PantryItem {
  ingredientId: string
  have: boolean
}

export interface Substitution {
  from: string
  to: string
  /** multiply the original quantity by this */
  ratio: number
  /** same unit unless overridden */
  unit?: string
  deltaKcal: number
  deltaTimeMinutes: number
}

export interface AppliedSwap {
  from: Ingredient
  to: Ingredient
  deltaKcal: number
  deltaTimeMinutes: number
  /** what the user said, e.g. "I don't have butter" */
  heard: string
}

export interface PantryMatch {
  owned: number
  total: number
  pct: number
  missing: Ingredient[]
}

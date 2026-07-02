import type { Recipe } from './types'
import { recipes } from './recipes'

/**
 * Repository interface so a real API can drop in later.
 * The app only ever talks to `repo`.
 */
export interface RecipeRepository {
  list(): Recipe[]
  byId(id: string): Recipe | undefined
  search(query: string): Recipe[]
}

class MockRecipeRepository implements RecipeRepository {
  list(): Recipe[] {
    return recipes
  }

  byId(id: string): Recipe | undefined {
    return recipes.find((r) => r.id === id)
  }

  /** Token match against title + tags, e.g. "garlic pasta" → 24 garlic recipes. */
  search(query: string): Recipe[] {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return recipes
    return recipes.filter((r) => {
      const hay = `${r.title} ${r.tags.join(' ')}`.toLowerCase()
      return tokens.some((t) => hay.includes(t))
    })
  }
}

export const repo: RecipeRepository = new MockRecipeRepository()

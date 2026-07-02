import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SavedState {
  savedIds: string[]
  /** recipes cooked to completion, newest first */
  cooked: { recipeId: string; rating: number; swaps: number; at: number }[]
  isSaved: (id: string) => boolean
  toggleSaved: (id: string) => void
  logCooked: (recipeId: string, rating: number, swaps: number) => void
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      cooked: [],
      isSaved: (id) => get().savedIds.includes(id),
      toggleSaved: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((i) => i !== id)
            : [...s.savedIds, id],
        })),
      logCooked: (recipeId, rating, swaps) =>
        set((s) => ({ cooked: [{ recipeId, rating, swaps, at: Date.now() }, ...s.cooked] })),
    }),
    { name: 'sous-chef.saved' },
  ),
)

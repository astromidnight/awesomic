import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultPantry } from '../data/recipes'

interface PantryState {
  /** ingredient ids the user has */
  items: string[]
  onboarded: boolean
  has: (id: string) => boolean
  asSet: () => Set<string>
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
  setAll: (ids: string[]) => void
  completeOnboarding: (ids: string[]) => void
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set, get) => ({
      items: defaultPantry,
      onboarded: false,
      has: (id) => get().items.includes(id),
      asSet: () => new Set(get().items),
      toggle: (id) =>
        set((s) => ({
          items: s.items.includes(id) ? s.items.filter((i) => i !== id) : [...s.items, id],
        })),
      add: (id) => set((s) => (s.items.includes(id) ? s : { items: [...s.items, id] })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i !== id) })),
      setAll: (ids) => set({ items: [...new Set(ids)] }),
      completeOnboarding: (ids) => set({ items: [...new Set(ids)], onboarded: true }),
    }),
    { name: 'sous-chef.pantry' },
  ),
)

/** Reactive pantry as a Set — memo-friendly selector. */
export const usePantrySet = (): Set<string> => {
  const items = usePantryStore((s) => s.items)
  return new Set(items)
}

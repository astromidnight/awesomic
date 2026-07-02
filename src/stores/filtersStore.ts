import { create } from 'zustand'
import type { Diet, Intolerance, Equipment, Difficulty, Recipe } from '../data/types'

export const MAX_TIME_LIMIT = 60

export type SortKey = 'Relevance' | 'Rating' | 'Time' | 'Calories'

interface FiltersState {
  query: string
  diets: Diet[]
  intolerances: Intolerance[]
  equipment: Equipment[]
  skill: Difficulty | null
  /** minutes; MAX_TIME_LIMIT means "no limit" */
  maxTime: number
  sort: SortKey
  setQuery: (q: string) => void
  toggleDiet: (d: Diet) => void
  toggleIntolerance: (i: Intolerance) => void
  toggleEquipment: (e: Equipment) => void
  setSkill: (s: Difficulty | null) => void
  setMaxTime: (m: number) => void
  setSort: (s: SortKey) => void
  removeFilter: (label: string) => void
  reset: () => void
}

const toggle = <T,>(arr: T[], v: T): T[] =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

export const useFiltersStore = create<FiltersState>((set) => ({
  query: '',
  diets: [],
  intolerances: [],
  equipment: [],
  skill: null,
  maxTime: MAX_TIME_LIMIT,
  sort: 'Relevance',
  setQuery: (query) => set({ query }),
  toggleDiet: (d) => set((s) => ({ diets: toggle(s.diets, d) })),
  toggleIntolerance: (i) => set((s) => ({ intolerances: toggle(s.intolerances, i) })),
  toggleEquipment: (e) => set((s) => ({ equipment: toggle(s.equipment, e) })),
  setSkill: (skill) => set({ skill }),
  setMaxTime: (maxTime) => set({ maxTime }),
  setSort: (sort) => set({ sort }),
  removeFilter: (label) =>
    set((s) => {
      if (label.startsWith('<')) return { maxTime: MAX_TIME_LIMIT }
      return {
        diets: s.diets.filter((d) => d !== label),
        intolerances: s.intolerances.filter((i) => i !== label),
        equipment: s.equipment.filter((e) => e !== label),
        skill: s.skill === label ? null : s.skill,
      }
    }),
  reset: () =>
    set({ diets: [], intolerances: [], equipment: [], skill: null, maxTime: MAX_TIME_LIMIT }),
}))

/** Active-filter pills for the results header, e.g. ["Vegan", "<30 min", "Air-fryer"]. */
export function activeFilterLabels(s: Pick<FiltersState, 'diets' | 'intolerances' | 'equipment' | 'skill' | 'maxTime'>): string[] {
  const labels: string[] = [...s.diets, ...s.intolerances, ...s.equipment]
  if (s.skill) labels.push(s.skill)
  if (s.maxTime < MAX_TIME_LIMIT) labels.push(`<${s.maxTime} min`)
  return labels
}

const skillRank: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 }

/** Filtering actually filters the list — nothing on screen is faked. */
export function applyFilters(
  list: Recipe[],
  s: Pick<FiltersState, 'diets' | 'intolerances' | 'equipment' | 'skill' | 'maxTime' | 'sort'>,
): Recipe[] {
  const filtered = list.filter((r) => {
    if (s.diets.length && !s.diets.every((d) => r.diets.includes(d))) return false
    if (s.intolerances.length && !s.intolerances.every((i) => r.freeOf.includes(i))) return false
    if (s.equipment.length && !s.equipment.some((e) => r.equipment.includes(e))) return false
    if (s.skill && skillRank[r.difficulty] > skillRank[s.skill]) return false
    if (r.timeMinutes > s.maxTime) return false
    return true
  })
  switch (s.sort) {
    case 'Rating':
      return [...filtered].sort((a, b) => b.rating - a.rating)
    case 'Time':
      return [...filtered].sort((a, b) => a.timeMinutes - b.timeMinutes)
    case 'Calories':
      return [...filtered].sort((a, b) => a.kcal - b.kcal)
    default:
      return filtered
  }
}

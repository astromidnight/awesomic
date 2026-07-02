import { create } from 'zustand'
import type { Recipe, Ingredient, AppliedSwap } from '../data/types'
import { applySubstitution, type SwapResult } from '../lib/substitute'
import { haptics } from '../lib/haptics'

export type CookStatus = 'idle' | 'cooking' | 'paused' | 'done'

interface CookSessionState {
  recipe: Recipe | null
  status: CookStatus
  stepIndex: number
  /** live, swap-adjusted state */
  ingredients: Ingredient[]
  kcal: number
  timeMinutes: number
  swaps: AppliedSwap[]
  /** swap currently surfaced on the Voice Swap Card */
  lastSwap: AppliedSwap | null
  lastSwapSummary: string
  timerRemaining: number
  timerTotal: number
  timerRunning: boolean

  start: (recipe: Recipe) => void
  exit: () => void
  next: () => boolean
  prev: () => void
  pauseToggle: () => void
  finish: () => void
  requestSwap: (saidIngredient: string, heard: string, pantry: ReadonlySet<string>) => SwapResult
  undoLastSwap: () => void
  dismissSwapCard: () => void
  startTimer: () => void
  toggleTimer: () => void
  tick: () => void
}

function timerFor(recipe: Recipe | null, stepIndex: number): number {
  return recipe?.steps[stepIndex]?.timerSeconds ?? 0
}

export const useCookSessionStore = create<CookSessionState>((set, get) => ({
  recipe: null,
  status: 'idle',
  stepIndex: 0,
  ingredients: [],
  kcal: 0,
  timeMinutes: 0,
  swaps: [],
  lastSwap: null,
  lastSwapSummary: '',
  timerRemaining: 0,
  timerTotal: 0,
  timerRunning: false,

  start: (recipe) =>
    set({
      recipe,
      status: 'cooking',
      stepIndex: 0,
      ingredients: recipe.ingredients,
      kcal: recipe.kcal,
      timeMinutes: recipe.timeMinutes,
      swaps: [],
      lastSwap: null,
      lastSwapSummary: '',
      timerRemaining: timerFor(recipe, 0),
      timerTotal: timerFor(recipe, 0),
      timerRunning: timerFor(recipe, 0) > 0,
    }),

  exit: () => set({ recipe: null, status: 'idle', stepIndex: 0, swaps: [], lastSwap: null }),

  /** advance; returns false when already on the last step (caller → completion) */
  next: () => {
    const { recipe, stepIndex } = get()
    if (!recipe) return false
    if (stepIndex >= recipe.steps.length - 1) return false
    const i = stepIndex + 1
    haptics.step()
    set({
      stepIndex: i,
      lastSwap: null,
      timerRemaining: timerFor(recipe, i),
      timerTotal: timerFor(recipe, i),
      timerRunning: timerFor(recipe, i) > 0,
    })
    return true
  },

  prev: () => {
    const { recipe, stepIndex } = get()
    if (!recipe || stepIndex === 0) return
    const i = stepIndex - 1
    haptics.step()
    set({
      stepIndex: i,
      lastSwap: null,
      timerRemaining: timerFor(recipe, i),
      timerTotal: timerFor(recipe, i),
      timerRunning: timerFor(recipe, i) > 0,
    })
  },

  pauseToggle: () =>
    set((s) => ({ status: s.status === 'paused' ? 'cooking' : 'paused', timerRunning: false })),

  finish: () => {
    haptics.done()
    set({ status: 'done', timerRunning: false })
  },

  requestSwap: (saidIngredient, heard, pantry) => {
    const s = get()
    const result = applySubstitution(s.ingredients, saidIngredient, heard, pantry)
    if (result.ok) {
      haptics.swap()
      set({
        ingredients: result.ingredients,
        swaps: [...s.swaps, result.swap],
        lastSwap: result.swap,
        lastSwapSummary: result.summary,
        kcal: s.kcal + result.swap.deltaKcal,
        timeMinutes: s.timeMinutes + result.swap.deltaTimeMinutes,
      })
    }
    return result
  },

  undoLastSwap: () => {
    const s = get()
    const last = s.lastSwap
    if (!last) return
    set({
      ingredients: s.ingredients.map((i) => (i.id === last.to.id ? last.from : i)),
      swaps: s.swaps.filter((x) => x !== last),
      lastSwap: null,
      kcal: s.kcal - last.deltaKcal,
      timeMinutes: s.timeMinutes - last.deltaTimeMinutes,
    })
  },

  dismissSwapCard: () => set({ lastSwap: null }),

  startTimer: () => {
    const { recipe, stepIndex, timerRemaining } = get()
    const total = timerRemaining > 0 ? timerRemaining : timerFor(recipe, stepIndex) || 120
    set({ timerRemaining: total, timerTotal: total, timerRunning: true })
  },

  toggleTimer: () => set((s) => ({ timerRunning: !s.timerRunning && s.timerRemaining > 0 })),

  tick: () => {
    const { timerRunning, timerRemaining, status } = get()
    if (!timerRunning || status !== 'cooking') return
    if (timerRemaining <= 1) {
      haptics.step()
      set({ timerRemaining: 0, timerRunning: false })
    } else {
      set({ timerRemaining: timerRemaining - 1 })
    }
  },
}))

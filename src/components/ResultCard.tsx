import { motion } from 'framer-motion'
import type { Recipe } from '../data/types'
import type { PantryMatch } from '../data/types'
import { RecipeImage } from './RecipeCard'

interface ResultCardProps {
  recipe: Recipe
  match: PantryMatch
  onOpen: () => void
}

export function ResultCard({ recipe, match, onOpen }: ResultCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-start gap-3 rounded-2xl bg-ink-0 py-[10px] pr-[14px] pl-[10px] text-left shadow-result"
    >
      <motion.div
        layoutId={`recipe-img-${recipe.id}`}
        className="size-[88px] shrink-0 overflow-hidden rounded-xl"
      >
        <RecipeImage recipe={recipe} className="size-full" />
      </motion.div>
      <div className="flex min-w-0 flex-1 flex-col gap-[7px] pt-1">
        <h3 className="truncate text-[14.5px] font-semibold text-ink-900">{recipe.title}</h3>
        <p className="flex items-center gap-[5px]">
          <span className="text-[12px] text-star">★</span>
          <span className="text-[11.5px] text-ink-600">
            {recipe.rating} · {recipe.timeMinutes} min · {recipe.kcal} kcal
          </span>
        </p>
        <div className="flex items-center gap-2">
          <span className="h-[6px] w-[64px] overflow-hidden rounded-full bg-ink-200">
            <span
              className="block h-full rounded-full bg-emerald-500"
              style={{ width: `${(match.owned / match.total) * 100}%` }}
            />
          </span>
          <span className="text-[11px] font-semibold text-ink-600">
            {match.owned}/{match.total} in pantry
          </span>
        </div>
      </div>
    </motion.button>
  )
}

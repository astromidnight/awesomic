import { BookmarkSimple } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { Recipe } from '../data/types'
import { useSavedStore } from '../stores/savedStore'

export function RecipeImage({ recipe, className = '' }: { recipe: Recipe; className?: string }) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `linear-gradient(144deg, ${recipe.gradient[0]} 0%, ${recipe.gradient[1]} 66.7%)`,
      }}
    >
      {recipe.image && (
        <img src={recipe.image} alt="" className="size-full object-cover" loading="lazy" />
      )}
    </div>
  )
}

export function PantryBadge({ pct }: { pct: number }) {
  return (
    <span className="absolute top-[10px] left-[10px] flex items-center gap-1 rounded-full bg-ink-0 py-[5px] pr-[9px] pl-2 shadow-badge">
      <span className="size-[6px] rounded-full bg-emerald-500" />
      <span className="text-[11px] font-semibold text-emerald-700">{pct}% in pantry</span>
    </span>
  )
}

interface RecipeCardProps {
  recipe: Recipe
  pantryPct: number
  onOpen: () => void
  /** carousel cards are fixed 210px; grid cards flex */
  fixed?: boolean
}

export function RecipeCard({ recipe, pantryPct, onOpen, fixed = false }: RecipeCardProps) {
  const isSaved = useSavedStore((s) => s.savedIds.includes(recipe.id))
  const toggleSaved = useSavedStore((s) => s.toggleSaved)

  return (
    <motion.article
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-[18px] bg-ink-0 shadow-card ${
        fixed ? 'w-[210px] shrink-0' : 'min-w-0 flex-1'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${recipe.title}`}
        className="block w-full text-left"
      >
        <div className="relative h-[132px] w-full overflow-hidden">
          <motion.div layoutId={`recipe-img-${recipe.id}`} className="absolute inset-0">
            <RecipeImage recipe={recipe} className="size-full" />
          </motion.div>
          <PantryBadge pct={pantryPct} />
        </div>
        <div className="flex flex-col gap-[7px] px-3 pt-[10px] pb-[13px]">
          <h3 className="truncate text-[14px] font-semibold text-ink-900">{recipe.title}</h3>
          <p className="flex items-center gap-[6px] text-[12px]">
            <span className="text-star">★</span>
            <span className="text-ink-600">
              {recipe.rating} · {recipe.timeMinutes} min
            </span>
          </p>
        </div>
      </button>
      <button
        type="button"
        onClick={() => toggleSaved(recipe.id)}
        aria-label={isSaved ? `Remove ${recipe.title} from cookbook` : `Save ${recipe.title}`}
        aria-pressed={isSaved}
        className="absolute top-[10px] right-[10px] flex size-[30px] items-center justify-center rounded-full bg-ink-0 shadow-badge after:absolute after:-inset-2 after:content-['']"
      >
        <BookmarkSimple
          size={16}
          weight={isSaved ? 'fill' : 'regular'}
          className={isSaved ? 'text-emerald-500' : 'text-ink-900'}
        />
      </button>
    </motion.article>
  )
}

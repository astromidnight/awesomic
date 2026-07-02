import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CaretLeft, Heart, Microphone } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar } from '../components/StatusBar'
import { Tabs } from '../components/inputs'
import { PantryBanner } from '../components/PantryBanner'
import { IngredientRow } from '../components/IngredientRow'
import { Button } from '../components/Button'
import { repo } from '../data/repository'
import { heroImages } from '../data/recipes'
import { findSubstitutes } from '../data/substitutions'
import { usePantrySet } from '../stores/pantryStore'
import { useSavedStore } from '../stores/savedStore'
import { pantryMatch } from '../lib/pantryMatch'
import { kcalFor } from '../data/nutrition'
import { formatQty } from '../lib/format'

const TABS = ['Ingredients', 'Steps', 'Nutrition'] as const

export function RecipeDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const recipe = repo.byId(id)
  const pantry = usePantrySet()
  const isSaved = useSavedStore((s) => s.savedIds.includes(id))
  const toggleSaved = useSavedStore((s) => s.toggleSaved)
  const [tab, setTab] = useState<string>('Ingredients')
  const [listed, setListed] = useState<string[]>([])

  const match = useMemo(
    () => (recipe ? pantryMatch(recipe, pantry) : null),
    [recipe, pantry],
  )

  if (!recipe || !match) {
    navigate('/', { replace: true })
    return null
  }

  const missingCount = match.total - match.owned
  const hero = heroImages[recipe.id] ?? recipe.image

  const rowState = (ingId: string) => {
    if (pantry.has(ingId)) return 'pantry' as const
    const subs = findSubstitutes(ingId)
    return subs.some((s) => pantry.has(s.to)) ? ('swap' as const) : ('add' as const)
  }

  return (
    <Page className="bg-surface">
      {/* hero */}
      <div className="relative h-[290px] w-full shrink-0 overflow-hidden">
        <motion.div layoutId={`recipe-img-${recipe.id}`} className="absolute inset-0">
          <div
            className="size-full"
            style={{
              backgroundImage: `linear-gradient(132deg, ${recipe.gradient[0]} 0%, ${recipe.gradient[1]} 66.7%)`,
            }}
          >
            {hero && <img src={hero} alt={recipe.title} className="size-full object-cover" />}
          </div>
        </motion.div>
        <div className="absolute inset-x-0 top-0">
          <StatusBar theme="light" />
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="absolute top-[52px] left-4 flex size-10 items-center justify-center rounded-full bg-ink-0 shadow-float after:absolute after:-inset-1.5 after:content-['']"
        >
          <CaretLeft size={20} className="text-ink-900" />
        </button>
        <button
          type="button"
          onClick={() => toggleSaved(recipe.id)}
          aria-label={isSaved ? 'Remove from cookbook' : 'Save to cookbook'}
          aria-pressed={isSaved}
          className="absolute top-[52px] right-4 flex size-10 items-center justify-center rounded-full bg-ink-0 shadow-float after:absolute after:-inset-1.5 after:content-['']"
        >
          <Heart
            size={20}
            weight={isSaved ? 'fill' : 'regular'}
            className={isSaved ? 'text-danger-500' : 'text-ink-900'}
          />
        </button>
        <span className="absolute bottom-[38px] left-4 flex items-center gap-[5px] rounded-full bg-ink-0 py-[6px] pr-3 pl-[10px] shadow-badge">
          <Microphone size={13} weight="fill" className="text-emerald-500" />
          <span className="text-[11px] font-semibold text-ink-900">Voice-ready recipe</span>
        </span>
      </div>

      {/* content card overlapping the hero */}
      <div className="no-scrollbar -mt-6 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-t-3xl bg-surface px-5 pt-8 pb-4">
        <h1 className="text-[23px] font-bold text-ink-900">{recipe.title}</h1>
        <p className="flex items-center gap-2 text-[12.5px]">
          <span className="text-[13px] text-star">★</span>
          <span className="font-medium text-ink-900">
            {recipe.rating} ({recipe.ratingCount})
          </span>
          <span className="text-ink-600">· {recipe.timeMinutes} min</span>
          <span className="text-ink-600">· {recipe.difficulty}</span>
          <span className="text-ink-600">· {recipe.kcal} kcal</span>
        </p>

        <PantryBanner match={match} />
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <div className="h-px w-full shrink-0 bg-ink-200" />

        {tab === 'Ingredients' && (
          <div className="flex flex-col gap-[15px]">
            {recipe.ingredients.map((ing) => {
              const state = rowState(ing.id)
              return (
                <div key={ing.id} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <IngredientRow
                      ingredient={ing}
                      state={state}
                      onAdd={() => setListed((l) => (l.includes(ing.id) ? l : [...l, ing.id]))}
                    />
                  </div>
                  {state === 'add' && listed.includes(ing.id) && (
                    <span className="shrink-0 text-[11px] font-semibold text-emerald-700">
                      on list ✓
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'Steps' && (
          <ol className="flex flex-col gap-[15px]">
            {recipe.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700">
                  {i + 1}
                </span>
                <p className="text-[13px] leading-normal text-ink-900">{s.text}</p>
              </li>
            ))}
          </ol>
        )}

        {tab === 'Nutrition' && (
          <div className="flex flex-col gap-[15px]">
            <div className="flex w-full items-center justify-between rounded-[14px] bg-ink-50 px-[14px] py-[13px]">
              <span className="text-[13px] font-semibold text-ink-900">Per serving</span>
              <span className="text-[13px] font-bold text-ink-900">{recipe.kcal} kcal</span>
            </div>
            {recipe.ingredients.map((ing) => {
              const kcal = kcalFor(ing.id, ing.unit, ing.quantity)
              return (
                <div key={ing.id} className="flex w-full items-center justify-between text-[13px]">
                  <span className="text-ink-900">
                    <span className="font-semibold">
                      {formatQty(ing.quantity)} {ing.unit}
                    </span>{' '}
                    {ing.name}
                  </span>
                  <span className="text-ink-600">{kcal !== undefined ? `${kcal} kcal` : '—'}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* sticky footer */}
      <div className="flex w-full shrink-0 flex-col gap-[10px] bg-ink-0 px-5 pt-3 pb-[18px] shadow-nav">
        <Button
          onClick={() => navigate(`/cook/${recipe.id}`)}
          icon={<Microphone size={18} />}
          className="w-full py-4"
        >
          Start Sous-Chef Mode
        </Button>
        {missingCount > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setListed(match.missing.map((m) => m.id))}
          >
            {listed.length >= missingCount
              ? `${missingCount} on your list ✓`
              : `Add ${missingCount} missing to list`}
          </Button>
        )}
      </div>
    </Page>
  )
}

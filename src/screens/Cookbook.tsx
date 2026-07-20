import { useNavigate } from 'react-router-dom'
import { BookOpen } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar } from '../components/StatusBar'
import { BottomNav } from '../components/BottomNav'
import { ResultCard } from '../components/ResultCard'
import { repo } from '../data/repository'
import { useSavedStore } from '../stores/savedStore'
import { usePantrySet } from '../stores/pantryStore'
import { pantryMatch } from '../lib/pantryMatch'

export function Cookbook() {
  const navigate = useNavigate()
  const savedIds = useSavedStore((s) => s.savedIds)
  const cooked = useSavedStore((s) => s.cooked)
  const pantry = usePantrySet()
  const saved = savedIds.map((id) => repo.byId(id)).filter((r) => r !== undefined)

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-2 pb-4">
        <header className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold text-ink-900">Cookbook</h1>
          <p className="text-[13px] text-ink-600">
            {saved.length} saved · {cooked.length} cooked
          </p>
        </header>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center gap-3 pt-14 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-peach-100">
              <BookOpen size={28} className="text-amber-500" />
            </span>
            <p className="text-[16px] font-semibold text-ink-900">No saved recipes yet</p>
            <p className="w-[260px] text-[13px] text-ink-600">
              Tap the bookmark on any recipe — or finish a cook — and it will live here.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-1 rounded-full bg-emerald-500 px-5 py-[9px] text-[13px] font-semibold text-ink-0"
            >
              Browse recipes
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {saved.map((r) => (
              <ResultCard
                key={r.id}
                recipe={r}
                match={pantryMatch(r, pantry)}
                onOpen={() => navigate(`/recipe/${r.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </Page>
  )
}

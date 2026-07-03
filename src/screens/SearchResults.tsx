import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaretLeft, MagnifyingGlass, X, Funnel, CaretDown, SlidersHorizontal, ForkKnife } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar } from '../components/StatusBar'
import { FilterPill } from '../components/chips'
import { ResultCard } from '../components/ResultCard'
import { ResultCardSkeleton } from '../components/Skeleton'
import { FilterSheet } from './FilterSheet'
import { repo } from '../data/repository'
import { usePantrySet } from '../stores/pantryStore'
import { useFiltersStore, activeFilterLabels, applyFilters, type SortKey } from '../stores/filtersStore'
import { pantryMatch } from '../lib/pantryMatch'

const SORT_KEYS: SortKey[] = ['Relevance', 'Rating', 'Time', 'Calories']

export function SearchResults() {
  const navigate = useNavigate()
  const pantry = usePantrySet()
  const filters = useFiltersStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const results = useMemo(
    () => applyFilters(repo.search(filters.query), filters),
    [filters],
  )
  const pills = activeFilterLabels(filters)

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />

      {/* sticky header */}
      <div className="flex w-full flex-col gap-[14px] px-5 pt-[6px] pb-[14px]">
        <div className="flex w-full items-center gap-[10px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="relative flex size-10 shrink-0 items-center justify-center rounded-full after:absolute after:-inset-1 after:content-['']"
          >
            <CaretLeft size={22} className="text-ink-900" />
          </button>
          <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl bg-ink-100 px-3">
            <MagnifyingGlass size={18} className="shrink-0 text-ink-600" />
            <input
              ref={inputRef}
              value={filters.query}
              onChange={(e) => filters.setQuery(e.target.value)}
              placeholder="Search recipes"
              aria-label="Search recipes"
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-ink-900 outline-none placeholder:text-ink-600"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => {
                  filters.setQuery('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="relative shrink-0 after:absolute after:-inset-2 after:content-['']"
              >
                <X size={16} className="text-ink-600" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label="Open filters"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50"
          >
            <Funnel size={20} className="text-emerald-700" />
          </button>
        </div>

        {pills.length > 0 && (
          <div className="no-scrollbar -mx-5 -my-1 flex shrink-0 gap-2 overflow-x-auto px-5 py-1">
            {pills.map((label) => (
              <FilterPill key={label} label={label} onRemove={() => filters.removeFilter(label)} />
            ))}
          </div>
        )}

        <div className="flex w-full items-center justify-between">
          <p className="text-[16px] font-bold text-ink-900" aria-live="polite">
            {results.length} {results.length === 1 ? 'recipe' : 'recipes'}
          </p>
          <button
            type="button"
            onClick={() => {
              const i = SORT_KEYS.indexOf(filters.sort)
              filters.setSort(SORT_KEYS[(i + 1) % SORT_KEYS.length])
            }}
            className="relative flex items-center gap-[5px] after:absolute after:-inset-2 after:content-['']"
          >
            <span className="text-[12px] font-medium text-ink-600">Sort: {filters.sort}</span>
            <CaretDown size={14} className="text-ink-600" />
          </button>
        </div>
      </div>

      {/* results */}
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pt-[2px] pb-[90px]">
        {loading ? (
          Array.from({ length: 5 }, (_, i) => <ResultCardSkeleton key={i} />)
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-3 pt-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-peach-100">
              <ForkKnife size={28} className="text-amber-500" />
            </span>
            <p className="text-[16px] font-semibold text-ink-900">No recipes found</p>
            <p className="w-[260px] text-[13px] text-ink-600">
              Try a different search, or loosen a filter or two.
            </p>
            <button
              type="button"
              onClick={filters.reset}
              className="mt-1 rounded-full bg-emerald-500 px-5 py-[9px] text-[13px] font-semibold text-ink-0"
            >
              Clear filters
            </button>
          </div>
        ) : (
          results.map((r) => (
            <ResultCard
              key={r.id}
              recipe={r}
              match={pantryMatch(r, pantry)}
              onOpen={() => navigate(`/recipe/${r.id}`)}
            />
          ))
        )}
      </div>

      {/* floating Filters button */}
      {!sheetOpen && (
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="absolute bottom-[28px] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink-900 px-[18px] py-[13px] shadow-fab"
        >
          <SlidersHorizontal size={18} className="text-ink-0" />
          <span className="text-[14px] font-semibold text-ink-0">Filters</span>
          {pills.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-ink-0">
              {pills.length}
            </span>
          )}
        </button>
      )}

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </Page>
  )
}

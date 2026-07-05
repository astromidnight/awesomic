import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar } from '../components/StatusBar'
import { SearchBar } from '../components/SearchBar'
import { TagChip } from '../components/chips'
import { SectionHeader } from '../components/SectionHeader'
import { RecipeCard } from '../components/RecipeCard'
import { BottomNav } from '../components/BottomNav'
import { Skeleton } from '../components/Skeleton'
import { repo } from '../data/repository'
import { carouselIds, recommendedIds, quickTags } from '../data/recipes'
import { usePantrySet } from '../stores/pantryStore'
import { useFiltersStore } from '../stores/filtersStore'
import { pantryMatch } from '../lib/pantryMatch'
import { todayLabel, greeting } from '../lib/format'
import avatar from '../assets/food/avatar.svg'

export function Home() {
  const navigate = useNavigate()
  const pantry = usePantrySet()
  const setQuery = useFiltersStore((s) => s.setQuery)
  const [selectedTag, setSelectedTag] = useState<string | null>('15-min')
  const [loading, setLoading] = useState(true)

  // brief skeleton pass — the data is local, but lists should feel considered
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const carousel = useMemo(() => carouselIds.map((id) => repo.byId(id)!).filter(Boolean), [])

  const recommended = useMemo(() => recommendedIds.map((id) => repo.byId(id)!).filter(Boolean), [])

  const openSearch = (tag?: string) => {
    setQuery(tag ? '' : 'garlic pasta')
    navigate('/search')
  }

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[22px] overflow-y-auto px-5 pt-2 pb-4">
        <header className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-[3px]">
            <p className="text-[11px] font-semibold tracking-[0.06em] text-ink-600">
              {todayLabel()}
            </p>
            <h1 className="text-[22px] font-bold text-ink-900">{greeting()}, Alex</h1>
          </div>
          <div className="relative size-[46px] shrink-0">
            <img src={avatar} alt="Alex's profile" className="size-full rounded-full" />
            <User
              size={24}
              weight="regular"
              className="absolute inset-0 m-auto text-ink-0"
              aria-hidden
            />
          </div>
        </header>

        <SearchBar onClick={() => openSearch()} />

        <div className="no-scrollbar -mx-5 -my-1 flex shrink-0 gap-[9px] overflow-x-auto px-5 py-1" role="list">
          {quickTags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              selected={tag === selectedTag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            />
          ))}
        </div>

        <SectionHeader title="Cook with what you have" onSeeAll={() => openSearch()} />
        {/* shrink-0: keep full height (parent column scrolls instead of
            compressing the cards). py-6/-my-6: give the card shadow (~24px
            below) room so overflow-x-auto doesn't clip it into a hard line;
            the equal negative margin keeps page spacing unchanged. */}
        <div className="no-scrollbar -mx-5 -my-6 flex shrink-0 gap-[14px] overflow-x-auto px-5 py-6">
          {loading
            ? Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-[201px] w-[210px] shrink-0 rounded-[18px]" />
              ))
            : carousel.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  fixed
                  pantryPct={pantryMatch(r, pantry).pct}
                  onOpen={() => navigate(`/recipe/${r.id}`)}
                />
              ))}
        </div>

        <SectionHeader title="Recommended for you" onSeeAll={() => openSearch()} />
        <div className="flex w-full gap-3">
          {loading
            ? Array.from({ length: 2 }, (_, i) => (
                <Skeleton key={i} className="h-[195px] flex-1 rounded-[18px]" />
              ))
            : recommended.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  pantryPct={pantryMatch(r, pantry).pct}
                  onOpen={() => navigate(`/recipe/${r.id}`)}
                />
              ))}
        </div>
      </div>
      <BottomNav />
    </Page>
  )
}

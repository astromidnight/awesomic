import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from './Page'
import { StatusBar } from '../components/StatusBar'
import { Button, IconButton } from '../components/Button'
import { TagChip, FilterPill } from '../components/chips'
import { SearchBar } from '../components/SearchBar'
import { SectionHeader } from '../components/SectionHeader'
import { RecipeCard } from '../components/RecipeCard'
import { ResultCard } from '../components/ResultCard'
import { IngredientRow } from '../components/IngredientRow'
import { PantryBanner } from '../components/PantryBanner'
import { Checkbox, Segmented, Slider, Tabs } from '../components/inputs'
import { TimerCard, VoiceSwapCard, MicIndicator, ProgressSegments } from '../components/cook'
import { BottomNav } from '../components/BottomNav'
import { Heart } from '@phosphor-icons/react'
import { repo } from '../data/repository'
import { usePantrySet } from '../stores/pantryStore'
import { pantryMatch } from '../lib/pantryMatch'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[11px] font-bold tracking-[0.06em] text-ink-600 uppercase">{title}</h2>
      {children}
    </section>
  )
}

/** Internal component-review route (/gallery) — every Figma variant, live. */
export function Gallery() {
  const navigate = useNavigate()
  const pantry = usePantrySet()
  const recipe = repo.byId('creamy-garlic-pasta')!
  const match = pantryMatch(recipe, pantry)
  const [seg, setSeg] = useState<'Easy' | 'Medium' | 'Hard' | null>('Easy')
  const [slider, setSlider] = useState(30)
  const [tab, setTab] = useState('Ingredients')

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pt-2 pb-8">
        <h1 className="text-[22px] font-bold text-ink-900">Component gallery</h1>

        <Section title="Button — Primary / Ink / Outline">
          <Button>Primary</Button>
          <Button variant="ink">Ink</Button>
          <Button variant="outline">Outline</Button>
        </Section>

        <Section title="Icon Button — Ghost / Surface / Outline">
          <div className="flex gap-3">
            <IconButton variant="ghost" label="ghost"><Heart size={20} /></IconButton>
            <IconButton variant="surface" label="surface"><Heart size={20} /></IconButton>
            <IconButton variant="outline" label="outline"><Heart size={20} /></IconButton>
          </div>
        </Section>

        <Section title="Tag Chip — Default / Selected">
          <div className="flex gap-2">
            <TagChip label="15-min" selected />
            <TagChip label="Vegan" />
          </div>
        </Section>

        <Section title="Filter Pill">
          <div className="flex gap-2">
            <FilterPill label="Vegan" onRemove={() => {}} />
            <FilterPill label="<30 min" onRemove={() => {}} />
          </div>
        </Section>

        <Section title="Search Bar">
          <SearchBar />
        </Section>

        <Section title="Section Header">
          <SectionHeader title="Cook with what you have" onSeeAll={() => {}} />
        </Section>

        <Section title="Recipe Card">
          <div className="flex">
            <RecipeCard recipe={recipe} pantryPct={match.pct} fixed onOpen={() => {}} />
          </div>
        </Section>

        <Section title="Result Card">
          <ResultCard recipe={recipe} match={match} onOpen={() => {}} />
        </Section>

        <Section title="Pantry Banner">
          <PantryBanner match={match} />
        </Section>

        <Section title="Ingredient Row — Pantry / Swap / Add">
          <IngredientRow ingredient={recipe.ingredients[0]} state="pantry" />
          <IngredientRow ingredient={recipe.ingredients[1]} state="swap" />
          <IngredientRow ingredient={recipe.ingredients[3]} state="add" />
        </Section>

        <Section title="Checkbox">
          <div className="flex gap-3">
            <Checkbox checked label="checked" />
            <Checkbox checked={false} label="unchecked" />
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs tabs={['Ingredients', 'Steps', 'Nutrition']} active={tab} onChange={setTab} />
        </Section>

        <Section title="Segmented">
          <Segmented options={['Easy', 'Medium', 'Hard'] as const} value={seg} onChange={setSeg} />
        </Section>

        <Section title="Slider">
          <Slider min={10} max={60} step={5} value={slider} onChange={setSlider} label="Max time" />
        </Section>

        <Section title="Progress Segments">
          <ProgressSegments total={6} current={1} />
        </Section>

        <Section title="Timer Card">
          <TimerCard remaining={120} running onToggle={() => {}} />
        </Section>

        <Section title="Voice Swap Card">
          <VoiceSwapCard
            swap={{
              from: recipe.ingredients[1],
              to: { id: 'olive oil', name: 'olive oil', quantity: 3, unit: 'tbsp' },
              deltaKcal: -40,
              deltaTimeMinutes: 0,
              heard: "I don't have butter",
            }}
            summary="3 tbsp · same cook time · −40 kcal"
            onUndo={() => {}}
            onKeep={() => {}}
          />
        </Section>

        <Section title="Mic Indicator + Waveform">
          <MicIndicator listening level={0.5} supported />
        </Section>

        <Button variant="outline" onClick={() => navigate('/')}>Back to app</Button>
      </div>
      <BottomNav />
    </Page>
  )
}

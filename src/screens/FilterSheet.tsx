import { useMemo } from 'react'
import { Sheet } from '../components/Sheet'
import { TagChip } from '../components/chips'
import { Segmented, Slider } from '../components/inputs'
import { Button } from '../components/Button'
import { repo } from '../data/repository'
import { useFiltersStore, applyFilters, MAX_TIME_LIMIT } from '../stores/filtersStore'
import type { Diet, Intolerance, Equipment, Difficulty } from '../data/types'

const DIETS: Diet[] = ['Vegan', 'Vegetarian', 'Keto', 'Pescatarian']
const INTOLERANCES: Intolerance[] = ['Gluten-free', 'Dairy-free', 'Nut-free']
const EQUIPMENT: Equipment[] = ['Air-fryer', 'Oven', 'Stovetop', 'Microwave']
const SKILLS: Difficulty[] = ['Easy', 'Medium', 'Hard']

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <p className="text-[12.5px] font-semibold text-ink-900">{label}</p>
      {children}
    </div>
  )
}

export function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const filters = useFiltersStore()

  // Apply button shows the live result count
  const count = useMemo(
    () => applyFilters(repo.search(filters.query), filters).length,
    [filters],
  )

  return (
    <Sheet open={open} onClose={onClose} label="Filters">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-bold text-ink-900">Filters</h2>
        <button
          type="button"
          onClick={filters.reset}
          className="relative text-[13px] font-semibold text-ink-600 after:absolute after:-inset-2 after:content-['']"
        >
          Reset
        </button>
      </div>

      <Group label="Diet">
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <TagChip
              key={d}
              label={d}
              selected={filters.diets.includes(d)}
              onClick={() => filters.toggleDiet(d)}
            />
          ))}
        </div>
      </Group>

      <Group label="Intolerances">
        <div className="flex flex-wrap gap-2">
          {INTOLERANCES.map((i) => (
            <TagChip
              key={i}
              label={i}
              selected={filters.intolerances.includes(i)}
              onClick={() => filters.toggleIntolerance(i)}
            />
          ))}
        </div>
      </Group>

      <Group label="Equipment">
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((e) => (
            <TagChip
              key={e}
              label={e}
              selected={filters.equipment.includes(e)}
              onClick={() => filters.toggleEquipment(e)}
            />
          ))}
        </div>
      </Group>

      <Group label="Skill level">
        <Segmented options={SKILLS} value={filters.skill} onChange={filters.setSkill} />
      </Group>

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between text-[12.5px] font-semibold">
          <span className="text-ink-900">Max time</span>
          <span className="text-ink-600">
            {filters.maxTime >= MAX_TIME_LIMIT ? 'Any' : `${filters.maxTime} min`}
          </span>
        </div>
        <Slider
          min={10}
          max={MAX_TIME_LIMIT}
          step={5}
          value={filters.maxTime}
          onChange={filters.setMaxTime}
          label="Maximum cooking time in minutes"
        />
      </div>

      <Button onClick={onClose}>
        Show {count} {count === 1 ? 'recipe' : 'recipes'}
      </Button>
    </Sheet>
  )
}

import { useState } from 'react'
import { Basket, Plus } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar } from '../components/StatusBar'
import { BottomNav } from '../components/BottomNav'
import { usePantryStore } from '../stores/pantryStore'
import { defaultPantry } from '../data/recipes'

/** Live pantry editor — every % badge and swap decision reads from here. */
export function Pantry() {
  const items = usePantryStore((s) => s.items)
  const toggle = usePantryStore((s) => s.toggle)
  const add = usePantryStore((s) => s.add)
  const [draft, setDraft] = useState('')

  const all = [...new Set([...defaultPantry, ...items])].sort()

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-2 pb-4">
        <header className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold text-ink-900">Your pantry</h1>
          <p className="text-[13px] text-ink-600" aria-live="polite">
            {items.length} ingredients — recipes update live as you edit.
          </p>
        </header>

        <form
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const v = draft.trim().toLowerCase()
            if (v) add(v)
            setDraft('')
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add an ingredient"
            aria-label="Add an ingredient"
            className="h-11 min-w-0 flex-1 rounded-xl bg-ink-0 px-4 text-[14px] font-medium text-ink-900 shadow-result outline-none placeholder:text-ink-600"
          />
          <button
            type="submit"
            aria-label="Add ingredient"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-500"
          >
            <Plus size={20} className="text-ink-0" />
          </button>
        </form>

        {items.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-10 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-peach-100">
              <Basket size={28} className="text-amber-500" />
            </span>
            <p className="text-[16px] font-semibold text-ink-900">Your pantry is empty</p>
            <p className="w-[250px] text-[13px] text-ink-600">
              Add what you have and Sous-Chef will show what you can cook right now.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {all.map((id) => {
            const on = items.includes(id)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(id)}
                className={`rounded-full px-[14px] py-[9px] text-[13px] font-medium transition-colors ${
                  on ? 'bg-emerald-700 text-ink-0' : 'border border-ink-200 bg-ink-0 text-ink-900'
                }`}
              >
                {id}
              </button>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </Page>
  )
}

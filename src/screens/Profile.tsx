import { Microphone, Bell, Moon, Question, CaretRight } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar } from '../components/StatusBar'
import { BottomNav } from '../components/BottomNav'
import { useSavedStore } from '../stores/savedStore'
import { usePantryStore } from '../stores/pantryStore'
import avatar from '../assets/food/avatar.svg'

function Row({ icon: IconCmp, label, hint }: { icon: Icon; label: string; hint?: string }) {
  return (
    <button
      type="button"
      className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-ink-0 px-4 py-3 shadow-result"
    >
      <IconCmp size={20} className="shrink-0 text-ink-600" />
      <span className="flex-1 text-left text-[14px] font-medium text-ink-900">{label}</span>
      {hint && <span className="text-[12px] text-ink-600">{hint}</span>}
      <CaretRight size={16} className="text-ink-400" />
    </button>
  )
}

export function Profile() {
  const cooked = useSavedStore((s) => s.cooked)
  const saved = useSavedStore((s) => s.savedIds)
  const pantryCount = usePantryStore((s) => s.items.length)

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-2 pb-4">
        <header className="flex items-center gap-4">
          <img src={avatar} alt="" className="size-16 rounded-full" />
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-[22px] font-bold text-ink-900">Alex</h1>
            <p className="text-[13px] text-ink-600">Home cook · hands-free convert</p>
          </div>
        </header>

        <div className="flex w-full gap-3">
          {[
            [cooked.length, 'cooked'],
            [saved.length, 'saved'],
            [pantryCount, 'in pantry'],
          ].map(([n, label]) => (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-1 rounded-[18px] bg-ink-0 py-4 shadow-card"
            >
              <span className="text-[22px] font-bold text-ink-900">{n}</span>
              <span className="text-[11px] font-semibold tracking-[0.06em] text-ink-600 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Row icon={Microphone} label="Narration voice" hint="System default" />
          <Row icon={Bell} label="Timers & alerts" hint="On" />
          <Row icon={Moon} label="Appearance" hint="Light" />
          <Row icon={Question} label="How voice mode works" />
        </div>
      </div>
      <BottomNav />
    </Page>
  )
}

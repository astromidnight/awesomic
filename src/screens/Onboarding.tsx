import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, Camera, PencilSimple, ChefHat, Sparkle, Check } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar, HomeIndicator } from '../components/StatusBar'
import { Button } from '../components/Button'
import { defaultPantry } from '../data/recipes'
import { usePantryStore } from '../stores/pantryStore'

type Stage = 'welcome' | 'method' | 'confirm'

interface MethodProps {
  icon: Icon
  title: string
  desc: string
  onClick: () => void
}

function MethodCard({ icon: IconCmp, title, desc, onClick }: MethodProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-[18px] bg-ink-0 p-4 text-left shadow-card"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-peach-100">
        <IconCmp size={24} className="text-amber-500" />
      </span>
      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[15px] font-semibold text-ink-900">{title}</span>
        <span className="text-[12.5px] text-ink-600">{desc}</span>
      </span>
    </motion.button>
  )
}

/**
 * Flow 0 — welcome, pantry capture (scan / snap / manual / skip), then a
 * confirmation of detected ingredients as chips. Populates the pantry store
 * the whole app reads from.
 */
export function Onboarding() {
  const navigate = useNavigate()
  const completeOnboarding = usePantryStore((s) => s.completeOnboarding)
  const [stage, setStage] = useState<Stage>('welcome')
  const [detecting, setDetecting] = useState(false)
  const [selected, setSelected] = useState<string[]>(defaultPantry)

  const detect = () => {
    // simulate detection latency, then confirm chips
    setDetecting(true)
    setTimeout(() => {
      setDetecting(false)
      setSelected(defaultPantry)
      setStage('confirm')
    }, 900)
  }

  const finish = (ids: string[]) => {
    completeOnboarding(ids)
    navigate('/', { replace: true })
  }

  return (
    <Page className="bg-app">
      <StatusBar theme="dark" />
      <AnimatePresence mode="wait">
        {stage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -16 }}
            className="flex min-h-0 flex-1 flex-col px-5 pb-6"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <motion.span
                initial={{ scale: 0.8, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="flex size-24 items-center justify-center rounded-[28px] bg-peach-100"
              >
                <ChefHat size={48} className="text-amber-500" />
              </motion.span>
              <div className="flex flex-col gap-3">
                <h1 className="text-[34px] leading-[1.1] font-bold text-ink-900">
                  Cook with your
                  <br />
                  hands, not your
                  <br />
                  screen.
                </h1>
                <p className="mx-auto w-[290px] text-[15px] leading-[1.5] text-ink-600">
                  Sous-Chef narrates every step out loud and swaps missing ingredients the moment
                  you say so.
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                <Sparkle size={14} weight="fill" className="text-emerald-500" />
                <span className="text-[12px] font-semibold text-emerald-700">
                  “I don’t have butter” → swapped, recalculated, narrated
                </span>
              </span>
            </div>
            <Button onClick={() => setStage('method')} className="w-full">
              Get started
            </Button>
          </motion.div>
        )}

        {stage === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="flex min-h-0 flex-1 flex-col gap-6 px-5 pt-4 pb-6"
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-[26px] leading-[1.2] font-bold text-ink-900">Add your pantry</h1>
              <p className="text-[14px] leading-[1.5] text-ink-600">
                This powers everything: “% in pantry”, smart search and live voice swaps.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <MethodCard
                icon={Receipt}
                title="Scan a receipt"
                desc="We'll read your groceries off the paper"
                onClick={detect}
              />
              <MethodCard
                icon={Camera}
                title="Snap your shelf"
                desc="Point the camera at your pantry"
                onClick={detect}
              />
              <MethodCard
                icon={PencilSimple}
                title="Add manually"
                desc="Pick from common ingredients"
                onClick={() => {
                  setSelected([])
                  setStage('confirm')
                }}
              />
            </div>
            {detecting && (
              <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-ink-600">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="size-4 rounded-full border-2 border-emerald-500 border-t-transparent"
                />
                Detecting ingredients…
              </div>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => finish(defaultPantry)}
              className="mx-auto text-[14px] font-semibold text-ink-600"
            >
              Skip for now
            </button>
          </motion.div>
        )}

        {stage === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex min-h-0 flex-1 flex-col gap-5 px-5 pt-4 pb-6"
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-[26px] leading-[1.2] font-bold text-ink-900">
                {selected.length > 0 ? 'Here’s what we found' : 'Build your pantry'}
              </h1>
              <p className="text-[14px] leading-[1.5] text-ink-600" aria-live="polite">
                {selected.length} ingredient{selected.length === 1 ? '' : 's'} in your pantry. Tap
                to toggle.
              </p>
            </div>
            <div className="no-scrollbar flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto">
              {defaultPantry.map((id) => {
                const on = selected.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setSelected((sel) => (on ? sel.filter((x) => x !== id) : [...sel, id]))
                    }
                    className={`flex items-center gap-[5px] rounded-full px-[14px] py-[9px] text-[13px] font-medium transition-colors ${
                      on
                        ? 'bg-emerald-700 text-ink-0'
                        : 'border border-ink-200 bg-ink-0 text-ink-900'
                    }`}
                  >
                    {on && <Check size={12} weight="bold" />}
                    {id}
                  </button>
                )
              })}
            </div>
            <Button onClick={() => finish(selected)} className="w-full">
              Looks right — let’s cook
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pb-2">
        <HomeIndicator />
      </div>
    </Page>
  )
}

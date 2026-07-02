import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Star, ArrowsClockwise, BookmarkSimple, Check } from '@phosphor-icons/react'
import { Page } from './Page'
import { StatusBar, HomeIndicator } from '../components/StatusBar'
import { Button } from '../components/Button'
import { repo } from '../data/repository'
import { useCookSessionStore } from '../stores/cookSessionStore'
import { useSavedStore } from '../stores/savedStore'
import { formatQty } from '../lib/format'

const CONFETTI = ['#10B981', '#F59E0B', '#FFF1E6', '#3B82F6', '#EF4444', '#D1FAE5']

function Confetti() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
      {Array.from({ length: 24 }, (_, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 280, x: (i % 2 ? 1 : -1) * (10 + (i * 7) % 40), opacity: 0, rotate: 260 }}
          transition={{ duration: 1.6 + (i % 5) * 0.22, delay: i * 0.05, ease: 'easeIn' }}
          className="absolute size-2 rounded-[2px]"
          style={{ left: `${(i * 41) % 100}%`, backgroundColor: CONFETTI[i % CONFETTI.length] }}
        />
      ))}
    </div>
  )
}

/** Celebration — the one screen where warmth gets the lead role. */
export function Completion() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const recipe = repo.byId(id)
  const swaps = useCookSessionStore((s) => s.swaps)
  const kcal = useCookSessionStore((s) => s.kcal)
  const timeMinutes = useCookSessionStore((s) => s.timeMinutes)
  const exitSession = useCookSessionStore((s) => s.exit)
  const logCooked = useSavedStore((s) => s.logCooked)
  const toggleSaved = useSavedStore((s) => s.toggleSaved)
  const isSaved = useSavedStore((s) => s.savedIds.includes(id))
  const [rating, setRating] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!recipe) navigate('/', { replace: true })
  }, [recipe, navigate])
  if (!recipe) return null

  const done = (thenSave: boolean) => {
    if (thenSave && !isSaved) toggleSaved(recipe.id)
    logCooked(recipe.id, rating, swaps.length)
    exitSession()
    navigate('/', { replace: true })
  }

  return (
    <Page className="bg-peach-100">
      <StatusBar theme="dark" />
      <Confetti />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto px-5 pt-6 pb-4 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex size-20 items-center justify-center rounded-full bg-emerald-500 shadow-play"
        >
          <Check size={40} weight="bold" className="text-ink-0" />
        </motion.span>
        <div className="flex flex-col gap-2">
          <h1 className="text-[26px] leading-[1.2] font-bold text-ink-900">Chef’s kiss! 🎉</h1>
          <p className="text-[14px] text-ink-600">
            You cooked <span className="font-semibold text-ink-900">{recipe.title}</span>
            {swaps.length > 0 ? ' — hands-free, swaps and all.' : ' — completely hands-free.'}
          </p>
        </div>

        {/* session summary */}
        <div className="flex w-full flex-col gap-3 rounded-[18px] bg-ink-0 p-4 shadow-card">
          <div className="flex w-full items-center justify-between text-[13px]">
            <span className="font-semibold text-ink-900">Session</span>
            <span className="text-ink-600">
              {timeMinutes} min · {kcal} kcal
            </span>
          </div>
          {swaps.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-ink-100 pt-3">
              {swaps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-left">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <ArrowsClockwise size={14} className="text-emerald-700" />
                  </span>
                  <p className="min-w-0 text-[12.5px] text-ink-600">
                    <span className="font-semibold text-ink-900">{s.from.name}</span> →{' '}
                    <span className="font-semibold text-ink-900">
                      {formatQty(s.to.quantity)} {s.to.unit} {s.to.name}
                    </span>{' '}
                    ({s.deltaKcal > 0 ? '+' : ''}
                    {s.deltaKcal} kcal)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* rating */}
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-semibold text-ink-900">How was it?</p>
          <div className="flex gap-2" role="radiogroup" aria-label="Rate this recipe">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                whileTap={{ scale: 1.25 }}
                onClick={() => setRating(n)}
              >
                <Star
                  size={32}
                  weight={n <= rating ? 'fill' : 'regular'}
                  className={n <= rating ? 'text-amber-500' : 'text-ink-400'}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-[10px] px-5 pb-4">
        <Button
          onClick={() => {
            setSaved(true)
            done(true)
          }}
          icon={<BookmarkSimple size={18} weight={saved ? 'fill' : 'regular'} />}
          className="w-full"
        >
          Save to Cookbook
        </Button>
        <Button variant="outline" onClick={() => done(false)} className="w-full">
          Back to Discovery
        </Button>
      </div>
      <div className="pb-2">
        <HomeIndicator />
      </div>
    </Page>
  )
}

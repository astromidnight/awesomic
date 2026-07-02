import type { ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  label: string
}

/** Bottom sheet over a dimmed backdrop. */
export function Sheet({ open, onClose, children, label }: SheetProps) {
  const reduced = useReducedMotion()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-scrim"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={reduced ? { opacity: 0 } : { y: '100%' }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="absolute inset-x-0 bottom-0 z-50 flex flex-col gap-5 rounded-t-[26px] bg-ink-0 px-5 pt-3 pb-5"
          >
            <div className="flex w-full justify-center">
              <span aria-hidden className="h-[5px] w-[42px] rounded-full bg-ink-200" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

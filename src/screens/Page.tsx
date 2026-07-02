import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/** Full-height page wrapper with a mobile push transition (fade when reduced motion). */
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // fresh pages always start at the top of their scroll container
  useEffect(() => {
    ref.current?.querySelectorAll('.overflow-y-auto').forEach((el) => el.scrollTo(0, 0))
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`absolute inset-0 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  )
}

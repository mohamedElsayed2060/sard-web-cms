'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useTransitionUI } from './TransitionProvider'

const EASE = [0.19, 1, 0.22, 1]

export default function StackRouteTransition({ children }) {
  const pathname = usePathname() || '/'
  const { ui } = useTransitionUI()
  const variant = ui?.variant || 'doors'

  if (variant !== 'stack') return children

  return (
    <div className="relative min-h-[100dvh]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={pathname}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 140, scale: 0.96, scaleX: 0.94, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, scaleX: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -120, scale: 0.94, scaleX: 0.94, filter: 'blur(6px)' }}
          transition={{ duration: 0.85, ease: EASE }}
          style={{ willChange: 'transform, opacity, filter' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

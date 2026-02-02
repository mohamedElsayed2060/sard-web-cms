'use client'

import { AnimatePresence, motion } from 'framer-motion'
import HighlightCard from './HighlightCard'

export default function HighlightGrid({ items, lang, onSelect }) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      className="no-scroll-anchor mt-6 grid gap-3 md:gap-8 grid-cols-1 md:grid-cols-2 "
    >
      <AnimatePresence mode="popLayout">
        {items.map((h) => {
          const id = h?.id || h?.slug || h?.titleEn
          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
            >
              <HighlightCard item={h} lang={lang} onClick={() => onSelect?.(h)} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

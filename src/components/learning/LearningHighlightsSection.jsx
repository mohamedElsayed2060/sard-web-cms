// src/components/learning/LearningHighlightsSection.jsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useInView } from 'framer-motion'

import PageContentReveal from '@/components/PageContentReveal'
import useDocumentDir from '@/components/shared/useDocumentDir'

import ScrollableChips from '@/components/learning/components/ScrollableChips'
import HighlightGrid from '@/components/learning/components/HighlightGrid'
import HighlightDrawer from '@/components/learning/components/HighlightDrawer'

import { bucketFromItem, flattenPhotos } from '@/components/learning/components/highlightUtils'
import clsx from 'clsx'
import SectionReveal from '../motion/SectionReveal'

function useLockScroll(locked) {
  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [locked])
}

// ✅ helper: convert "g-2" => 2
function groupIndexFromKey(key) {
  if (!key || key === 'all') return -1
  const s = String(key)
  if (!s.startsWith('g-')) return -1
  const n = Number(s.slice(2))
  return Number.isFinite(n) ? n : -1
}

export default function LearningHighlightsSection({
  highlights,
  bgImage,
  lang = 'en',
  stripTitle,
}) {
  const dir = useDocumentDir('ltr')
  const items = Array.isArray(highlights) ? highlights : []
  if (items.length === 0) return null

  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const [activeGroup, setActiveGroup] = useState('all')
  const [visibleCount, setVisibleCount] = useState(24)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const isOpen = Boolean(active)
  useLockScroll(isOpen)

  // لما الدرور يفتح/يقفل
  useEffect(() => {
    if (!isOpen) return
    setActiveGroup('all')
    setVisibleCount(24)
    setLightboxIndex(null)
  }, [isOpen])

  // Chips
  const filters = useMemo(
    () => [
      { key: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
      { key: '2025', label: '2025' },
      { key: '2024', label: '2024' },
      { key: 'older', label: '2023–2022' },
    ],
    [lang],
  )

  // Filtered items
  const filtered = useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'older') return items.filter((x) => bucketFromItem(x) === 'older')
    return items.filter((x) => bucketFromItem(x) === filter)
  }, [items, filter])

  // ✅ Active photos based on day tab (key-based, not title-based)
  const activeAllPhotos = useMemo(() => {
    if (!active) return []

    // all: flatten (flat + groups)
    if (activeGroup === 'all') return flattenPhotos(active)

    // group: key "g-0" => index 0
    const idx = groupIndexFromKey(activeGroup)
    if (idx < 0) return []

    const g = active?.groups?.[idx]
    return (g?.photos || []).filter(Boolean)
  }, [active, activeGroup])

  const activePhotos = useMemo(
    () => activeAllPhotos.slice(0, visibleCount),
    [activeAllPhotos, visibleCount],
  )

  const closeDrawer = () => setActive(null)

  // Entrance animation
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px 0px' })

  const rootVariants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.19, 1, 0.22, 1],
        when: 'beforeChildren',
        staggerChildren: 0.075,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } },
  }

  // Fix "jump" feeling: keep scroll anchored to this section when filter changes
  const sectionRef = useRef(null)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const topInView = rect.top < 120 && rect.bottom > 120
    if (!topInView) return
    window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'smooth' })
  }, [filter])

  const stripText =
    (lang === 'ar' ? stripTitle?.ar : stripTitle?.en) ||
    (lang === 'ar' ? 'سرد · التعلم · أبرز الفعاليات' : 'Sard · Learning · Highlights')

  return (
    <section ref={sectionRef} className="bg-black px-3 max-w-[1490px] mx-auto">
      <div className="mx-auto max-w-[1490px]">
        <PageContentReveal
          bgImage={bgImage}
          className="no-scroll-anchor rounded-[24px] px-3 py-5 md:py-7  md:px-18 md:py-10"
        >
          <LayoutGroup>
            <motion.div
              ref={headerRef}
              variants={rootVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {/* Sard strip */}
              <motion.div variants={itemVariants}>
                <div className="py-3 md:py-4">
                  <div className="h-px bg-white/20" />

                  <div className="flex items-center py-4 md:py-5 italic text-2xl md:text-4xl font-semibold tracking-[0.18em] text-white/80">
                    <span>{stripText}</span>
                  </div>

                  <div className="h-px bg-white/20" />
                </div>
              </motion.div>

              {/* Filters */}
              {/* <motion.div variants={itemVariants} className="mt-6">
                <ScrollableChips items={filters} activeKey={filter} onChange={setFilter} />
              </motion.div> */}

              {/* Event wall */}
              <motion.div variants={itemVariants} className="no-scroll-anchor">
                <HighlightGrid items={filtered} lang={lang} onSelect={setActive} />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {isOpen && active && (
                <HighlightDrawer
                  active={active}
                  dir={dir}
                  lang={lang}
                  onClose={closeDrawer}
                  activeGroup={activeGroup}
                  setActiveGroup={setActiveGroup}
                  photos={activePhotos}
                  totalPhotos={activeAllPhotos.length}
                  canLoadMore={visibleCount < activeAllPhotos.length}
                  onLoadMore={() => setVisibleCount((c) => c + 24)}
                  onOpenLightbox={(i) => setLightboxIndex(i)}
                  lightboxIndex={lightboxIndex}
                  setLightboxIndex={setLightboxIndex}
                />
              )}
            </AnimatePresence>
          </LayoutGroup>
        </PageContentReveal>
      </div>
    </section>
  )
}

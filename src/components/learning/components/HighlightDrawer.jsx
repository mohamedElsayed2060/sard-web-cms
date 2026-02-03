'use client'

import clsx from 'clsx'
import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

import { imgUrl } from '@/lib/cms'
import ScrollableChips from './ScrollableChips'
import MasonryGallery from './MasonryGallery'
import Lightbox from './Lightbox'
import { pickText, yearLabel } from './highlightUtils'

export default function HighlightDrawer({
  active,
  dir,
  lang,
  onClose,
  activeGroup,
  setActiveGroup,
  photos,
  totalPhotos,
  canLoadMore,
  onLoadMore,
  onOpenLightbox,
  lightboxIndex,
  setLightboxIndex,
}) {
  const id = active?.id || active?.slug || active?.titleEn
  const title = pickText(active?.titleEn, active?.titleAr, lang)
  const cover = imgUrl(active?.coverImage)
  const y = yearLabel(active?.startYear, active?.endYear)

  // ✅ groups tabs: stable keys (g-0, g-1...) + localized label (title/titleAr)
  const groupItems = useMemo(() => {
    const arr = Array.isArray(active?.groups) ? active.groups : []
    return arr
      .map((g, idx) => ({
        key: `g-${idx}`,
        label: pickText(g?.title, g?.titleAr, lang),
      }))
      .filter((x) => Boolean(x.label))
  }, [active?.groups, lang])

  const tabItems = useMemo(() => {
    const allItem = { key: 'all', label: lang === 'ar' ? 'الكل' : 'All' }
    return [allItem, ...groupItems]
  }, [groupItems, lang])

  const panelSide = dir === 'rtl' ? 'left' : 'right'

  const drawerOpen = Boolean(active)
  const lightboxOpen = Number.isFinite(lightboxIndex)

  const drawerPushedRef = useRef(false)
  const lightboxPushedRef = useRef(false)

  const closeDrawer = () => {
    // لو اللايتبوكس مفتوح وكان معمول له pushState، اقفل الاتنين بإننا نرجع خطوتين
    if (lightboxOpen && lightboxPushedRef.current) {
      window.history.go(-2)
      return
    }

    // لو احنا اللي عاملين pushState للـ drawer، نعمل back وسيقوم popstate بإغلاقه
    if (drawerPushedRef.current && window.history.state?.hlDrawer) {
      window.history.back()
      return
    }

    // fallback
    onClose?.()
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const onPop = () => {
      const st = window.history.state || {}

      // لو اللايتبوكس كان مفتوح ورجعنا لستيت من غير hlLightbox → اقفل اللايتبوكس فقط
      if (lightboxOpen && st.hlDrawer && !st.hlLightbox) {
        setLightboxIndex?.(null)
        return
      }

      // لو الـ drawer مفتوح ورجعنا لستيت من غير hlDrawer → اقفل الـ drawer
      if (drawerOpen && !st.hlDrawer) {
        onClose?.()
      }
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [drawerOpen, lightboxOpen, onClose, setLightboxIndex])

  return (
    <motion.div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeDrawer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Panel */}
      <motion.div
        className={clsx(
          'absolute top-0 bottom-0 w-full',
          'sm:w-[640px] md:w-[760px] lg:w-[860px]',
          'bg-[#F0EADB] shadow-[0_30px_90px_rgba(0,0,0,0.45)]',
          panelSide === 'right' ? 'right-0' : 'left-0',
        )}
        initial={{ x: panelSide === 'right' ? 40 : -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: panelSide === 'right' ? 40 : -40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="h-full flex flex-col">
          {/* Hero */}
          <div className="relative">
            <motion.div
              layoutId={`hl-cover-${id}`}
              className="relative h-[240px] sm:h-[280px] overflow-hidden"
            >
              {cover ? (
                <>
                  <Image
                    src={cover}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 860px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-black/10" />
              )}
            </motion.div>

            {/* Title + Meta */}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="flex items-end justify-between gap-3">
                <motion.h2
                  layoutId={`hl-title-${id}`}
                  className="text-white text-[12px] sm:text-[13px] uppercase tracking-[0.18em] drop-shadow line-clamp-2"
                >
                  {title}
                </motion.h2>

                {y && (
                  <span className="text-white/95 text-[11px] px-2 py-1 rounded-full bg-black/35">
                    {y}
                  </span>
                )}
              </div>

              {/* <div className="mt-2 flex items-center justify-between text-[11px] text-white/80">
                <span className="uppercase tracking-[0.22em]">
                  {lang === 'ar' ? 'إجمالي الصور' : 'Total photos'}
                </span>
                <span className="font-medium">{totalPhotos}</span>
              </div> */}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={closeDrawer}
              className={clsx(
                'absolute top-4 text-[11px] uppercase tracking-[0.22em] px-3 py-2 rounded-full',
                'bg-black/35 text-white hover:bg-black/45 transition',
                panelSide === 'right' ? 'right-4' : 'left-4',
              )}
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>

          {/* Day tabs */}
          {tabItems.length > 1 && (
            <div className="px-5 pt-5">
              <ScrollableChips
                items={tabItems}
                activeKey={activeGroup}
                onChange={(k) => setActiveGroup?.(k)}
              />
            </div>
          )}

          {/* Gallery */}
          <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroup}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
              >
                <MasonryGallery photos={photos} onOpenLightbox={onOpenLightbox} lang={lang} />
              </motion.div>
            </AnimatePresence>

            {canLoadMore && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="px-6 py-3 rounded-full bg-black/80 text-white text-xs uppercase tracking-[0.22em] hover:bg-black transition"
                >
                  {lang === 'ar' ? 'تحميل المزيد' : 'Load more'}
                </button>
              </div>
            )}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {Number.isFinite(lightboxIndex) && (
              <Lightbox
                photos={photos}
                index={lightboxIndex}
                lang={lang}
                onClose={() => setLightboxIndex(null)}
                onPrev={() => setLightboxIndex((i) => (i > 0 ? i - 1 : i))}
                onNext={() => setLightboxIndex((i) => (i < photos.length - 1 ? i + 1 : i))}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

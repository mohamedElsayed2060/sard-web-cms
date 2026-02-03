'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import clsx from 'clsx'
import { imgUrl } from '@/lib/cms'

export default function Lightbox({ photos, index, onClose, onPrev, onNext, lang = 'en' }) {
  const isRTL = lang === 'ar'
  const src = imgUrl(photos?.[index])
  const total = photos?.length || 0
  const hasPrev = index > 0
  const hasNext = index < total - 1

  const overlayV = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.24 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
  }

  const panelV = {
    hidden: { opacity: 0, y: 10, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: 8,
      scale: 0.99,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const imgV = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.22 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
  }

  const ArrowBtn = ({ onClick, children, ariaLabel, side, hide }) => {
    if (hide) return null

    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={clsx(
          'absolute top-[12%] bottom-[12%] z-10 bg-white/10 rounded',
          side === 'left' ? 'left-1' : 'right-1',
          'w-[54px] md:w-[64px]', // ✅ طويلة ومساحتها كبيرة
          'grid place-items-center place-justify-center',
          'bg-black/0',
          'transition-colors duration-200',
          'hover:bg-white/15 active:bg-white/18',
          '',
        )}
      >
        {/* hit area زيادة */}
        <span className="absolute inset-0" />

        {/* زر داخلي (شكل جميل) */}
        <span className={clsx()}>{children}</span>
      </button>
    )
  }

  // في RTL: prev يبقى يمين، next يبقى شمال
  const prevSide = isRTL ? 'right' : 'left'
  const nextSide = isRTL ? 'left' : 'right'

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      variants={overlayV}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <button
        type="button"
        className="absolute px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 text-[11px] uppercase tracking-[0.22em] transition-all duration-200"
        onClick={onClose}
        aria-label="Close preview"
      />

      <motion.div
        variants={panelV}
        initial="hidden"
        animate="show"
        exit="exit"
        className="relative w-[92vw] max-w-[980px] h-[78vh] rounded-[22px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.55)] bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* crossfade بين الصور */}
        <AnimatePresence mode="wait" initial={false}>
          {src ? (
            <motion.div
              key={src}
              variants={imgV}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt="preview"
                fill
                className="object-contain"
                sizes="980px"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              variants={imgV}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 bg-black/20"
            />
          )}
        </AnimatePresence>

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/90 z-10">
          <span className="text-[11px] uppercase tracking-[0.22em]">
            {index + 1}/{photos?.length || 0}
          </span>

          <button
            type="button"
            onClick={onClose}
            className={clsx(
              'px-3 py-2 rounded-full',
              'bg-white/10 border border-white/15',
              'text-[11px] uppercase tracking-[0.22em]',
              'transition-all duration-200',
              'hover:bg-white/15 hover:border-white/25',
              'active:scale-[0.99]',
            )}
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

        {/* Arrows */}
        <ArrowBtn
          onClick={onPrev}
          ariaLabel="Previous"
          side={prevSide}
          hide={!hasPrev} // ✅ يختفي في أول صورة
        >
          <span
            className={clsx(
              'text-white/95 text-4xl leading-none select-none',
              isRTL && 'scale-x-[-1]',
            )}
          >
            ‹
          </span>
        </ArrowBtn>

        <ArrowBtn
          onClick={onNext}
          ariaLabel="Next"
          side={nextSide}
          hide={!hasNext} // ✅ يختفي في آخر صورة
        >
          <span
            className={clsx(
              'text-white/95 text-4xl leading-none select-none',
              isRTL && 'scale-x-[-1]',
            )}
          >
            ›
          </span>
        </ArrowBtn>
      </motion.div>
    </motion.div>
  )
}

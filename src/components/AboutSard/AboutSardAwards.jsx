'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import PageContentReveal from '@/components/PageContentReveal'
import { RichColumn } from './AboutSardHero'
import { AnimatePresence, motion } from 'framer-motion'
import SectionReveal from '../motion/SectionReveal'
import Image from 'next/image'
import { imgUrl } from '@/lib/cms'

const ANIM_MS = 900 // أبطأ وأنعم
const EASE = [0.19, 1, 0.22, 1]

export default function AboutSardAwards({ awards = [], bgImage }) {
  const activeAwards = useMemo(() => (awards || []).filter((a) => a?.isActive !== false), [awards])

  // ✅ order: أول عنصر هو الـ active، والباقي tabs
  const [order, setOrder] = useState([])
  const [showContent, setShowContent] = useState(true)
  const [closingIdx, setClosingIdx] = useState(null)
  const timerRef = useRef(null)

  // Sync order when list changes
  useEffect(() => {
    setOrder(activeAwards.map((_, i) => i))
    setShowContent(true)
    setClosingIdx(null)
    clearTimeout(timerRef.current)
  }, [activeAwards.length])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (!activeAwards.length) return null
  if (!order.length) return null

  const activeIdx = order[0]
  const activeAward = activeAwards[activeIdx]

  // ✅ image url (Payload media object)
  const awardImgSrc = activeAward?.image ? imgUrl(activeAward.image) : null
  const awardImgAlt = activeAward?.image?.alt || activeAward?.title || 'Award'

  // Helper: move clicked to front, and move previous active to LAST (مهم للموبايل)
  const reorderOnClick = (clickedIdx) => {
    setOrder((prev) => {
      if (!prev?.length) return prev
      const currentActive = prev[0]
      if (clickedIdx === currentActive) return prev

      const rest = prev.filter((x) => x !== clickedIdx && x !== currentActive)
      // ✅ clicked يبقى Active، والـ active القديم ينزل آخر واحد
      return [clickedIdx, ...rest, currentActive]
    })
  }

  const onPick = (clickedIdx) => {
    if (clickedIdx === activeIdx) return

    // ✅ خزن مين اللي كان Active (هو ده اللي هينزل آخر واحد)
    const prevActive = activeIdx

    // اخفي الكونتنت فورًا
    setShowContent(false)

    // ✅ اخفي label بتاع الزرار اللي بيقفل فقط
    setClosingIdx(prevActive)

    reorderOnClick(clickedIdx)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setShowContent(true)
      setTimeout(() => setClosingIdx(null), 150)
    }, ANIM_MS)
  }

  // Build ordered list of objects
  const ordered = order.map((idx) => ({ idx, item: activeAwards[idx] })).filter((x) => x.item)

  // عدد التابات اللي هنظهرها في الموبايل على اليمين
  const MOBILE_TABS_COUNT = 5

  return (
    <SectionReveal variant="fadeUp" delay={0.1}>
      <section className="bg-black">
        <div className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
          {/* Title line */}
          <div className="flex items-center gap-6 px-2 md:px-3 mb-4">
            <h2 className="italic text-xl md:text-2xl font-semibold text-[#F4E8D7]">Awards</h2>
            <div className="h-px flex-1 bg-[#F4E8D7]/40" />
          </div>

          <PageContentReveal
            variant="slideUp"
            paperColor="#F4E8D7"
            bgImage={bgImage}
            className="rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden"
          >
            {/* ===================== DESKTOP ===================== */}
            <div className="hidden md:block relative">
              <div className="flex items-stretch min-h-[300px]">
                {ordered.map(({ item, idx }, renderIndex) => {
                  const isActive = renderIndex === 0

                  return (
                    <motion.button
                      key={item?.id || idx}
                      layout
                      transition={{ duration: ANIM_MS / 1000, ease: EASE }}
                      type="button"
                      onClick={() => onPick(idx)}
                      aria-expanded={isActive}
                      className={[
                        'relative overflow-hidden rounded-[22px]',
                        'transition-shadow duration-300',
                        isActive
                          ? 'flex-[1_1_0%] bg-transparent border-0 p-6'
                          : 'shadow-lg border-l border-black/20 flex-[0_0_78px] hover:shadow-[0_12px_25px_rgba(0,0,0,0.18)]',
                        renderIndex === 0 ? '' : '-ml-5',
                      ].join(' ')}
                      style={{ backgroundImage: `url('${bgImage?.src}')` }}
                    >
                      {isActive ? (
                        <motion.div layout className="h-full w-full text-left p-8">
                          <AnimatePresence mode="wait">
                            {showContent && (
                              <motion.div
                                key={activeAward?.id || activeAward?.title || 'active'}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.55, ease: EASE }}
                              >
                                <h3 className="italic text-lg md:text-2xl font-semibold text-[#252525]">
                                  {activeAward?.title || 'Award Name'}
                                </h3>

                                {/* ✅ IMAGE تحت العنوان مباشرة */}
                                {awardImgSrc ? (
                                  <div className="mt-3">
                                    <img src={awardImgSrc} alt={awardImgAlt} />
                                    {/* <Image
                                      src={awardImgSrc}
                                      alt={awardImgAlt}
                                      width={activeAward?.image?.width || 320}
                                      height={activeAward?.image?.height || 200}
                                      className="h-auto w-full max-w-[360px] rounded-[16px] border border-black/10 shadow-sm object-contain"
                                    /> */}
                                  </div>
                                ) : null}

                                {/* description اختياري */}
                                {activeAward?.description ? (
                                  <div className="mt-3 text-sm text-[#252525]/80">
                                    <RichColumn
                                      value={activeAward.description}
                                      textColor="text-[#252525]"
                                    />
                                  </div>
                                ) : null}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ) : (
                        <div className="h-full w-full">
                          <div className="absolute inset-0" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <AnimatePresence>
                              {closingIdx !== idx && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.18 }}
                                  className="text-[14px] font-bold text-[#252525]/60 whitespace-nowrap rotate-[-90deg] italic"
                                >
                                  {item?.title || 'Award'}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* ===================== MOBILE ===================== */}
            <div className="md:hidden">
              <div className="relative">
                {/* Active Card */}
                <div
                  className="rounded-[22px] overflow-hidden shadow-[0_12px_25px_rgba(0,0,0,0.22)]"
                  style={{ backgroundImage: `url('${bgImage?.src}')` }}
                >
                  <motion.div layout className="p-5 pr-[70px] min-h-[230px]">
                    <AnimatePresence mode="wait">
                      {showContent && (
                        <motion.div
                          key={activeAward?.id || activeAward?.title || 'active-mobile'}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.5, ease: EASE }}
                        >
                          <h3 className="italic text-lg font-semibold text-[#252525]">
                            {activeAward?.title || 'Award Name'}
                          </h3>

                          {/* ✅ IMAGE تحت العنوان مباشرة (موبايل) */}
                          {awardImgSrc ? (
                            <div className="mt-3">
                              <img src={awardImgSrc} alt={awardImgAlt} />

                              {/* <Image
                                src={awardImgSrc}
                                alt={awardImgAlt}
                                width={activeAward?.image?.width || 340}
                                height={activeAward?.image?.height || 220}
                                className="h-auto w-full max-w-[320px] rounded-[16px] border border-black/10 shadow-sm object-contain"
                              /> */}
                            </div>
                          ) : null}

                          {activeAward?.description ? (
                            <div className="mt-3 text-sm text-[#252525]/80">
                              <RichColumn
                                value={activeAward.description}
                                textColor="text-[#252525]"
                              />
                            </div>
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Right stacked buttons */}
                <div className="absolute top-4 right-4 w-[50px]">
                  {ordered.slice(1, 1 + MOBILE_TABS_COUNT).map(({ item, idx }, i) => {
                    const y = i * 13
                    return (
                      <motion.button
                        key={item?.id || idx}
                        layout
                        transition={{ duration: ANIM_MS / 2000, ease: EASE }}
                        type="button"
                        onClick={() => onPick(idx)}
                        className={[
                          'absolute -right-2',
                          'w-[50px] h-[130px]',
                          'rounded-[18px]',
                          'border border-black/15',
                          'shadow-md',
                          'bg-[#F4E8D7]/95',
                          'overflow-hidden',
                          'flex items-center justify-center',
                        ].join(' ')}
                        style={{ top: y, zIndex: 50 - i }}
                        aria-label={item?.title || 'Award'}
                      >
                        <span className="text-[11px] text-[#252525]/65 whitespace-nowrap rotate-[-90deg] italic font-bold">
                          {item?.title || 'Award'}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
          </PageContentReveal>
        </div>
      </section>
    </SectionReveal>
  )
}

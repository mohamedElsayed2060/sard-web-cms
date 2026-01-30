'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import PageContentReveal from '@/components/PageContentReveal'
import { AnimatePresence, motion } from 'framer-motion'
import SectionReveal from '../motion/SectionReveal'
import { imgUrl } from '@/lib/cms'
import RichColumn from '../richtext/RichColumn'
import PinnedSection from '@/components/motion/PinnedSection'

const ANIM_MS = 900
const EASE = [0.19, 1, 0.22, 1]

const SUPPORTED_LANGS = ['en', 'ar']
const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const UI = {
  en: {
    sectionTitle: 'Awards',
    awardName: 'Award Name',
    award: 'Award',
  },
  ar: {
    sectionTitle: 'الجوائز',
    awardName: 'اسم الجائزة',
    award: 'جائزة',
  },
}

const pickText = (en, ar, lang) => {
  if (lang === 'ar') return ar || en || ''
  return en || ar || ''
}

const pickRich = (enVal, arVal, lang) => {
  if (lang === 'ar') return arVal || enVal || null
  return enVal || arVal || null
}

const pickUpload = (enFile, arFile, lang) => {
  const chosen = lang === 'ar' ? arFile || enFile : enFile || arFile
  return chosen ? imgUrl(chosen) : null
}

export default function AboutSardAwards({ awards = [], bgImage, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const t = UI[lang] || UI.en

  const activeAwards = useMemo(() => (awards || []).filter((a) => a?.isActive !== false), [awards])

  const [order, setOrder] = useState([])
  const [showContent, setShowContent] = useState(true)
  const [closingIdx, setClosingIdx] = useState(null)
  const timerRef = useRef(null)

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

  // ✅ localized fields
  const activeTitle = pickText(activeAward?.titleEn, activeAward?.titleAr, lang) || t.awardName
  const activeDesc = pickRich(activeAward?.descriptionEn, activeAward?.descriptionAr, lang)

  // ✅ image: EN required? (in CMS it’s optional) + AR optional
  const awardImgSrc = pickUpload(activeAward?.imageEn, activeAward?.imageAr, lang)
  const awardImgAlt = activeTitle || t.award

  const reorderOnClick = (clickedIdx) => {
    setOrder((prev) => {
      if (!prev?.length) return prev
      const currentActive = prev[0]
      if (clickedIdx === currentActive) return prev

      const rest = prev.filter((x) => x !== clickedIdx && x !== currentActive)
      return [clickedIdx, ...rest, currentActive]
    })
  }

  const onPick = (clickedIdx) => {
    if (clickedIdx === activeIdx) return
    const prevActive = activeIdx

    setShowContent(false)
    setClosingIdx(prevActive)

    reorderOnClick(clickedIdx)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setShowContent(true)
      setTimeout(() => setClosingIdx(null), 150)
    }, ANIM_MS)
  }

  const ordered = order.map((idx) => ({ idx, item: activeAwards[idx] })).filter((x) => x.item)
  const MOBILE_TABS_COUNT = 5
  // variant="scrollFlip"
  return (
    <SectionReveal once={true} delay={0.1} id="awards">
      <section className="bg-black">
        <div className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
          {/* Title line */}
          <div className="flex items-center gap-6 px-2 md:px-3 mb-4">
            <h2 className="italic text-xl md:text-2xl font-semibold text-[#F4E8D7]">
              {t.sectionTitle}
            </h2>
            <div className="h-px flex-1 bg-[#F4E8D7]/40" />
          </div>

          <PageContentReveal
            variant="slideUp"
            paperColor="#F4E8D7"
            bgImage={bgImage}
            className="rounded-[24px] overflow-hidden"
          >
            {/* ===================== DESKTOP ===================== */}
            <div className="hidden md:block relative">
              <div className="flex items-stretch min-h-[300px]">
                {ordered.map(({ item, idx }, renderIndex) => {
                  const isActive = renderIndex === 0

                  const tabTitle = pickText(item?.titleEn, item?.titleAr, lang) || t.award

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
                          : `shadow-lg ${lang === 'ar' ? 'border-r' : 'border-l'}  border-black/20 flex-[0_0_78px] hover:shadow-[0_12px_25px_rgba(0,0,0,0.18)]`,
                        renderIndex === 0 ? '' : '-ml-5',
                      ].join(' ')}
                      style={{ backgroundImage: `url('${bgImage?.src}')` }}
                    >
                      {isActive ? (
                        <motion.div layout className="h-full w-full text-left p-8">
                          <AnimatePresence mode="wait">
                            {showContent && (
                              <motion.div
                                key={activeAward?.id || activeTitle || 'active'}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.55, ease: EASE }}
                              >
                                <h3
                                  className={`italic text-lg md:text-2xl font-semibold text-[#252525] text-start`}
                                >
                                  {activeTitle}
                                </h3>

                                {/* ✅ IMAGE تحت العنوان مباشرة */}
                                {awardImgSrc ? (
                                  <div className="mt-3">
                                    <img src={awardImgSrc} alt={awardImgAlt} />
                                  </div>
                                ) : null}

                                {/* description اختياري */}
                                {activeDesc ? (
                                  <div className="mt-3 text-sm text-[#252525]/80">
                                    <RichColumn value={activeDesc} textColor="text-[#252525]" />
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
                                  {tabTitle}
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
                          key={activeAward?.id || activeTitle || 'active-mobile'}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.5, ease: EASE }}
                        >
                          <h3 className="italic text-lg font-semibold text-[#252525]">
                            {activeTitle}
                          </h3>

                          {/* ✅ IMAGE تحت العنوان مباشرة (موبايل) */}
                          {awardImgSrc ? (
                            <div className="mt-3">
                              <img src={awardImgSrc} alt={awardImgAlt} />
                            </div>
                          ) : null}

                          {activeDesc ? (
                            <div className="mt-3 text-sm text-[#252525]/80">
                              <RichColumn value={activeDesc} textColor="text-[#252525]" />
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
                    const tabTitle = pickText(item?.titleEn, item?.titleAr, lang) || t.award

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
                        aria-label={tabTitle}
                      >
                        <span className="text-[11px] text-[#252525]/65 whitespace-nowrap rotate-[-90deg] italic font-bold">
                          {tabTitle}
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

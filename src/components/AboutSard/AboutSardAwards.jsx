'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import PageContentReveal from '@/components/PageContentReveal'
import { AnimatePresence, motion } from 'framer-motion'
import SectionReveal from '../motion/SectionReveal'
import { imgUrl } from '@/lib/cms'
import RichColumn from '../richtext/RichColumn'
import PinnedSection from '@/components/motion/PinnedSection'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import useDocumentDir from '../shared/useDocumentDir'
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
const pickTabTitle = (item, lang, fallback = '') => {
  // 1) جرّب tabTitle حسب اللغة
  const tab = pickText(item?.tabTitleEn, item?.tabTitleAr, lang)

  if (tab) return tab

  // 2) لو فاضي، ارجع للعنوان الكامل
  const full = pickText(item?.titleEn, item?.titleAr, lang)
  return full || fallback || ''
}
const pickGallery = (gallery = []) => {
  const items = Array.isArray(gallery) ? gallery : []
  return items
    .map((g) => {
      const src = g?.image ? imgUrl(g.image) : null
      const alt = g?.alt || ''
      return src ? { src, alt } : null
    })
    .filter(Boolean)
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
  const dir = useDocumentDir(lang === 'ar' ? 'rtl' : 'ltr')

  const activeAwards = useMemo(() => (awards || []).filter((a) => a?.isActive !== false), [awards])

  const [order, setOrder] = useState([])
  const [showContent, setShowContent] = useState(true)
  const [closingIdx, setClosingIdx] = useState(null)
  const timerRef = useRef(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setOrder(activeAwards.map((_, i) => i))
    setShowContent(true)
    setClosingIdx(null)
    clearTimeout(timerRef.current)
  }, [activeAwards.length])
  useEffect(() => {
    if (!drawerOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prevOverflow || ''
    }
  }, [drawerOpen])

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
  const galleryItems = pickGallery(activeAward?.gallery)
  const hasGallery = galleryItems.length > 0

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
  const MAX_DESKTOP_TABS = 11
  const visibleOrdered = ordered.slice(0, MAX_DESKTOP_TABS)
  const hiddenOrdered = ordered.slice(MAX_DESKTOP_TABS)
  const hiddenCount = hiddenOrdered.length
  const sectionId = 'awards'
  // variant="scrollFlip"
  return (
    <section id={sectionId}>
      <SectionReveal once={true} delay={0.1}>
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
                <div className="flex items-stretch min-h-[350px]">
                  {visibleOrdered.map(({ item, idx }, renderIndex) => {
                    const isActive = renderIndex === 0

                    const tabTitle = pickTabTitle(item, lang, t.award)

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
                          renderIndex === 0 ? '' : lang === 'ar' ? '-mr-5' : '-ml-5',
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
                                  {/* ✅ Gallery slider (لو موجود) وإلا fallback لصورة واحدة */}
                                  {hasGallery ? (
                                    <div className="mt-4">
                                      <Splide
                                        options={{
                                          direction: dir,
                                          focus: dir === 'rtl' ? 'start' : 'end',

                                          type: 'slide',
                                          arrows: false,
                                          pagination: false,
                                          drag: 'free',
                                          gap: '12px',
                                          perPage: 3.5,
                                          breakpoints: {
                                            1024: { perPage: 2.5 },
                                            640: { perPage: 2 },
                                          },
                                        }}
                                        className="w-full"
                                      >
                                        {galleryItems.map((g, i) => (
                                          <SplideSlide key={g.src + i}>
                                            <div className="h-[56px] md:h-[64px] flex items-center justify-center rounded-[14px] border border-black/10">
                                              <img
                                                src={g.src}
                                                alt={g.alt || awardImgAlt}
                                                className="max-h-[40px] md:max-h-[56px] w-auto object-contain"
                                              />
                                            </div>
                                          </SplideSlide>
                                        ))}
                                      </Splide>
                                    </div>
                                  ) : awardImgSrc ? (
                                    <div className="mt-3">
                                      <img src={awardImgSrc} alt={awardImgAlt} />
                                    </div>
                                  ) : null}

                                  {/* description اختياري */}
                                  {activeDesc ? (
                                    <div className="mt-3 text-sm text-[#252525]/80 text-start">
                                      <RichColumn
                                        value={activeDesc}
                                        textColor="text-[#252525]"
                                      />{' '}
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
                  {hiddenCount > 0 ? (
                    <motion.button
                      layout
                      transition={{ duration: ANIM_MS / 1000, ease: EASE }}
                      type="button"
                      onClick={() => setDrawerOpen(true)}
                      className={[
                        'relative overflow-hidden rounded-[22px]',
                        'transition-shadow duration-300',
                        `shadow-lg ${lang === 'ar' ? 'border-r' : 'border-l'} border-black/20`,
                        'flex-[0_0_78px]',
                        'hover:shadow-[0_12px_25px_rgba(0,0,0,0.18)]',
                        lang === 'ar' ? '-mr-5' : '-ml-5',
                      ].join(' ')}
                      style={{ backgroundImage: `url('${bgImage?.src}')` }}
                      aria-label={
                        lang === 'ar' ? `المزيد (${hiddenCount})` : `More (${hiddenCount})`
                      }
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[14px] font-bold text-[#252525]/70 whitespace-nowrap rotate-[-90deg] italic">
                          {lang === 'ar' ? `+${hiddenCount} المزيد` : `+${hiddenCount} more`}
                        </span>
                      </div>
                    </motion.button>
                  ) : null}
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
                    <motion.div layout className="p-5 pr-[70px] min-h-[270px]">
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

                            {/* ✅ MEDIA تحت العنوان مباشرة (موبايل) — Gallery لو موجود وإلا صورة واحدة */}
                            {(() => {
                              const mobileGalleryItems = pickGallery(activeAward?.gallery)
                              const hasGallery = mobileGalleryItems.length > 0

                              if (hasGallery) {
                                return (
                                  <div className="mt-4">
                                    <Splide
                                      className="w-full"
                                      options={{
                                        direction: dir,
                                        focus: dir === 'rtl' ? 'start' : 'end',
                                        type: 'slide',
                                        gap: '1rem',
                                        arrows: false,
                                        pagination: false,
                                        drag: 'free',
                                        perPage: 1.5,
                                      }}
                                    >
                                      {mobileGalleryItems.map((g, i) => (
                                        <SplideSlide key={g.src + i}>
                                          <div className="h-[65px] flex items-center justify-center rounded-[14px]  border border-black/10">
                                            <img
                                              src={g.src}
                                              alt={g.alt || awardImgAlt}
                                              className="max-h-[40px] w-auto object-contain"
                                            />
                                          </div>
                                        </SplideSlide>
                                      ))}
                                    </Splide>
                                  </div>
                                )
                              }

                              return awardImgSrc ? (
                                <div className="mt-3">
                                  <img src={awardImgSrc} alt={awardImgAlt} />
                                </div>
                              ) : null
                            })()}

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
                      const tabTitle = pickTabTitle(item, lang, t.award)
                      return (
                        <motion.button
                          key={item?.id || idx}
                          layout
                          transition={{ duration: ANIM_MS / 2000, ease: EASE }}
                          type="button"
                          onClick={() => onPick(idx)}
                          className={[
                            'absolute -right-2',
                            'w-[50px] h-[180px]',
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
      {/* =============== Drawer ================*/}
      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            className={['fixed inset-0 z-[999] flex justify-end'].join(' ')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ x: lang === 'ar' ? -520 : 520 }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? -520 : 520 }}
              transition={{ duration: 0.38, ease: EASE }}
              className={[
                'relative h-full',
                'w-[340px] sm:w-[380px] md:w-[440px]',
                'shadow-[0_30px_80px_rgba(0,0,0,0.35)]',
                lang === 'ar' ? 'rounded-r-[24px]' : 'rounded-l-[24px]',
                'overflow-hidden',
              ].join(' ')}
              style={{
                backgroundImage: bgImage?.src ? `url('${bgImage.src}')` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Paper tint overlay */}
              <div className="absolute inset-0 " />
              {/* subtle top gradient */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/10 to-transparent" />

              {/* Content */}
              <div className="relative h-full p-4 md:p-5 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg md:text-xl font-semibold text-[#252525] italic">
                    {lang === 'ar' ? 'المزيد من الجوائز' : 'More Awards'}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="px-3 py-2 rounded-xl bg-black/10 hover:bg-black/15 text-[#252525] transition"
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {hiddenOrdered.map(({ item, idx }) => {
                      const tabTitle = pickTabTitle(item, lang, t.award)

                      return (
                        <button
                          key={item?.id || idx}
                          type="button"
                          onClick={() => {
                            onPick(idx)
                            setDrawerOpen(false)
                          }}
                          className={[
                            'w-full',
                            'rounded-[18px]',
                            'border border-black/15',
                            'bg-[#F4E8D7]/75',
                            'shadow-sm',
                            'px-4 py-3',
                            'transition',
                            'hover:shadow-[0_10px_18px_rgba(0,0,0,0.12)]',
                            'hover:-translate-y-[1px]',
                            'flex items-center gap-3',
                          ].join(' ')}
                        >
                          <span className="h-8 w-[6px] rounded-full bg-black/15" />

                          <div className="flex-1 text-start">
                            <div className="font-bold italic text-[#252525] leading-snug">
                              {tabTitle}
                            </div>
                          </div>

                          {/* arrow */}
                          <span className="text-[#252525]/55 text-lg">›</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-black/10 text-[12px] text-[#252525]/60">
                  {lang === 'ar'
                    ? 'اضغط على أي جائزة لعرض تفاصيلها'
                    : 'Click any award to view its details'}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

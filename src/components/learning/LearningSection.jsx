// src/components/learning/LearningSection.jsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageContentReveal from '@/components/PageContentReveal'
import Image from 'next/image'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { imgUrl } from '@/lib/cms'
import SectionReveal from '../motion/SectionReveal'
import RichColumn from '../richtext/RichColumn'
import { usePathname } from 'next/navigation'
import useDocumentDir from '@/components/shared/useDocumentDir'

const SUPPORTED_LANGS = ['en', 'ar']
const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const UI = {
  en: { poster: 'Poster' },
  ar: { poster: 'بوستر' },
}

const pickText = (en, ar, lang) => {
  if (lang === 'ar') return ar || en || ''
  return en || ar || ''
}

const pickUploadUrl = (enFile, arFile, lang) => {
  const chosen = lang === 'ar' ? arFile || enFile : enFile || arFile
  return chosen ? imgUrl(chosen) : null
}
function hasLexicalContent(value) {
  const nodes = Array.isArray(value) ? value : value?.root?.children
  if (!Array.isArray(nodes) || nodes.length === 0) return false

  const hasTextDeep = (node) => {
    if (!node) return false

    if (node.type === 'text') {
      const t = (node.text || node.content || '').trim()
      return t.length > 0
    }

    if (node.type === 'linebreak') return false

    if (Array.isArray(node.children)) {
      return node.children.some(hasTextDeep)
    }

    return false
  }

  return nodes.some(hasTextDeep)
}

export default function LearningSection({ works, bgImage, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const t = UI[lang] || UI.en
  const dir = useDocumentDir('ltr')

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const tabsSplideRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!works || works.length === 0) return null

  const safeIndex = activeIndex >= 0 && activeIndex < works.length ? activeIndex : 0
  const activeWork = works[safeIndex]

  const handleTabClick = (index) => {
    setActiveIndex(index)
    const inst = tabsSplideRef.current?.splide || tabsSplideRef.current || null
    if (inst && inst.go) inst.go(index)
  }

  // ===== i18n content =====
  const title = useMemo(
    () => pickText(activeWork?.titleEn, activeWork?.titleAr, lang),
    [activeWork, lang],
  )
  const subTitle = useMemo(
    () => pickText(activeWork?.subTitleEn, activeWork?.subTitleAr, lang),
    [activeWork, lang],
  )

  const posterSrc = useMemo(
    () => pickUploadUrl(activeWork?.posterEn, activeWork?.posterAr, lang),
    [activeWork, lang],
  )

  const leftColumnValue = lang === 'ar' ? activeWork?.leftColumnAr : activeWork?.leftColumnEn
  const rightColumnValue = lang === 'ar' ? activeWork?.rightColumnAr : activeWork?.rightColumnEn
  const hasRight = hasLexicalContent(rightColumnValue)

  const castItems = useMemo(() => {
    const arr = activeWork?.cast ?? []
    return arr.map((c) => pickText(c?.nameEn, c?.nameAr, lang)).filter(Boolean)
  }, [activeWork, lang])
  return (
    <SectionReveal variant="fadeUp" delay={0.1}>
      <section className="bg-black pt-5 px-3 md:px-5">
        <div className="mx-auto max-w-[1490px]">
          {/* ===== Tabs ===== */}
          <div className="relative mb-6 md:mb-8">
            {isMounted && (
              <div className="absolute -top-[44px] left-0 right-0 px-6 md:px-12">
                <Splide
                  ref={tabsSplideRef}
                  aria-label="Works tabs"
                  options={{
                    direction: lang === 'ar' ? 'rtl' : '', // ✅ RTL/LTR
                    type: 'slide',
                    pagination: false,
                    gap: '0.75rem',
                    arrows: works.length > 3,
                    drag: 'free',
                    autoWidth: true,
                  }}
                >
                  {works?.map((work, index) => {
                    const isActive = index === safeIndex
                    const tabTitle = pickText(work?.titleEn, work?.titleAr, lang)

                    return (
                      <SplideSlide key={work.id || work.slug || index}>
                        <button
                          style={{ minWidth: '180px' }}
                          type="button"
                          onClick={() => handleTabClick(index)}
                          className={[
                            'px-6 py-3 text-sm whitespace-nowrap transition-all',
                            dir === 'ltr'
                              ? 'rounded-tl-[20px] rounded-b-none'
                              : 'rounded-tr-[20px] rounded-b-none',
                            isActive
                              ? 'bg-[#4A569F] text-white shadow-[0_10px_25px_rgba(0,0,0,0.45)]'
                              : 'bg-[#F0EADB] text-black/75 hover:bg-[#F0EADB]/90 shadow-[inset_0_-10px_5px_rgba(0,0,0,0.3)]',
                          ].join(' ')}
                        >
                          {tabTitle}
                        </button>
                      </SplideSlide>
                    )
                  })}
                </Splide>
              </div>
            )}
          </div>

          {/* ===== Card ===== */}
          <PageContentReveal
            paperColor="#4A569F"
            className="rounded-[24px] px-3 py-7 md:py-18 md:px-18 overflow-hidden"
            bgImage={bgImage}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork?.id || activeWork?.slug || safeIndex}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="mt-2 space-y-6 md:mt-0"
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] md:gap-8">
                  {/* Poster */}
                  <SectionReveal variant="slideRight" delay={0.6}>
                    <div className="overflow-hidden rounded-[24px]">
                      {posterSrc ? (
                        <Image
                          src={posterSrc}
                          alt={title}
                          width={500}
                          height={700}
                          className="w-full h-auto object-cover"
                          priority={false}
                        />
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center text-sm text-white/40">
                          {t.poster}
                        </div>
                      )}
                    </div>
                  </SectionReveal>

                  {/* Right column */}
                  <SectionReveal variant="slideLeft" delay={0.6}>
                    <div className="flex flex-col gap-5 md:gap-7">
                      {/* ===== Text / cast ===== */}
                      <div className="space-y-2 text-[#F0EADB]">
                        <div className="flex flex-wrap items-baseline gap-3 text-sm md:text-2xl">
                          <span className="italic font-semibold">{title}</span>
                        </div>

                        <div className="h-px w-full bg-[#F0EADB]/30" />
                        <div className="italic text-[11px] flex items-center gap-3 md:text-base">
                          {subTitle}
                        </div>
                      </div>

                      {/* عمودين RichText */}
                      <div className={`grid gap-6 ${hasRight ? 'md:grid-cols-2' : ''} md:gap-8`}>
                        <div className={`space-y-4 ${hasRight ? '' : 'md:w-[70%]'}`}>
                          <RichColumn value={leftColumnValue} textColor="text-[#F0EADB]" />
                        </div>

                        {hasRight ? (
                          <div className="space-y-4">
                            <RichColumn value={rightColumnValue} textColor="text-[#F0EADB]" />
                          </div>
                        ) : null}
                      </div>

                      <div className="h-px w-full bg-[#F0EADB]/30" />

                      {castItems.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs md:text-sm text-[#F0EADB]/80">
                          {castItems.map((name, i) => (
                            <span key={`${name}-${i}`}>
                              {name}
                              {i < castItems.length - 1 && (
                                <span className="mx-1 text-[#F0EADB]/40">|</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </SectionReveal>
                </div>
              </motion.div>
            </AnimatePresence>
          </PageContentReveal>
        </div>
      </section>
    </SectionReveal>
  )
}

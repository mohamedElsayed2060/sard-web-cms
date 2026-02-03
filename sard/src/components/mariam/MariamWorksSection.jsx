// src/components/mariam/MariamWorksSection.jsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageContentReveal from '@/components/PageContentReveal'
import Image from 'next/image'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { imgUrl } from '@/lib/cms'
import BookModal from '@/components/shared/BookModal'
import SectionReveal from '../motion/SectionReveal'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import useDocumentDir from '@/components/shared/useDocumentDir'

const SUPPORTED_LANGS = ['en', 'ar']
const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const UI = {
  en: {
    directedBy: 'Directed by',
    image: 'Image',
    video: 'Video',
    poster: 'Poster',
    noVideoUrl: 'No video URL provided',
    noImage: 'No image',
    videoTitle: 'Video',
  },
  ar: {
    directedBy: 'إخراج',
    image: 'صورة',
    video: 'فيديو',
    poster: 'بوستر',
    noVideoUrl: 'لا يوجد رابط فيديو',
    noImage: 'لا توجد صورة',
    videoTitle: 'فيديو',
  },
}

// pick helper للحقول الجديدة (مع fallback للغة التانية)
const pickText = (en, ar, lang) => {
  if (lang === 'ar') return ar || en || ''
  return en || ar || ''
}

const pickUploadUrl = (enFile, arFile, lang) => {
  const chosen = lang === 'ar' ? arFile || enFile : enFile || arFile
  return chosen ? imgUrl(chosen) : null
}

export default function MariamWorksSection({ works, bgImage, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const t = UI[lang] || UI.en
  const dir = useDocumentDir('ltr')

  const [activeIndex, setActiveIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeMedia, setActiveMedia] = useState(null)
  const tabsSplideRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const openMedia = (item) => {
    setActiveMedia(item)
    setModalOpen(true)
  }

  const closeMedia = () => {
    setModalOpen(false)
    setActiveMedia(null)
  }

  if (!works || works.length === 0) return null

  const safeIndex = activeIndex >= 0 && activeIndex < works.length ? activeIndex : 0
  const activeWork = works[safeIndex]

  const workTitle = useMemo(() => {
    return pickText(activeWork?.titleEn, activeWork?.titleAr, lang)
  }, [activeWork, lang])

  const directorName = useMemo(() => {
    return pickText(activeWork?.directorEn, activeWork?.directorAr, lang)
  }, [activeWork, lang])

  const castItems = useMemo(() => {
    const arr = activeWork?.cast ?? []
    return arr.map((c) => pickText(c?.nameEn, c?.nameAr, lang)).filter(Boolean)
  }, [activeWork, lang])

  const posterSrc = useMemo(() => {
    return pickUploadUrl(activeWork?.posterEn, activeWork?.posterAr, lang)
  }, [activeWork, lang])

  const mediaItems = activeWork?.media ?? []

  const handleTabClick = (index) => {
    setActiveIndex(index)
    const inst = tabsSplideRef.current?.splide || tabsSplideRef.current || null
    if (inst && inst.go) inst.go(index)
  }

  const renderVideo = (url) => {
    if (!url) return null
    const u = url.trim()

    const isYouTube = /youtube\.com\/watch\?v=|youtu\.be\//i.test(u)

    if (isYouTube) {
      let id = ''
      try {
        const parsed = new URL(u)
        if (parsed.hostname.includes('youtu.be')) {
          id = parsed.pathname.replace('/', '')
        } else {
          id = parsed.searchParams.get('v') || ''
        }
      } catch {
        id = (u.split('v=')[1] || '').split('&')[0]
      }

      const embed = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`

      return (
        <div className="relative h-full w-full">
          <iframe
            src={embed}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={t.videoTitle}
          />
        </div>
      )
    }

    return <video src={u} controls autoPlay playsInline className="h-full w-full object-contain" />
  }
  return (
    <SectionReveal variant="fadeUp" delay={0.1}>
      <section className="bg-black pt-5 px-3 pb-5 max-w-[1490px] mx-auto">
        <div>
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
                  {works.map((work, index) => {
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
                              ? 'bg-[#871D3F] text-white shadow-[0_30px_25px_rgba(0,0,0,0.45)]'
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
            paperColor="#871D3F"
            className="rounded-[24px] px-3 py-7 md:py-18 md:px-18 overflow-hidden"
            bgImage={bgImage}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork.id || activeWork.slug || safeIndex}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="mt-2 space-y-6 md:mt-0"
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] md:gap-8">
                  {/* Poster */}
                  <SectionReveal variant="slideRight" delay={0.6}>
                    <div className="overflow-hidden rounded-[24px] bg-[#F4E8D7]/8">
                      {posterSrc ? (
                        <Image
                          src={posterSrc}
                          alt={workTitle}
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
                      {/* ===== Media slider ===== */}
                      {isMounted && (
                        <Splide
                          aria-label="Selected stills"
                          className="w-full"
                          options={{
                            direction: lang === 'ar' ? 'rtl' : '', // ✅ RTL/LTR
                            type: 'slide',
                            gap: '1rem',
                            pagination: false,
                            arrows: false,
                            drag: 'free',
                            perPage: 2.5,
                            // ✅ align حسب الاتجاه
                            focus: dir === 'rtl' ? 'start' : 'end',
                            breakpoints: {
                              1024: { perPage: 2 },
                              768: { perPage: 2 },
                              640: { perPage: 1.5 },
                              480: { perPage: 1.5 },
                            },
                          }}
                        >
                          {mediaItems.map((item, idx) => {
                            const thumbSrc = pickUploadUrl(item?.thumbEn, item?.thumbAr, lang)
                            const key = item?.id || `${activeWork?.id || safeIndex}-media-${idx}`

                            return (
                              <SplideSlide key={key}>
                                <button
                                  type="button"
                                  onClick={() => openMedia(item)}
                                  className="group relative aspect-[20/14] w-full overflow-hidden rounded-2xl bg-[#F4E8D7]/10 text-left"
                                >
                                  {thumbSrc ? (
                                    <Image
                                      src={thumbSrc}
                                      alt=""
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                      loading="lazy"
                                      sizes="(max-width: 640px) 90vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-white/45">
                                      {item?.type === 'video' ? t.video : t.image}
                                    </div>
                                  )}

                                  {/* badge */}
                                  <div className="absolute left-[50%] top-[50%] -translate-[50%] text-[11px]">
                                    {item?.type === 'video' ? (
                                      <span
                                        className={clsx(
                                          'galleryPlayBtn',
                                          'h-14 w-14 rounded-full bg-black/15 backdrop-blur',
                                          'border border-black/25 flex items-center justify-center',
                                          'hover:bg-white/20 transition',
                                        )}
                                      >
                                        <span className="ml-[2px] inline-block h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white" />
                                      </span>
                                    ) : (
                                      t.image
                                    )}
                                  </div>

                                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                                </button>
                              </SplideSlide>
                            )
                          })}
                        </Splide>
                      )}

                      {/* ===== Text / cast ===== */}
                      <div className="space-y-2 text-[#F0EADB]">
                        <div className="italic text-[11px] flex items-center gap-3 md:text-base">
                          <div className="mb-2 me-3">
                            <span>
                              {t.directedBy} | {directorName}
                            </span>
                          </div>
                          <div className="h-px flex-1 bg-[#F0EADB]/30" />
                        </div>

                        <div className="flex flex-wrap items-baseline gap-3 text-sm md:text-lg">
                          <span className="italic font-semibold">{workTitle}</span>
                          <span className="italic text-[#F0EADB]/70">{activeWork?.year}</span>
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
                    </div>
                  </SectionReveal>
                </div>
              </motion.div>
            </AnimatePresence>
          </PageContentReveal>
        </div>

        <BookModal open={modalOpen} onClose={closeMedia} maxWidth={1100} maxHeight={720}>
          <div className="h-full w-full bg-black">
            {activeMedia?.type === 'video' ? (
              activeMedia?.videoUrl ? (
                renderVideo(activeMedia.videoUrl)
              ) : (
                <div className="grid h-full place-items-center text-white/80">{t.noVideoUrl}</div>
              )
            ) : (
              <div className="relative h-full w-full">
                {pickUploadUrl(activeMedia?.thumbEn, activeMedia?.thumbAr, lang) ? (
                  <Image
                    src={pickUploadUrl(activeMedia?.thumbEn, activeMedia?.thumbAr, lang)}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                ) : (
                  <div className="grid h-full place-items-center text-white/80">{t.noImage}</div>
                )}
              </div>
            )}
          </div>
        </BookModal>
      </section>
    </SectionReveal>
  )
}

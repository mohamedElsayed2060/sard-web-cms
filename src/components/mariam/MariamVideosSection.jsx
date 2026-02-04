'use client'

import { useMemo, useState } from 'react'
import SectionReveal from '@/components/motion/SectionReveal'
import PageContentReveal from '@/components/PageContentReveal'
import GalleryCarousel from '@/components/shared/GalleryCarousel'
import BookModal from '@/components/shared/BookModal'
import { imgUrl } from '@/lib/cms'
import clsx from 'clsx'

const EASE = [0.19, 1, 0.22, 1]

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')
const pickUploadUrl = (enFile, arFile, lang) => {
  const chosen = lang === 'ar' ? arFile || enFile : enFile || arFile
  return chosen ? imgUrl(chosen) : null
}

function renderVideo(url, title = 'Video') {
  if (!url) return null
  const u = String(url).trim()
  const isYouTube = /youtube\.com\/watch\?v=|youtu\.be\//i.test(u)

  if (isYouTube) {
    let id = ''
    try {
      const parsed = new URL(u)
      if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.replace('/', '')
      else id = parsed.searchParams.get('v') || ''
    } catch {
      id = (u.split('v=')[1] || '').split('&')[0]
    }
    const embed = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`
    return (
      <iframe
        src={embed}
        className="h-full w-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        title={title}
      />
    )
  }

  return <video src={u} controls autoPlay playsInline className="h-full w-full object-contain" />
}

export default function MariamVideosSection({ gallery, bgImage, lang = 'en' }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)

  const sectionTitle = pickText(gallery?.sectionTitleEn, gallery?.sectionTitleAr, lang)
  const sectionDescription = pickText(
    gallery?.sectionDescriptionEn,
    gallery?.sectionDescriptionAr,
    lang,
  )

  const items = useMemo(() => {
    const raw = gallery?.items || []
    return [...raw]
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
      .map((it, idx) => ({
        id: it?.id || it?._id || idx,
        title: pickText(it?.titleEn, it?.titleAr, lang),
        description: pickText(it?.descriptionEn, it?.descriptionAr, lang),
        background: pickUploadUrl(it?.backgroundEn, it?.backgroundAr, lang), // ✅ optional
        videoUrl: it?.videoUrl,
      }))
  }, [gallery, lang])

  if (!gallery || gallery?.isActive === false) return null
  if (!items.length) return null

  const onPlay = (it) => {
    setActive(it)
    setOpen(true)
  }

  return (
    <SectionReveal delay={0.12} ease={EASE}>
      <section className="max-w-[1490px] mx-auto px-3 ">
        <PageContentReveal
          paperColor="#F4E8D7"
          className={[
            'relative rounded-[32px] py-7 md:py-18 md:px-12 overflow-hidden',
            'shadow-none',
          ].join(' ')}
          bgImage={bgImage}
        >
          <div className="relative">
            {(sectionTitle || sectionDescription) && (
              <div className="mb-6 md:mb-8 px-3 md:px-0 ">
                {sectionTitle && (
                  <div className="">
                    <div className="h-px bg-black/20" />

                    <div
                      className={clsx(
                        'flex items-center py-3 md:py-4 font-semibold',
                        'text-[#252525] italic text-2xl md:text-4xl',
                      )}
                    >
                      <span>{sectionTitle}</span>
                    </div>

                    <div className="h-px bg-black/20" />
                  </div>
                )}

                {sectionDescription && (
                  <div className="mt-2 text-[#252525]/75 text-sm md:text-base max-w-[920px]">
                    {sectionDescription}
                  </div>
                )}
              </div>
            )}

            <GalleryCarousel items={items} onPlay={onPlay} variant="default" lang={lang} />
          </div>
        </PageContentReveal>

        <BookModal open={open} onClose={() => setOpen(false)} maxWidth={1100} maxHeight={720}>
          <div className="h-full w-full bg-black">
            {active?.videoUrl ? (
              renderVideo(active.videoUrl, lang === 'ar' ? 'فيديو' : 'Video')
            ) : (
              <div className="grid h-full place-items-center text-white/80">
                {lang === 'ar' ? 'لا يوجد رابط فيديو' : 'No video URL provided'}
              </div>
            )}
          </div>
        </BookModal>
      </section>
    </SectionReveal>
  )
}

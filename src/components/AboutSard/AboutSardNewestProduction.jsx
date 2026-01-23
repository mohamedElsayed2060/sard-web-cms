'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import PageContentReveal from '@/components/PageContentReveal'
import SectionReveal from '@/components/motion/SectionReveal'
import GalleryCarousel from '@/components/shared/GalleryCarousel'
import BookModal from '@/components/shared/BookModal'
import { imgUrl } from '@/lib/cms'

const EASE = [0.19, 1, 0.22, 1]
const SUPPORTED_LANGS = ['en', 'ar']

const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const UI = {
  en: {
    noVideoUrl: 'No video URL provided',
    videoTitle: 'Video',
  },
  ar: {
    noVideoUrl: 'لا يوجد رابط فيديو',
    videoTitle: 'فيديو',
  },
}

const pickText = (en, ar, lang) => {
  if (lang === 'ar') return ar || en || ''
  return en || ar || ''
}

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

export default function AboutSardNewestProduction({ gallery, bgImage, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const t = UI[lang] || UI.en

  const [modalOpen, setModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)

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
        background: pickUploadUrl(it?.backgroundEn, it?.backgroundAr, lang),
        videoUrl: it?.videoUrl,
      }))
  }, [gallery, lang])

  if (!gallery || gallery?.isActive === false) return null
  if (!items.length) return null

  const openVideo = (it) => {
    setActiveItem(it)
    setModalOpen(true)
  }

  const closeVideo = () => {
    setModalOpen(false)
    setActiveItem(null)
  }
  // variant="scrollFlip"
  return (
    <SectionReveal delay={0.12} ease={EASE}>
      <section className="max-w-[1490px] mx-auto px-3">
        <PageContentReveal
          paperColor="#F4E8D7"
          className={[
            'relative rounded-[32px] py-7 md:py-18 md:px-18 overflow-hidden',
            'shadow-none',
          ].join(' ')}
          bgImage={bgImage}
        >
          {/* background like other sections */}
          <div className="absolute inset-0 bg-cover bg-center" />
          <div className="absolute inset-0" />

          <div className="relative">
            {(sectionTitle || sectionDescription) && (
              <div className="mb-6 md:mb-8">
                {sectionTitle && (
                  <div className="text-[#252525] italic text-2xl md:text-4xl">{sectionTitle}</div>
                )}
                {sectionDescription && (
                  <div className="mt-2 text-[#252525]/75 text-sm md:text-base max-w-[920px]">
                    {sectionDescription}
                  </div>
                )}
              </div>
            )}

            <GalleryCarousel items={items} onPlay={openVideo} variant="default" />
          </div>
        </PageContentReveal>

        <BookModal open={modalOpen} onClose={closeVideo} maxWidth={1100} maxHeight={720}>
          <div className="h-full w-full bg-black">
            {activeItem?.videoUrl ? (
              renderVideo(activeItem.videoUrl, t.videoTitle)
            ) : (
              <div className="grid h-full place-items-center text-white/80">{t.noVideoUrl}</div>
            )}
          </div>
        </BookModal>
      </section>
    </SectionReveal>
  )
}

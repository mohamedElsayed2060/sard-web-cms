'use client'

import { useMemo, useState } from 'react'
import SectionReveal from '@/components/motion/SectionReveal'
import PageContentReveal from '@/components/PageContentReveal'
import GalleryCarousel from '@/components/shared/GalleryCarousel'
import BookModal from '@/components/shared/BookModal'
import { imgUrl } from '@/lib/cms'

const EASE = [0.19, 1, 0.22, 1]

function renderVideo(url) {
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
        title="Video"
      />
    )
  }

  return <video src={u} controls autoPlay playsInline className="h-full w-full object-contain" />
}

export default function SardProductionGallerySection({ gallery, bgImage }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)

  const items = useMemo(() => {
    const raw = gallery?.items || []
    return [...raw]
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
      .map((it, idx) => ({
        id: it?.id || it?._id || idx,
        title: it?.title,
        description: it?.description,
        background: it?.background ? imgUrl(it.background) : null,
        videoUrl: it?.videoUrl,
      }))
  }, [gallery])

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

  return (
    <SectionReveal variant="fadeUp" delay={0.12} ease={EASE} className={''}>
      <section className="max-w-[1490px] mx-auto px-3 ">
        <PageContentReveal
          bgImage={bgImage}
          className="relative rounded-[32px] px-3 py-7 md:py-18 md:px-18 overflow-hidden shadow-none"
        >
          {/* background like other sections */}
          <div className="absolute inset-0 bg-cover bg-center" />
          <div className="absolute inset-0 " />

          <div className="relative">
            {(gallery?.sectionTitle || gallery?.sectionDescription) && (
              <div className="mb-6 md:mb-8">
                {gallery?.sectionTitle && (
                  <div className="text-[#252525] italic text-2xl md:text-4xl">
                    {gallery.sectionTitle}
                  </div>
                )}
                {gallery?.sectionDescription && (
                  <div className="mt-2 text-[#252525]/75 text-sm md:text-base max-w-[920px]">
                    {gallery.sectionDescription}
                  </div>
                )}
              </div>
            )}

            {/* ✅ هنا بنستعمل variant="tall" عشان نفس شكل الصورة */}
            <GalleryCarousel items={items} onPlay={openVideo} variant="tall" />
          </div>
        </PageContentReveal>

        <BookModal open={modalOpen} onClose={closeVideo} maxWidth={1100} maxHeight={720}>
          <div className="h-full w-full bg-black">
            {activeItem?.videoUrl ? (
              renderVideo(activeItem.videoUrl)
            ) : (
              <div className="grid h-full place-items-center text-white/80">No video URL</div>
            )}
          </div>
        </BookModal>
      </section>
    </SectionReveal>
  )
}

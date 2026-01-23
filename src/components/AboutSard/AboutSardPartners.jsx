'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { imgUrl } from '@/lib/cms'
import PageContentReveal from '@/components/PageContentReveal'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import SectionReveal from '../motion/SectionReveal'
import useDocumentDir from '@/components/shared/useDocumentDir'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'

const SUPPORTED_LANGS = ['en', 'ar']
const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')

export default function AboutSardPartners({ doc, bgImage, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const dir = useDocumentDir(lang === 'ar' ? 'rtl' : 'ltr')

  const title = pickText(doc?.sectionTitleEn, doc?.sectionTitleAr, lang) || 'OUR PARTNERS'

  const list = useMemo(() => {
    return (doc?.items || [])
      .filter((x) => x?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
  }, [doc])

  if (!doc || list.length === 0) return null
  // variant="scrollFlip"
  return (
    <SectionReveal delay={0.1}>
      <section className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
        <PageContentReveal
          variant="slideUp"
          paperColor="#F4E8D7"
          className="rounded-[24px] px-3 py-7 md:py-18 md:px-18"
          bgImage={bgImage}
        >
          {/* Title فقط */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="h-px flex-1 bg-black/70" />
              <h2 className="w-full italic text-2xl md:text-4xl font-semibold text-[#252525] whitespace-nowrap">
                {title}
              </h2>
              <div className="h-px flex-1 bg-black/50 mb-2" />
            </div>
          </div>

          {/* Slider Logos */}
          <SectionReveal variant="fadeUp" delay={0.35}>
            <div className="relative">
              <Splide
                className="w-full"
                extensions={{ AutoScroll }}
                options={{
                  direction: dir,
                  type: 'loop', // ✅ لازم loop عشان يمشي باستمرار
                  gap: '1rem',
                  pagination: false,
                  arrows: false,
                  drag: 'free',
                  perMove: 1,

                  perPage: 5,
                  breakpoints: {
                    1280: { perPage: 4 },
                    1024: { perPage: 3 },
                    768: { perPage: 2.5 },
                    640: { perPage: 2 },
                    480: { perPage: 1.4 },
                  },

                  // ✅ Auto Scroll
                  autoScroll: {
                    speed: 0.35, // البطء (زود/قلل براحتك: 0.2 أبطأ / 0.6 أسرع)
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    rewind: false,
                  },
                }}
              >
                {list.map((it, i) => {
                  const src = it?.logo ? imgUrl(it.logo) : null
                  const alt = it?.name || 'Partner'

                  return (
                    <SplideSlide key={i}>
                      <div
                        className="h-[120px] md:h-[140px] rounded-[18px] border border-black/10 bg-white/50
                                   flex items-center justify-center px-6"
                        style={{
                          backgroundImage: bgImage?.src ? `url('${bgImage.src}')` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {src ? (
                          <Image
                            src={src}
                            alt={alt}
                            width={260}
                            height={120}
                            className="max-h-[70px] md:max-h-[86px] w-auto object-contain"
                          />
                        ) : (
                          <div className="text-xs text-black/40">Upload logo in CMS</div>
                        )}
                      </div>
                    </SplideSlide>
                  )
                })}
              </Splide>
            </div>
          </SectionReveal>
        </PageContentReveal>
      </section>
    </SectionReveal>
  )
}

'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { imgUrl } from '@/lib/cms'
import PageContentReveal from '@/components/PageContentReveal'
import BookModal from '@/components/shared/BookModal'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import SectionReveal from '../motion/SectionReveal'
import RichColumn from '../richtext/RichColumn'
import useDocumentDir from '@/components/shared/useDocumentDir'

const SUPPORTED_LANGS = ['en', 'ar']
const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')
const pickRich = (enVal, arVal, lang) =>
  lang === 'ar' ? arVal || enVal || null : enVal || arVal || null

export default function AboutSardGrants({ doc, bgImage, brandMark, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const dir = useDocumentDir(lang === 'ar' ? 'rtl' : 'ltr')

  const title = pickText(doc?.sectionTitleEn, doc?.sectionTitleAr, lang) || 'SARD GRANTS'

  const desc = pickRich(doc?.descriptionEn, doc?.descriptionAr, lang)

  const list = useMemo(() => {
    return (doc?.items || [])
      .filter((x) => x?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
  }, [doc])

  const [active, setActive] = useState(null)

  if (!doc || !list.length) return null

  return (
    <SectionReveal delay={0.1}>
      <section className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
        <PageContentReveal
          variant="slideUp"
          paperColor="#F4E8D7"
          className="rounded-[24px] px-3 py-7 md:py-18 md:px-18"
          bgImage={bgImage}
        >
          {/* Header + description */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="h-px flex-1 bg-black/70" />

              <h2 className="w-full italic text-2xl md:text-4xl font-semibold text-[#252525] whitespace-nowrap">
                {title}
              </h2>

              <div className="h-px flex-1 bg-black/50 mb-2" />
            </div>

            {desc ? (
              <div className="max-w-[980px]">
                <RichColumn value={desc} textColor="text-[#252525]" />
              </div>
            ) : null}
          </div>

          {/* Slider */}
          <SectionReveal variant="fadeUp" delay={0.35}>
            <div className="relative">
              <Splide
                className="w-full"
                options={{
                  direction: dir,
                  type: 'slide',
                  gap: '1rem',
                  pagination: false,
                  arrows: false,
                  drag: 'free',
                  perPage: 3.5,
                  focus: dir === 'rtl' ? 'start' : 'end',
                  breakpoints: {
                    1024: { perPage: 2 },
                    768: { perPage: 2 },
                    640: { perPage: 1.4 },
                    480: { perPage: 1.2 },
                  },
                }}
              >
                {list.map((it, i) => {
                  const year = it?.year || ''
                  const caption = pickText(it?.captionEn, it?.captionAr, lang)
                  const imgSrc = it?.image ? imgUrl(it.image) : null

                  const roundTL = i % 2 === 1
                  const roundTR = i % 2 === 0

                  return (
                    <SplideSlide key={it?.id || i}>
                      <button
                        type="button"
                        onClick={() => setActive(it)}
                        className="w-full text-left"
                      >
                        <div className="overflow-hidden duration-200 ease-in cursor-pointer rounded-b-lg hover:shadow pb-2">
                          {/* Image */}
                          <div
                            className={[
                              'relative w-full h-[240px] md:h-[270px]',
                              roundTR ? 'rounded-tr-[28px]' : '',
                              roundTL ? 'rounded-tl-[28px]' : '',
                            ].join(' ')}
                          >
                            {imgSrc ? (
                              <Image
                                src={imgSrc}
                                alt={caption || year || 'Grant'}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover rounded-lg rounded-tl-3xl"
                                priority={i < 2}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
                                Upload photo in CMS
                              </div>
                            )}
                          </div>

                          {/* Text under image */}
                          <div
                            className="pt-4 px-1"
                            style={{
                              backgroundImage: bgImage?.src ? `url('${bgImage.src}')` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="italic text-2xl md:text-3xl font-semibold text-[#252525] leading-none">
                                {year}
                              </h3>
                            </div>

                            <div className="h-px bg-black/35 mt-3 mb-4" />

                            <p className="text-sm text-[#252525]/80 truncate">{caption}</p>
                          </div>
                        </div>
                      </button>
                    </SplideSlide>
                  )
                })}
              </Splide>
            </div>
          </SectionReveal>

          {/* Modal */}
          <BookModal
            open={!!active}
            onClose={() => setActive(null)}
            brandMark={brandMark?.src}
            paperBg="#F4E8D7"
            introMs={2050}
            openMs={1050}
          >
            <div
              className="p-6 md:p-10"
              style={{
                backgroundImage: bgImage?.src ? `url('${bgImage.src}')` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Image left */}
                <div className="rounded-[22px] overflow-hidden bg-black/90">
                  {active?.image ? (
                    <Image
                      src={imgUrl(active.image)}
                      alt={active?.year || 'Grant'}
                      width={900}
                      height={900}
                      className="w-full h-[340px] md:h-[520px] object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-[340px] md:h-[520px]" />
                  )}
                </div>

                {/* Content right (year + caption + rich) */}
                <div className="text-[#252525]">
                  {active ? (
                    <>
                      <h3 className="italic text-3xl md:text-5xl font-semibold">
                        {active?.year || ''}
                      </h3>

                      <div className="h-px bg-black/35 mt-4 mb-5" />

                      <p className="text-base text-[#252525]/85 mb-4">
                        {pickText(active?.captionEn, active?.captionAr, lang)}
                      </p>

                      {pickRich(active?.detailsEn, active?.detailsAr, lang) ? (
                        <RichColumn
                          value={pickRich(active?.detailsEn, active?.detailsAr, lang)}
                          textColor="text-[#252525]"
                        />
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </BookModal>
        </PageContentReveal>
      </section>
    </SectionReveal>
  )
}

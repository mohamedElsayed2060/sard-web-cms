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

const UI = {
  en: {
    header: 'Our Team',
    uploadPhoto: 'Upload photo in CMS',
    member: 'Team member',
    prevWorks: 'Previous Works',
  },
  ar: {
    header: 'فريقنا',
    uploadPhoto: 'ارفع الصورة من الـ CMS',
    member: 'عضو الفريق',
    prevWorks: 'الأعمال السابقة',
  },
}

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')
const pickRich = (enVal, arVal, lang) =>
  lang === 'ar' ? arVal || enVal || null : enVal || arVal || null

const pickUploadObj = (enFile, arFile, lang) =>
  lang === 'ar' ? arFile || enFile : enFile || arFile

function plainTextFromRich(value) {
  const nodes = Array.isArray(value) ? value : value?.root?.children || []

  const walk = (n) => {
    if (!n) return ''
    if (Array.isArray(n)) return n.map(walk).join(' ')
    if (n.type === 'text') return n.text || n.content || ''
    if (n.type === 'linebreak') return '\n'
    if (n.children) return walk(n.children)
    return ''
  }

  return walk(nodes).replace(/\s+/g, ' ').trim()
}

const typeLabel = (lang, v) => {
  if (!v) return ''
  const mapEn = {
    series: 'Series',
    film: 'Film',
    short: 'Short',
    program: 'Program',
    other: 'Other',
  }
  const mapAr = {
    series: 'مسلسل',
    film: 'فيلم',
    short: 'فيلم قصير',
    program: 'برنامج',
    other: 'أخرى',
  }
  return lang === 'ar' ? mapAr[v] || v : mapEn[v] || v
}

export default function AboutSardTeam({ members = [], bgImage, brandMark, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const t = UI[lang] || UI.en

  const dir = useDocumentDir(lang === 'ar' ? 'rtl' : 'ltr')

  const list = useMemo(() => {
    return (members || [])
      .filter((m) => m?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
  }, [members])

  const [active, setActive] = useState(null)

  if (!list.length) return null

  return (
    <SectionReveal delay={0.1}>
      <section className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
        <PageContentReveal
          variant="slideUp"
          paperColor="#F4E8D7"
          className="rounded-[24px] px-3 py-7 md:py-18 md:px-18"
          bgImage={bgImage}
        >
          {/* Header */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="h-px flex-1 bg-black/50" />

              <h2 className="w-full italic text-2xl md:text-4xl font-semibold text-[#252525] whitespace-nowrap">
                {t.header}
              </h2>

              <div className="h-px flex-1 bg-black/50 mb-2" />
            </div>
          </div>

          {/* Slider */}
          <SectionReveal variant="fadeUp" delay={0.5}>
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
                    640: { perPage: 1.5 },
                    480: { perPage: 1.5 },
                  },
                }}
              >
                {list.map((m, i) => {
                  const name = pickText(m?.nameEn, m?.nameAr, lang) || t.member
                  const jobTitle = pickText(m?.jobTitleEn, m?.jobTitleAr, lang)
                  const shortBio = pickText(m?.shortBioEn, m?.shortBioAr, lang)
                  const details = pickRich(m?.detailsEn, m?.detailsAr, lang)

                  const photoObj = pickUploadObj(m?.photoEn, m?.photoAr, lang)
                  const badgeObj = pickUploadObj(m?.badgeIconEn, m?.badgeIconAr, lang)

                  const photoSrc = photoObj ? imgUrl(photoObj) : null
                  const badgeSrc = badgeObj ? imgUrl(badgeObj) : null

                  // ✅ prefer shortBio, fallback to details excerpt
                  const teaserSource = shortBio || plainTextFromRich(details || '')
                  const excerpt = String(teaserSource || '').slice(0, 220)

                  const roundTL = i % 2 === 1
                  const roundTR = i % 2 === 0

                  return (
                    <SplideSlide key={m?.id || i}>
                      <button
                        type="button"
                        onClick={() => setActive(m)}
                        className="w-full text-left"
                      >
                        <div className="overflow-hidden duration-200 ease-in cursor-pointer rounded-b-lg hover:shadow pb-2">
                          {/* Photo */}
                          <div
                            className={[
                              'relative w-full h-[260px] md:h-[440px]',
                              roundTR ? 'rounded-tr-[28px]' : '',
                              roundTL ? 'rounded-tl-[28px]' : '',
                            ].join(' ')}
                          >
                            {photoSrc ? (
                              <Image
                                src={photoSrc}
                                alt={name}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover rounded-lg rounded-tl-3xl"
                                priority={i < 2}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
                                {t.uploadPhoto}
                              </div>
                            )}
                          </div>

                          {/* Body */}
                          <div
                            className="pt-5 px-1"
                            style={{
                              backgroundImage: bgImage?.src ? `url('${bgImage.src}')` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="italic text-lg md:text-3xl font-semibold text-[#252525] leading-none">
                                  {name}
                                </h3>
                                {jobTitle ? (
                                  <div className="mt-2 text-[13px] md:text-[14px] text-[#252525]/75 truncate">
                                    {jobTitle}
                                  </div>
                                ) : null}
                              </div>

                              {badgeSrc ? (
                                <Image
                                  src={badgeSrc}
                                  alt=""
                                  width={28}
                                  height={28}
                                  className="object-contain"
                                />
                              ) : null}
                            </div>

                            <div className="h-px bg-black/35 mt-3 mb-4" />

                            <p
                              className="text-sm text-[#252525]/80"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {excerpt}
                            </p>
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
              <div className="grid gap-6 md:grid-cols-2 items-start">
                {/* Photo */}
                <div className="rounded-[22px] overflow-hidden bg-black/90">
                  {active ? (
                    (() => {
                      const name = pickText(active?.nameEn, active?.nameAr, lang) || t.member
                      const photoObj = pickUploadObj(active?.photoEn, active?.photoAr, lang)
                      const photoSrc = photoObj ? imgUrl(photoObj) : null
                      return photoSrc ? (
                        <Image
                          src={photoSrc}
                          alt={name}
                          width={900}
                          height={900}
                          className="w-full h-[340px] md:h-[520px] object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-[340px] md:h-[520px]" />
                      )
                    })()
                  ) : (
                    <div className="w-full h-[340px] md:h-[520px]" />
                  )}
                </div>

                {/* Content */}
                <div className="text-[#252525]">
                  {active
                    ? (() => {
                        const name = pickText(active?.nameEn, active?.nameAr, lang) || t.member
                        const jobTitle = pickText(active?.jobTitleEn, active?.jobTitleAr, lang)
                        const details = pickRich(active?.detailsEn, active?.detailsAr, lang)

                        const badgeObj = pickUploadObj(
                          active?.badgeIconEn,
                          active?.badgeIconAr,
                          lang,
                        )
                        const badgeSrc = badgeObj ? imgUrl(badgeObj) : null

                        const works = Array.isArray(active?.previousWorks)
                          ? active.previousWorks
                          : []

                        return (
                          <>
                            <div className="flex items-center gap-3">
                              <h3 className="italic text-2xl md:text-4xl font-semibold">{name}</h3>

                              {badgeSrc ? (
                                <Image
                                  src={badgeSrc}
                                  alt=""
                                  width={34}
                                  height={34}
                                  className="object-contain"
                                />
                              ) : null}
                            </div>

                            {jobTitle ? (
                              <div className="mt-2 text-[14px] md:text-[15px] text-black/70">
                                {jobTitle}
                              </div>
                            ) : null}

                            <div className="h-px bg-black/35 mt-4 mb-5" />

                            {details ? (
                              <RichColumn value={details} textColor="text-[#252525]" />
                            ) : null}

                            {/* ✅ Previous works list */}
                            {works.length ? (
                              <div className="mt-8">
                                <div className="text-black font-semibold tracking-[0.08em] text-[14px] md:text-[16px]">
                                  {t.prevWorks}
                                </div>
                                <div className="mt-3 h-[1px] w-full bg-black/10" />

                                <ul
                                  className={`mt-4 space-y-2 ${lang === 'ar' ? 'text-right' : ''}`}
                                >
                                  {works.map((w, i) => {
                                    const title = pickText(w?.titleEn, w?.titleAr, lang)
                                    if (!title) return null

                                    const meta = [
                                      w?.year ? String(w.year) : '',
                                      w?.type ? typeLabel(lang, w.type) : '',
                                    ].filter(Boolean)

                                    return (
                                      <li
                                        key={w?.id || i}
                                        className="text-black/75 text-[14px] leading-relaxed"
                                      >
                                        <span className="text-black/80">• </span>

                                        {w?.link ? (
                                          <a
                                            href={w.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="underline decoration-black/20 hover:decoration-black/40"
                                          >
                                            {title}
                                          </a>
                                        ) : (
                                          <span>{title}</span>
                                        )}

                                        {meta.length ? (
                                          <span className="text-black/45">
                                            {' '}
                                            — {meta.join(' • ')}
                                          </span>
                                        ) : null}
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                            ) : null}
                          </>
                        )
                      })()
                    : null}
                </div>
              </div>
            </div>
          </BookModal>
        </PageContentReveal>
      </section>
    </SectionReveal>
  )
}

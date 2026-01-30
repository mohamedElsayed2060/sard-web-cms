// src/app/(frontend)/[lang]/news/[slug]/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import PageContentReveal from '@/components/PageContentReveal'
import TransitionLink from '@/components/transition/TransitionLink'
import CMSImage from '@/components/CMSImage'
import RichColumn from '@/components/richtext/RichColumn'

import {
  getSiteHeader,
  getSiteFooter,
  getNewsBySlug,
  getLatestNewsExcludeSlug,
  imgUrl,
} from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'
import { notFound } from 'next/navigation'

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const path = `/${lang}/news/${slug}`
  return {
    title: lang === 'ar' ? 'تفاصيل الخبر' : 'News Details',
    alternates: {
      canonical: path,
      languages: { en: `/en/news/${slug}`, ar: `/ar/news/${slug}` },
    },
  }
}

export const revalidate = 60
function getYouTubeId(url = '') {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '')
    if (u.searchParams.get('v')) return u.searchParams.get('v')
    const m = u.pathname.match(/\/embed\/([^/]+)/)
    return m?.[1] || ''
  } catch {
    return ''
  }
}

function getVimeoId(url = '') {
  try {
    const u = new URL(url)
    const m = u.pathname.match(/\/(\d+)/)
    return m?.[1] || ''
  } catch {
    return ''
  }
}

function NewsMedia({ media, lang }) {
  const type = media?.type || 'none'
  const url = media?.url || ''
  if (!url || type === 'none') return null

  // Responsive wrapper 16:9
  const Wrap = ({ children }) => (
    <div className="w-full mt-5 rounded-[22px] overflow-hidden border border-black/10 bg-black/10">
      <div className="relative w-full aspect-video">{children}</div>
    </div>
  )

  if (type === 'youtube') {
    const id = getYouTubeId(url)
    if (!id) return null
    const src = `https://www.youtube.com/embed/${id}`
    return (
      <Wrap>
        <iframe
          src={src}
          title="YouTube video"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Wrap>
    )
  }

  if (type === 'vimeo') {
    const id = getVimeoId(url)
    if (!id) return null
    const src = `https://player.vimeo.com/video/${id}`
    return (
      <Wrap>
        <iframe
          src={src}
          title="Vimeo video"
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </Wrap>
    )
  }

  // Facebook: أبسط embed iframe باستخدام plugins/video.php
  if (type === 'facebook') {
    const fbSrc =
      `https://www.facebook.com/plugins/video.php?href=` +
      encodeURIComponent(url) +
      `&show_text=false&width=1280`
    return (
      <Wrap>
        <iframe
          src={fbSrc}
          title="Facebook video"
          className="absolute inset-0 w-full h-full"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </Wrap>
    )
  }
  if (type === 'direct') {
    const poster = media?.poster ? imgUrl(media.poster) : undefined

    return (
      <div className="mb-6 md:w-[80%] rounded-[22px] overflow-hidden border border-black/10 bg-black">
        <video className="w-full h-full" controls playsInline preload="metadata" poster={poster}>
          <source src={url} />
          {lang === 'ar'
            ? 'متصفحك لا يدعم تشغيل الفيديو.'
            : 'Your browser does not support the video tag.'}
        </video>
      </div>
    )
  }

  // external: نعرض زرار يفتح الفيديو بره
  if (type === 'external') {
    return (
      <div className="mt-7">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-white border border-white/15 hover:bg-black/65 transition"
        >
          {lang === 'ar' ? 'شاهد الفيديو' : 'Watch video'}
          <span className="text-white/80">↗</span>
        </a>
      </div>
    )
  }

  return null
}

export default async function NewsDetailsPage({ params }) {
  const { lang = 'en', slug } = await params

  const [header, footer, item] = await Promise.all([
    getSiteHeader(),
    getSiteFooter(),
    getNewsBySlug(slug),
  ])

  if (!item) return notFound()
  const relatedManual = Array.isArray(item?.relatedNews)
    ? item.relatedNews.map((x) => x?.news).filter(Boolean)
    : []

  // fallback
  let relatedFallback = []
  if (relatedManual.length === 0) {
    const res = await getLatestNewsExcludeSlug(slug, { limit: 3 })
    relatedFallback = res?.docs ?? []
  }

  const relatedItems = relatedManual.length > 0 ? relatedManual : relatedFallback

  const title = pickText(item?.titleEn, item?.titleAr, lang)
  const content = lang === 'ar' ? item?.contentAr : item?.contentEn
  const cover = item?.coverImage ? imgUrl(item.coverImage) : null

  const HEIGHTS = {
    default: 'h-[320px] md:h-[620px]',
    compact: 'h-[260px] md:h-[520px]',
    tall: 'h-[380px] md:h-[720px]',
  }
  const coverH = HEIGHTS[item?.coverHeightPreset] || HEIGHTS.default
  return (
    <div className={['bg-black max-w-[1490px] mx-auto'].join(' ')}>
      <MainHeader header={header} bgImage={marim_bg} />

      <div className="pt-5 px-3">
        <PageContentReveal
          variant="slideUp"
          className="rounded-[24px] px-3 py-7 md:px-10 md:py-10"
          bgImage={marim_bg}
        >
          <div className="mb-5">
            <TransitionLink
              href="/news"
              className="text-[12px] text-black/60 underline underline-offset-4"
            >
              {lang === 'ar' ? 'رجوع للأخبار' : 'Back to News'}
            </TransitionLink>
          </div>

          <h1 className="text-black italic text-xl md:text-4xl leading-tight mb-6 text-center">
            {title}
          </h1>

          {cover ? (
            <div
              className={`relative ${coverH} rounded-[22px] overflow-hidden border border-black/10 mb-7`}
            >
              <CMSImage src={cover} alt={title} fill className="object-cover" />
            </div>
          ) : null}
          <div className="flex justify-center">
            <NewsMedia media={item?.media} lang={lang} />
          </div>
          <div className="rounded-[22px] bg-white/55 border border-black/10 p-5">
            <RichColumn value={content} textColor="text-black/80" />
          </div>

          {Array.isArray(item?.sources) && item.sources.length > 0 ? (
            <div className="mt-6 text-[13px] text-black/70">
              <div className="font-medium mb-2">{lang === 'ar' ? 'المصدر:' : 'Source:'}</div>

              <div className="flex flex-wrap gap-2">
                {item.sources.map((s, idx) => {
                  const label = s?.label?.trim()
                  const url = s?.url?.trim()
                  if (!url) return null

                  return (
                    <a
                      key={`${url}-${idx}`}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white border border-white/15 hover:bg-black/65 transition"
                    >
                      {label || (lang === 'ar' ? `لينك ${idx + 1}` : `Link ${idx + 1}`)}
                      <span className="text-white/80">↗</span>
                    </a>
                  )
                })}
              </div>
            </div>
          ) : null}

          {relatedItems?.length ? (
            <div className="mt-10">
              <div className="text-black italic text-[18px] md:text-[25px]  font-bold tracking-[0.08em] mb-4">
                {lang === 'ar' ? 'قد يعجبك أيضًا' : 'You may also like this'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedItems.slice(0, 3).map((r) => {
                  const rTitle = pickText(r?.titleEn, r?.titleAr, lang)
                  const rExcerpt = pickText(r?.excerptEn, r?.excerptAr, lang)
                  const rCover = r?.coverImage ? imgUrl(r.coverImage) : null
                  const rHref = `/news/${r?.slug}`

                  return (
                    <TransitionLink
                      key={r?.id}
                      href={rHref}
                      className="group rounded-[22px] bg-white/50 text-black border border-black/10 overflow-hidden hover:bg-white/60 transition"
                    >
                      {rCover ? (
                        <div className="relative h-[220px] overflow-hidden">
                          <CMSImage
                            src={cover}
                            alt={title}
                            fill
                            className="
                            object-cover
                            transition
                            duration-700
                            ease-out
                            grayscale
                            group-hover:grayscale-0
                            group-hover:scale-[1.06]
                            "
                          />
                          <div
                            className="
                            absolute inset-0
                            bg-black/25
                            transition-opacity
                            duration-700
                            ease-out
                            group-hover:opacity-0
                            "
                          />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end">
                            <div className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur px-4 py-[5px] text-[12px] uppercase tracking-[0.22em] text-white border border-white/15">
                              {lang === 'ar' ? 'اقرأ المزيد' : 'Read more'}
                              <span
                                className={
                                  lang === 'ar'
                                    ? 'arrow-wiggle-left font-bold '
                                    : 'arrow-wiggle-right font-bold '
                                }
                              >
                                {lang === 'ar' ? '>' : '>'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="p-4">
                        <div className="italic text-[18px] font-semibold tracking-[0.08em] line-clamp-1">
                          {rTitle}
                        </div>

                        {rExcerpt ? (
                          <p className="mt-2 text-[13px] text-black/70 leading-relaxed line-clamp-2">
                            {rExcerpt}
                          </p>
                        ) : null}
                      </div>
                    </TransitionLink>
                  )
                })}
              </div>
            </div>
          ) : null}
        </PageContentReveal>
      </div>

      <MainFooter footer={footer} bgImage={marim_bg} />
    </div>
  )
}

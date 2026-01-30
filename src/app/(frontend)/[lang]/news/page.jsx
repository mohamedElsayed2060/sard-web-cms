// src/app/(frontend)/[lang]/news/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import PageContentReveal from '@/components/PageContentReveal'
import TransitionLink from '@/components/transition/TransitionLink'
import CMSImage from '@/components/CMSImage'
import RichColumn from '@/components/richtext/RichColumn'

import { getSiteHeader, getSiteFooter, getNewsList, imgUrl } from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}/news`
  const title = lang === 'ar' ? 'الأخبار' : 'News'
  return {
    title,
    alternates: {
      canonical: path,
      languages: { en: `/en/news`, ar: `/ar/news` },
    },
  }
}

export const revalidate = 60

export default async function NewsPage({ params, searchParams }) {
  const { lang = 'en' } = await params
  const sp = await searchParams // ✅ مهم في Next 15
  const page = Number(sp?.page ?? 1) || 1

  const [header, footer, newsRes] = await Promise.all([
    getSiteHeader(),
    getSiteFooter(),
    getNewsList({ page, limit: 6 }),
  ])

  const items = newsRes?.docs ?? []
  const totalPages = newsRes?.totalPages ?? 1
  const basePath = `/${lang}/news`

  return (
    <div className={['bg-black max-w-[1490px] mx-auto'].join(' ')}>
      <MainHeader header={header} bgImage={marim_bg} />

      <div className="pt-5 px-3">
        <PageContentReveal
          variant="slideUp"
          className="rounded-[24px] px-3 py-7 md:px-10 md:py-10"
          bgImage={marim_bg}
        >
          <h1 className="text-black italic text-[44px] md:text-[56px] leading-none mb-6">
            {lang === 'ar' ? 'الأخبار' : 'News'}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
            {items.map((n, i) => {
              const title = pickText(n?.titleEn, n?.titleAr, lang)
              const excerpt = pickText(n?.excerptEn, n?.excerptAr, lang)
              const cover = n?.coverImage ? imgUrl(n.coverImage) : null
              const href = `/news/${n?.slug}`

              return (
                <TransitionLink
                  key={n?.id}
                  href={href}
                  className="group card-enter rounded-[22px] bg-white/50 text-black border border-black/10 overflow-hidden hover:bg-white/60 transition"
                  style={{ animationDelay: `${Math.min(i, 11) * 70}ms` }}
                >
                  {cover ? (
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
                      {/* زرار Read more فوق الصورة */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end">
                        <div className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur px-4  py-[5px] text-[12px] uppercase tracking-[0.22em] text-white border border-white/15">
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
                    {/* Title: سطر واحد + ... */}
                    <div className="italic text-[18px] font-semibold tracking-[0.08em] line-clamp-1">
                      {title}
                    </div>

                    {/* Excerpt: سطرين + ... */}
                    {excerpt ? (
                      <p className="mt-2 text-[13px] text-black/70 leading-relaxed line-clamp-2">
                        {excerpt}
                      </p>
                    ) : null}
                  </div>
                </TransitionLink>
              )
            })}
          </div>

          {/* Pagination (بسيط بنفس روح المشروع) */}
          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-between text-black/70">
              <TransitionLink
                href={`${basePath}?page=${page - 1}`}
                className={[
                  'px-3 py-2 rounded-[14px] border border-black/10 bg-white/40',
                  page <= 1 ? 'pointer-events-none opacity-40' : '',
                ].join(' ')}
              >
                {lang === 'ar' ? 'السابق' : 'Prev'}
              </TransitionLink>

              <div className="text-[12px]">
                {lang === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
              </div>

              <TransitionLink
                href={`${basePath}?page=${page + 1}`}
                className={[
                  'px-3 py-2 rounded-[14px] border border-black/10 bg-white/40',
                  page >= totalPages ? 'pointer-events-none opacity-40' : '',
                ].join(' ')}
              >
                {lang === 'ar' ? 'التالي' : 'Next'}
              </TransitionLink>
            </div>
          ) : null}
        </PageContentReveal>
      </div>

      <MainFooter footer={footer} bgImage={marim_bg} />
    </div>
  )
}

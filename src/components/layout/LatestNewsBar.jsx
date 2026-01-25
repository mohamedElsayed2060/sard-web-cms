'use client'

import { useMemo } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import '@splidejs/react-splide/css'

import { imgUrl } from '@/lib/cms'
import TransitionLink from '@/components/transition/TransitionLink'
import PageContentReveal from '../PageContentReveal'

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')

function isInternalHref(href = '') {
  return href.startsWith('/') && !href.startsWith('//')
}

export default function LatestNewsBar({ data, bgImage, lang = 'en' }) {
  const accent = data?.accentColor || '#871D3F'
  const enabled = !!data?.enabled

  const items = useMemo(() => {
    const arr = Array.isArray(data?.items) ? data.items : []

    return arr
      .filter((x) => x?.isActive !== false)
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
  }, [data])

  if (!enabled || items.length === 0) return null

  const hasLoop = items.length > 1

  return (
    <div className={['bg-black pt-5 px-3 max-w-[1490px] mx-auto'].join(' ')}>
      <PageContentReveal
        variant="slideUp"
        paperColor="#F4E8D7"
        className="rounded-[24px] px-4 md:px-3  py-3 space-y-8"
        bgImage={bgImage}
      >
        <div className="relative mx-auto max-w-[1400px] md:px-8 ">
          {/* subtle grain (بدون صور) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            // style={{
            //   backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 0.6px, transparent 0.6px)',
            //   backgroundSize: '10px 10px',
            //   mixBlendMode: 'multiply',
            // }}
          />
          <div className="relative">
            <Splide
              options={{
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                type: hasLoop ? 'loop' : 'slide',
                perPage: 1.5,
                gap: '14px',
                arrows: false,
                pagination: false,
                drag: true,
                speed: 700,
                autoWidth: false,
                focus: 'center',
                autoScroll: hasLoop
                  ? { speed: 0.55, pauseOnHover: true, pauseOnFocus: true }
                  : false,

                breakpoints: {
                  1024: {
                    perPage: 1.5,
                    gap: '12px',
                  },
                  768: {
                    perPage: 1,
                    gap: '10px',
                    focus: 0,
                    padding: { left: '12px', right: '12px' },
                  },
                  480: {
                    perPage: 1,
                    gap: '5px',
                    focus: 0,
                    padding: { left: '10px', right: '10px' },
                  },
                },
              }}
              extensions={hasLoop ? { AutoScroll } : {}}
            >
              {items.map((it, idx) => {
                const title = pickText(it?.titleEn, it?.titleAr, lang)
                const summary = pickText(it?.summaryEn, it?.summaryAr, lang)
                const dateText = it?.dateText || ''
                const thumb = it?.thumb ? imgUrl(it.thumb) : null
                const href = it?.href || ''
                const newTab = it?.newTab !== false

                const Card = (
                  <div
                    className="
                        relative
                        flex flex-col md:flex-row
                        items-stretch md:items-center
                        gap-3
                        rounded-[26px]
                        px-3 py-2
                        w-full md:w-auto md:min-w-0
                     "
                  >
                    {/* thumbnail */}
                    <div className="shrink-0 w-full md:w-auto">
                      <div
                        className="
                            relative
                            h-[140px] md:h-[110px]
                            w-full md:w-[210px]
                            overflow-hidden
                            rounded-[16px]
                            "
                        style={{
                          background: 'rgba(0,0,0,0.06)',
                          border: '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={title || 'news'}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <div className="h-full w-full" />
                        )}
                      </div>
                    </div>

                    {/* text */}
                    <div className="min-w-0 flex-1 ">
                      <div className="md:w-[92%]">
                        <div className="text-[15px] font-medium text-black/80 mb-1">{dateText}</div>
                        <div className="h-[1px] flex-1 bg-black/20" />
                      </div>

                      <div className="italic mt-1 md:text-[18px]  font-semibold tracking-[0.08em] text-black">
                        {title}
                      </div>

                      <div className="md:w-[92%]">
                        {summary ? (
                          <p className="mt-2 text-[14px] leading-[1.45] text-black/70 line-clamp-3 md:line-clamp-2">
                            {summary}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* accent divider (desktop only) */}
                    <div
                      className="hidden md:block h-[88px] w-[1px]"
                      style={{ background: 'rgba(0,0,0,0.18)' }}
                    />
                  </div>
                )

                // clickable?
                if (!href) return <SplideSlide key={idx}>{Card}</SplideSlide>

                if (isInternalHref(href)) {
                  return (
                    <SplideSlide key={idx}>
                      <TransitionLink href={href} className="block">
                        {Card}
                      </TransitionLink>
                    </SplideSlide>
                  )
                }

                return (
                  <SplideSlide key={idx}>
                    <a
                      className="block"
                      href={href}
                      target={newTab ? '_blank' : undefined}
                      rel={newTab ? 'noreferrer' : undefined}
                    >
                      {Card}
                    </a>
                  </SplideSlide>
                )
              })}
            </Splide>
          </div>
        </div>
      </PageContentReveal>
    </div>
  )
}

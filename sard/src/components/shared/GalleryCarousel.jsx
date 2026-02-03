'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import clsx from 'clsx'
import useDocumentDir from '@/components/shared/useDocumentDir'
import TransitionLink from '@/components/transition/TransitionLink'

const swapPadding = (pad, dir) => {
  if (!pad || typeof pad !== 'object') return pad
  if (dir !== 'rtl') return pad
  const { left, right, ...rest } = pad
  return { ...rest, left: right, right: left }
}
const isInternalHref = (href = '') => href.startsWith('/') && !href.startsWith('//')

function getYouTubeThumb(url = '') {
  const u = String(url).trim()
  const isYouTube = /youtube\.com\/watch\?v=|youtu\.be\//i.test(u)
  if (!isYouTube) return null

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

  if (!id) return null
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

function isLikelyDirectVideo(url = '') {
  const u = String(url).trim().toLowerCase()
  return /\.(mp4|webm|ogg)(\?|#|$)/.test(u)
}

export default function GalleryCarousel({
  items = [],
  onPlay,
  className,
  initialIndex = 0,
  variant = 'default', // 'default' | 'tall' | 'production'
  lang,
  linkItems = false,
}) {
  const [mounted, setMounted] = useState(false)
  const splideRef = useRef(null)
  const rafRef = useRef(0)
  const wrapTimerRef = useRef(null)

  const dir = useDocumentDir('ltr')

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !items?.length) return

    const inst = splideRef.current?.splide || splideRef.current
    if (!inst?.root) return

    const track = inst.root.querySelector('.splide__track')
    if (!track) return

    const MIN = 0.84
    const MAX = 1
    const RANGE = 520

    const clamp01 = (v) => Math.max(0, Math.min(1, v))

    const setNoTrans = (on) => {
      const cards = inst.root.querySelectorAll('.galleryCard')
      cards.forEach((c) => c.classList.toggle('galleryCard--noTrans', on))
    }

    const onMove = (newIndex, prevIndex) => {
      if (Math.abs(newIndex - prevIndex) > 1) {
        setNoTrans(true)
        if (wrapTimerRef.current) clearTimeout(wrapTimerRef.current)
        wrapTimerRef.current = setTimeout(() => setNoTrans(false), 120)
      }
    }

    try {
      inst.on('move', onMove)
    } catch {}

    const update = () => {
      const trackRect = track.getBoundingClientRect()
      const centerX = trackRect.left + trackRect.width / 2
      const slides = inst.root.querySelectorAll('.splide__slide')

      slides.forEach((slide) => {
        const card = slide.querySelector('.galleryCard')
        if (!card) return

        const r = slide.getBoundingClientRect()
        const slideCenter = r.left + r.width / 2
        const dist = Math.abs(slideCenter - centerX)

        const t = clamp01(dist / RANGE)
        const ease = 1 - Math.pow(t, 2)

        const scale = MIN + (MAX - MIN) * ease
        const opacity = 0.45 + 0.55 * ease
        const z = Math.round(1 + ease * 100)

        card.style.transform = `scale(${scale})`
        card.style.opacity = `${opacity}`
        card.style.zIndex = String(z)
      })

      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (wrapTimerRef.current) clearTimeout(wrapTimerRef.current)
      try {
        inst.off('move', onMove)
      } catch {}
    }
  }, [mounted, items?.length])

  const isTall = variant === 'tall' || variant === 'production'
  if (!items?.length) return null

  const options = useMemo(() => {
    const baseTall = {
      perPage: 1,
      autoWidth: true,
      gap: '0.7rem',
      padding: { left: '14px', right: '14px' },
      trimSpace: false,
    }

    const baseDefault = {
      perPage: 1.5,
      gap: '0rem',
      padding: { left: '12%', right: '12%' },
    }

    const tallBreakpoints = {
      1536: { gap: '0.65rem', padding: { left: '12px', right: '12px' } },
      1280: { gap: '0.6rem', padding: { left: '10px', right: '10px' } },
      1024: { gap: '0.55rem', padding: { left: '10px', right: '10px' } },
      768: {
        autoWidth: false,
        perPage: 1,
        padding: { left: '25px', right: '25px' },
        gap: '0.75rem',
        trimSpace: false,
        focus: 'center',
      },
    }

    const defaultBreakpoints = {
      1536: { padding: { left: '11%', right: '11%' } },
      1280: { padding: { left: '10%', right: '10%' } },
      1024: { padding: { left: '8%', right: '8%' } },
      768: {
        autoWidth: false,
        perPage: 1,
        padding: 36,
        gap: '1rem',
      },
    }

    // swap paddings in RTL (only when it's object {left,right})
    const picked = isTall ? baseTall : baseDefault
    const breakpoints = isTall ? tallBreakpoints : defaultBreakpoints

    const fixedBreakpoints = Object.fromEntries(
      Object.entries(breakpoints).map(([k, v]) => {
        const next = { ...v }
        if ('padding' in next) next.padding = swapPadding(next.padding, dir)
        return [k, next]
      }),
    )

    return {
      direction: dir, // ✅ RTL/LTR
      type: 'loop',
      focus: 'center',
      pagination: false,
      arrows: false,
      drag: items.length > 1,
      start: initialIndex,
      speed: isTall ? 920 : 950,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)',

      ...picked,
      padding: swapPadding(picked.padding, dir),

      breakpoints: fixedBreakpoints,
    }
  }, [items.length, isTall, initialIndex, dir])

  return (
    <div
      className={clsx(
        'w-full galleryCarousel',
        isTall ? 'galleryCarousel--tall' : 'galleryCarousel--default',
        className,
      )}
      dir={dir}
    >
      {mounted && (
        <Splide ref={splideRef} aria-label="Gallery" options={options}>
          {items.map((it, i) => {
            const bgUrl = it?.background || getYouTubeThumb(it?.videoUrl)
            const needsVideoFallback = !bgUrl && isLikelyDirectVideo(it?.videoUrl)
            const canPlay = !!it?.videoUrl && typeof onPlay === 'function'

            const href = it?.href || ''
            const newTab = it?.newTab !== false
            const isLink = linkItems && !!href
            const internal = isInternalHref(href)

            // ✅ الكارت نفسه (مش هنعيد كتابته 3 مرات)
            const Card = (
              <div
                className={clsx(
                  'galleryCard',
                  'relative overflow-hidden rounded-[30px] transform-gpu shadow-none',
                  isTall ? 'h-[350px] md:h-[500px]' : 'h-[350px] md:h-[460px]',
                )}
                style={
                  bgUrl
                    ? {
                        backgroundImage: `url('${bgUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : undefined
                }
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                {needsVideoFallback && (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="rounded-2xl bg-black/35 border border-white/15 px-4 py-2 text-white/80 text-[12px] tracking-[0.18em] uppercase">
                      Video
                    </div>
                  </div>
                )}

                {/* ✅ لو احنا في link mode: مش عايزين play button */}
                {canPlay && !isLink && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      aria-label="Play"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPlay?.(it)
                      }}
                      className={clsx(
                        'galleryPlayBtn',
                        'h-16 w-16 rounded-full bg-white/15 backdrop-blur',
                        'border border-white/25 flex items-center justify-center',
                        'hover:bg-white/20 transition',
                      )}
                    >
                      <span className="ml-[2px] inline-block h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white" />
                    </button>
                  </div>
                )}

                <div className={clsx('absolute bottom-10 left-10 right-10', isTall && 'bottom-14')}>
                  <div className="max-w-[560px]">
                    <div
                      className={`text-[#F0EADB] italic text-2xl ${
                        isTall ? 'md:text-xl' : 'md:text-3xl'
                      } ${lang === 'ar' ? 'text-end' : ''}`}
                    >
                      {it?.title}
                    </div>

                    {it?.description && (
                      <div
                        className={`mt-4 text-[#F0EADB]/85 text-sm ${
                          isTall ? 'md:text-sm' : 'md:text-base'
                        } leading-relaxed ${lang === 'ar' ? 'text-end' : ''}`}
                      >
                        {it.description}
                      </div>
                    )}

                    {it?.director ? (
                      <div
                        className={`mt-1 text-[12px] uppercase tracking-[0.22em] text-[#F0EADB]/85 ${
                          lang === 'ar' ? 'text-end' : ''
                        }`}
                      >
                        {lang === 'ar' ? `إخراج: ${it?.director}` : `Directed by: ${it?.director}`}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )

            return (
              <SplideSlide key={it?.id || i}>
                {/* ✅ 1) لو linkItems شغال و href موجود → نفس Behavior LatestNewsBar */}
                {isLink ? (
                  internal ? (
                    <TransitionLink href={href} className="block w-full">
                      {Card}
                    </TransitionLink>
                  ) : (
                    <a
                      href={href}
                      className="block w-full"
                      target={newTab ? '_blank' : undefined}
                      rel={newTab ? 'noreferrer' : undefined}
                    >
                      {Card}
                    </a>
                  )
                ) : (
                  /* ✅ 2) غير كده → السلوك القديم زي ما هو */
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      const inst = splideRef.current?.splide || splideRef.current
                      if (inst?.go) inst.go(i)
                    }}
                    className="w-full"
                  >
                    {Card}
                  </div>
                )}
              </SplideSlide>
            )
          })}
        </Splide>
      )}
    </div>
  )
}

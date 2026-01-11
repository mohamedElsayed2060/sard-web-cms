'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import clsx from 'clsx'

export default function GalleryCarousel({
  items = [],
  onPlay,
  className,
  initialIndex = 0,
  variant = 'default', // 'default' | 'tall' | 'production'
}) {
  const [mounted, setMounted] = useState(false)
  const splideRef = useRef(null)
  const rafRef = useRef(0)
  const wrapTimerRef = useRef(null)

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

    // ✅ حل الومضة عند loop wrap: نطفي transition لحظيًا فقط وقت القفزة
    const onMove = (newIndex, prevIndex) => {
      // في loop لما يعمل wrap بيبقى الفرق كبير (مش خطوة واحدة)
      if (Math.abs(newIndex - prevIndex) > 1) {
        setNoTrans(true)
        if (wrapTimerRef.current) clearTimeout(wrapTimerRef.current)
        wrapTimerRef.current = setTimeout(() => setNoTrans(false), 120)
      }
    }

    try {
      inst.on('move', onMove)
    } catch {
      // لو النسخة مش داعمة move listener بشكل متوقع، تجاهل بأمان
    }

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

  const options = useMemo(
    () => ({
      type: 'loop',
      focus: 'center',
      pagination: false,
      arrows: false,
      drag: items.length > 1,
      start: initialIndex,

      speed: isTall ? 920 : 950,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)',

      ...(isTall
        ? {
            perPage: 1,
            autoWidth: true,
            gap: '0.7rem', // ✅ قللنا الجاب
            padding: { left: '14px', right: '14px' }, // ✅ ده اللي بيظبط الأطراف
            trimSpace: false,
          }
        : {
            perPage: 1.5,
            gap: '0rem', // ✅ قللنا المسافة
            padding: { left: '12%', right: '12%' }, // ✅ كانت كبيرة (18%)
          }),

      breakpoints: {
        1536: isTall
          ? { gap: '0.65rem', padding: { left: '12px', right: '12px' } }
          : { padding: { left: '11%', right: '11%' } },

        1280: isTall
          ? { gap: '0.6rem', padding: { left: '10px', right: '10px' } }
          : { padding: { left: '10%', right: '10%' } },

        1024: isTall
          ? { gap: '0.55rem', padding: { left: '10px', right: '10px' } }
          : { padding: { left: '8%', right: '8%' } },

        768: isTall
          ? {
              autoWidth: false, // ✅ اقفله على الموبايل
              perPage: 1, // ✅ واحد + حتة من اللي بعده
              padding: { left: '25px', right: '25px' },
              gap: '0.75rem',
              trimSpace: false,
              focus: 'center',
            }
          : {
              autoWidth: false,
              perPage: 1,
              padding: 36,
              gap: '1rem',
            },
      },
    }),
    [items.length, isTall, initialIndex],
  )

  return (
    <div
      className={clsx(
        'w-full galleryCarousel',
        isTall ? 'galleryCarousel--tall' : 'galleryCarousel--default',
        className,
      )}
    >
      {mounted && (
        <Splide ref={splideRef} aria-label="Gallery" options={options}>
          {items.map((it, i) => {
            const bgUrl = it?.background
            const canPlay = !!it?.videoUrl && typeof onPlay === 'function'

            return (
              <SplideSlide key={it?.id || i}>
                <div
                  role="button"
                  tabIndex={0}
                  type="button"
                  onClick={() => {
                    const inst = splideRef.current?.splide || splideRef.current
                    if (inst?.go) inst.go(i)
                  }}
                  className="w-full"
                >
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

                    {canPlay && (
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

                    <div
                      className={clsx('absolute bottom-10 left-10 right-10', isTall && 'bottom-14')}
                    >
                      <div className="max-w-[560px]">
                        <div
                          className={`text-[#F0EADB] italic text-2xl ${isTall ? 'md:text-xl' : 'md:text-3xl'}`}
                        >
                          {it?.title}
                        </div>
                        {it?.description && (
                          <div
                            className={`mt-4 text-[#F0EADB]/85 text-sm ${isTall ? 'md:text-sm' : 'md:text-base'} leading-relaxed`}
                          >
                            {it.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SplideSlide>
            )
          })}
        </Splide>
      )}
    </div>
  )
}

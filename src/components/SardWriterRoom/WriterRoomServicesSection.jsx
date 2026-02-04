'use client'

import clsx from 'clsx'
import SectionReveal from '@/components/motion/SectionReveal'
import PageContentReveal from '@/components/PageContentReveal'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { imgUrl } from '@/lib/cms'
import AnimatedArt from './AnimatedArt'
import { useEffect, useState } from 'react'

const EASE = [0.19, 1, 0.22, 1]

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')

function Icon({ name }) {
  const common = 'w-5 h-5 md:w-6 md:h-6'
  switch (name) {
    case 'pen':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0 0-4L17.5 4a2.8 2.8 0 0 0-4 0L3 14.5V20Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M12.5 5.5 18.5 11.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    case 'edit':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 20h4l10-10a2.8 2.8 0 0 0 0-4l-1-1a2.8 2.8 0 0 0-4 0L3 12v8Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 17h6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    case 'film':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16v13H4V7Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 11h16" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 7v4M12 7v4M16 7v4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    case 'idea':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3a7 7 0 0 0-4 12c.6.5 1 1.3 1 2.1V19h6v-1.9c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 3Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M9 22h6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    case 'users':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l2.2 6.5H21l-5.5 4 2.1 6.5-5.6-4-5.6 4 2.1-6.5L3 8.5h6.8L12 2Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      )
  }
}

export default function WriterRoomServicesSection({ data, bgImage, lang = 'en' }) {
  if (!data || data?.isActive === false) return null
  const [activeIconIdx, setActiveIconIdx] = useState(0)

  const title = pickText(data?.titleEn, data?.titleAr, lang)
  const items = (data?.items || [])
    .slice()
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
  useEffect(() => {
    if (!items.length) return

    const STEP_MS = 750
    const id = setInterval(() => {
      setActiveIconIdx((v) => (v + 1) % items.length)
    }, STEP_MS)

    return () => clearInterval(id)
  }, [items.length])

  return (
    <SectionReveal delay={0.12} ease={EASE}>
      <section className="max-w-[1490px] mx-auto px-3 mb-5">
        <PageContentReveal
          paperColor="#F4E8D7"
          className="relative rounded-[32px] px-3 py-7 md:py-14 md:px-16 overflow-hidden shadow-none"
          bgImage={bgImage}
        >
          <div className="relative">
            {/* Title with lines */}
            <div className="">
              <div className="h-px bg-black/20" />
              <div
                className={clsx(
                  'flex items-center py-4 md:py-5',
                  'italic text-2xl md:text-4xl font-semibold tracking-[0.18em] text-black/80',
                )}
              >
                <span>{title}</span>
              </div>
              <div className="h-px bg-black/20" />
            </div>

            {/* Grid */}
            <div className="mt-8 md:mt-10 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it, idx) => {
                const label = pickText(it?.labelEn, it?.labelAr, lang)
                const artSrc = it?.art ? imgUrl(it.art) : null
                const isActive = idx === activeIconIdx

                return (
                  <motion.div
                    key={it?.id || idx}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="rounded-2xl border border-black/10 bg-black/[0.03] px-6 py-6"
                  >
                    <div className="h-[92px] md:h-[110px] flex items-center justify-center mb-4">
                      {artSrc ? (
                        <AnimatedArt src={artSrc} alt={label} anim={it?.anim} isActive={isActive} />
                      ) : (
                        <div className="text-black/70">
                          <Icon name={it?.icon} />
                        </div>
                      )}
                    </div>

                    <div
                      className={clsx(
                        'text-black/80',
                        lang === 'ar' ? 'text-center' : 'text-center',
                      )}
                    >
                      <div className="font-semibold tracking-[0.08em] uppercase text-[12px] md:text-[15px]">
                        {label}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </PageContentReveal>
      </section>
    </SectionReveal>
  )
}

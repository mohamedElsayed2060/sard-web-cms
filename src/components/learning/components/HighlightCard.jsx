'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { imgUrl } from '@/lib/cms'
import { pickText, yearLabel, flattenPhotos, getDaysCount } from './highlightUtils'

export default function HighlightCard({ item, lang, onClick }) {
  const id = item?.id || item?.slug || item?.titleEn
  const cover = imgUrl(item?.coverImage)
  const title = pickText(item?.titleEn, item?.titleAr, lang)
  const y = yearLabel(item?.startYear, item?.endYear)

  const photosCount = flattenPhotos(item).length
  const daysCount = getDaysCount(item)

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      className={clsx(
        'group relative w-full rounded-[22px] overflow-hidden border border-black/10',
        'shadow-[0_14px_32px_rgba(0,0,0,0.16)] bg-white/60 backdrop-blur-[2px]',
        'focus:outline-none focus:ring-2 focus:ring-[#4A569F]/70 focus:ring-offset-0',
        lang === 'ar' ? 'text-right' : 'text-left',
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* IMAGE */}
      <motion.div layoutId={`hl-cover-${id}`} className="relative h-[250px] overflow-hidden">
        {cover ? (
          <>
            {/* BW -> Color */}
            <Image
              src={cover}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={clsx(
                'object-cover transition-all duration-700',
                'grayscale group-hover:grayscale-0',
                'group-hover:scale-[1.03]',
              )}
            />

            {/* overlay black (يبان في العادي ويختفي على hover) */}
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-700 group-hover:opacity-0" />

            {/* gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-90" />

            {/* Hover badge (Photos + Days) */}
            <div
              className={clsx(
                'absolute top-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300',
                lang === 'ar' ? 'left-3' : 'right-3',
              )}
            >
              {' '}
              <div
                className={clsx(
                  'px-3 py-2 rounded-full bg-black/55 text-white text-[11px] backdrop-blur-[2px]',
                  lang === 'ar' ? 'tracking-normal' : 'uppercase tracking-[0.18em]',
                )}
              >
                {lang === 'ar' ? 'شوف المزيد' : 'View'}{' '}
                <span className="font-semibold">+{photosCount}</span>
                {daysCount > 0 && (
                  <>
                    <span className="mx-2 opacity-70">•</span>
                    <span className="font-semibold">
                      {daysCount} {lang === 'ar' ? 'أيام' : daysCount > 1 ? 'days' : 'day'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-black/10" />
        )}
      </motion.div>

      {/* TEXT */}
      <div className="p-4">
        <div className={clsx('flex items-start justify-between gap-2')}>
          <motion.h3
            layoutId={`hl-title-${id}`}
            className="text-[12px] md:text-[13px] uppercase tracking-[0.18em] text-black/80 line-clamp-2"
          >
            {title}
          </motion.h3>

          {y && (
            <span className="shrink-0 text-[11px] px-2 py-1 rounded-full bg-[#4A569F] text-white">
              {y}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}

'use client'

import Image from 'next/image'
import { imgUrl } from '@/lib/cms'

export default function MasonryGallery({ photos, onOpenLightbox, lang }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-sm text-black/60">
        {lang === 'ar' ? 'لا توجد صور بعد.' : 'No photos yet.'}
      </div>
    )
  }

  return (
    <div className="columns-2 md:columns-3 gap-3" style={{ columnGap: '12px' }}>
      {photos.map((m, i) => {
        const src = imgUrl(m)
        const w = Number(m?.width)
        const h = Number(m?.height)
        const ar = Number.isFinite(w) && Number.isFinite(h) && h > 0 ? `${w}/${h}` : '4/3'

        return (
          <button
            key={m?.id || i}
            type="button"
            onClick={() => onOpenLightbox?.(i)}
            className="mb-3 w-full break-inside-avoid rounded-[18px] overflow-hidden border border-black/10 shadow-[0_14px_26px_rgba(0,0,0,0.12)] bg-white/40"
          >
            <div className="relative w-full" style={{ aspectRatio: ar }}>
              {src ? (
                <Image
                  src={src}
                  alt={m?.alt || 'photo'}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black/10" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

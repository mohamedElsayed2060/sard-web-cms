// src/components/Scene/SceneHome.jsx
'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { imgUrl } from '@/lib/cms'
import PageContentReveal from '../PageContentReveal'
import { useTransitionUI } from '../transition/TransitionProvider'
import { getLangFromPath, normalizePathname, navigateSard } from '@/lib/sardNavigation'

const pickText = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')
const pickUploadUrl = (enFile, arFile, lang) => {
  const chosen = lang === 'ar' ? arFile || enFile : enFile || arFile
  return chosen ? imgUrl(chosen) : null
}

// ✅ label support: labelEn/labelAr or label
const pickSpotLabel = (spot, lang) => {
  if (!spot) return ''
  const en = spot.labelEn || spot.label
  const ar = spot.labelAr || spot.label
  return pickText(en, ar, lang) || ''
}

export default function SceneHome({ scene, hotspots }) {
  const router = useRouter()
  const pathnameRaw = usePathname() || '/'
  // لو حابب تسيبه للمقارنة/ديباج لاحقًا
  // const pathname = normalizePathname(pathnameRaw)

  const lang = useMemo(() => getLangFromPath(pathnameRaw), [pathnameRaw])
  const { runSequence } = useTransitionUI()

  const bg = useMemo(
    () => pickUploadUrl(scene?.backgroundImageEn, scene?.backgroundImageAr, lang),
    [scene, lang],
  )

  const hint = useMemo(
    () =>
      pickText(scene?.hintEn, scene?.hintAr, lang) || 'Explore Sard by tapping the glowing points.',
    [scene, lang],
  )

  const [isMobile, setIsMobile] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)

  const go = async (targetPath) => {
    const href = targetPath || '/'

    // ✅ unified nav: doors/stack حسب ENV + نفس شرط "استنى الصفحة تبقى جاهزة" (path change)
    await navigateSard({
      href,
      lang,
      pathname: pathnameRaw,
      router,
      runSequence,
      timings: {
        // Doors timings (لو ENV=doors)
        closeMs: 750,
        logoMs: 650,
        openMs: 1250,
        fadeMs: 650,
        maxWaitMs: 8000,

        // Stack timings (لو ENV=stack) — سيبها تعتمد على defaults لو مش عايز تخصص
        // outMs: 260,
        // closeMs: 380,
        // openMs: 420,
        // fadeMs: 180,
        // maxWaitMs: 12000,
      },
    })
  }

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="min-h-[100dvh] bg-black overflow-auto md:overflow-hidden">
      <PageContentReveal
        className="
          relative bg-black
          w-[1200px] h-[675px] mx-auto
          md:mx-0 md:fixed md:inset-0
          md:w-full md:h-[100dvh]
        "
      >
        {/* Background */}
        {bg && (
          <Image
            src={bg}
            alt={scene?.title || 'Sard scene'}
            fill
            priority
            className="object-contain object-center"
          />
        )}

        {/* Hotspots */}
        {hotspots?.map((spot, index) => {
          const left = isMobile && spot.xMobile != null ? spot.xMobile : spot.x
          const top = isMobile && spot.yMobile != null ? spot.yMobile : spot.y
          const isActive = hoveredId === spot.id
          const pulseDelay = (index % 5) * 0.6

          const handleHotspotClick = () => {
            if (isMobile) {
              setHoveredId((prev) => (prev === spot.id ? null : spot.id))
            } else {
              go(spot.targetPath || '/')
            }
          }

          return (
            <div
              key={spot.id}
              className="absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className="relative"
                onMouseEnter={() => setHoveredId(spot.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <motion.button
                  type="button"
                  className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/60 backdrop-blur-sm"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleHotspotClick}
                >
                  <motion.span
                    className="pointer-events-none absolute inset-[-6px] rounded-full border-2 border-white/80 shadow-[0_0_18px_rgba(255,255,255,0.7)] mix-blend-screen"
                    animate={
                      isActive
                        ? { scale: 1.2, opacity: 0.9 }
                        : { scale: [0.4, 2.0], opacity: [0.9, 0] }
                    }
                    transition={
                      isActive
                        ? { duration: 0.2 }
                        : {
                            duration: 3.2,
                            repeat: Infinity,
                            repeatDelay: 1.2,
                            ease: 'easeOut',
                            delay: pulseDelay,
                          }
                    }
                  />

                  <span className="block h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)]" />
                </motion.button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full mt-2 -translate-x-1/2 pointer-events-none"
                    >
                      <button
                        type="button"
                        className="pointer-events-auto rounded-full border border-white/60 bg-black/80 px-3 py-1 text-[11px] leading-tight text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                        onClick={() => go(spot.targetPath || '/')}
                      >
                        <span className="typewriter whitespace-nowrap">
                          {pickSpotLabel(spot, lang)}
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}

        {/* Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/80">
          {hint}
        </div>
      </PageContentReveal>
    </div>
  )
}

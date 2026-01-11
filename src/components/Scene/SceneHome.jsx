// src/components/Scene/SceneHome.jsx
'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { imgUrl } from '@/lib/cms'
import PageContentReveal from '../PageContentReveal'
import { useTransitionUI } from '../transition/TransitionProvider'

export default function SceneHome({ scene, hotspots }) {
  const router = useRouter()
  const pathname = usePathname()

  const { runSequence } = useTransitionUI()
  const bg = scene ? imgUrl(scene.backgroundImage) : null

  const [isMobile, setIsMobile] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const go = (href) => {
    const target = (href || '/').split('?')[0].split('#')[0]
    if (target === pathname) return // ✅ نفس الصفحة

    return runSequence({
      onNavigate: async () => router.push(href),
      timings: { closeMs: 750, logoMs: 650, openMs: 1250, fadeMs: 650 },
    })
  }
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    // موبايل: scroll + سنتر | ديسكتوب: مفيش scroll
    <div className="min-h-[100dvh] bg-black overflow-auto md:overflow-hidden">
      {/* الكانڤاس الأساسي */}
      <PageContentReveal
        className="
          relative bg-black
          w-[1200px] h-[675px] mx-auto
          md:mx-0 md:fixed md:inset-0
          md:w-full md:h-[100dvh]
        "
      >
        {' '}
        {/* الصورة */}
        {bg && (
          <Image
            src={bg}
            alt={scene?.title || 'Sard scene'}
            fill
            priority
            className="object-contain object-center"
          />
        )}
        {/* الهوت سبوتس */}
        {hotspots?.map((spot, index) => {
          const left = isMobile && spot.xMobile != null ? spot.xMobile : spot.x
          const top = isMobile && spot.yMobile != null ? spot.yMobile : spot.y
          const isActive = hoveredId === spot.id

          const pulseDelay = (index % 5) * 0.6
          const handleHotspotClick = () => {
            if (isMobile) {
              // في الموبايل: بس افتح/اقفل التولتيب
              setHoveredId((prev) => (prev === spot.id ? null : spot.id))
            } else {
              // في الديسكتوب: روح على الصفحة علطول
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
                {/* الزرار / النقطة */}
                <motion.button
                  type="button"
                  className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/60 backdrop-blur-sm"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleHotspotClick} // 👈 بدال router.push المباشر
                >
                  {/* نبضة هادية: تبدأ صغيرة → تكبر → تختفي */}
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

                  {/* النقطة اللي في النص */}
                  <span className="block h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)]" />
                </motion.button>

                {/* التولتيب تحت الزرار */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full mt-2 -translate-x-1/2 pointer-events-none"
                    >
                      {/* الزرار الفعلي للتنقّل */}
                      <button
                        type="button"
                        className="pointer-events-auto rounded-full border border-white/60 bg-black/80 px-3 py-1 text-[11px] leading-tight text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                        onClick={() => go(spot.targetPath || '/')}
                      >
                        <span className="typewriter whitespace-nowrap">{spot.label}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
        {/* الهنت تحت */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/80">
          {scene?.hint || 'Explore Sard by tapping the glowing points.'}
        </div>
      </PageContentReveal>
    </div>
  )
}

// src/components/Scene/SceneHome.jsx
'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import { imgUrl } from '@/lib/cms'
import PageContentReveal from '../PageContentReveal'
import { useTransitionUI } from '../transition/TransitionProvider'
import { getLangFromPath, navigateSard } from '@/lib/sardNavigation'

const ACCENT = '#871D3F'
const EPS = 0.5

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
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

// ====== clamp cam within bounds ======
function clampCam({ x, y }, vw, vh, imgW, imgH) {
  let nextX = x
  let nextY = y

  // X
  if (imgW <= vw + EPS) nextX = (vw - imgW) / 2
  else nextX = clamp(nextX, vw - imgW, 0)

  // Y
  if (imgH <= vh + EPS) nextY = (vh - imgH) / 2
  else nextY = clamp(nextY, vh - imgH, 0)

  return { x: nextX, y: nextY }
}

function canPan(vw, vh, imgW, imgH) {
  return imgW > vw + EPS || imgH > vh + EPS
}

function pickCanvasWidth(scene, vw) {
  const lg = Number(scene?.canvasWidthLg || 1600)
  const md = Number(scene?.canvasWidthMd || 1400)
  const sm = Number(scene?.canvasWidthSm || 1100)

  // breakpoints
  if (vw >= 1024) return lg
  if (vw >= 768) return md
  return sm
}

export default function SceneHome({ scene, hotspots }) {
  const router = useRouter()
  const pathnameRaw = usePathname() || '/'
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

  // ===== viewport + image sizing =====
  const viewportRef = useRef(null)

  const [viewport, setViewport] = useState({ vw: 0, vh: 0 })
  const [imgNatural, setImgNatural] = useState({ w: 1600, h: 900 })
  const [canvasSize, setCanvasSize] = useState({ w: 1600, h: 900 })

  // cam in screen px
  const [cam, setCam] = useState({ x: 0, y: 0 })
  const camRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    camRef.current = cam
  }, [cam])

  // mobile toggle (note: switching to xMobile/yMobile will cause jumps between breakpoints)
  const [isMobile, setIsMobile] = useState(false)

  // tooltip hover
  const [hoveredId, setHoveredId] = useState(null)

  // ===== inertia refs =====
  const draggingRef = useRef(false)
  const pointerIdRef = useRef(null)
  const lastRef = useRef({ x: 0, y: 0, t: 0 })
  const velRef = useRef({ vx: 0, vy: 0 }) // px/ms
  const rafRef = useRef(null)

  const stopInertia = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  const startInertia = () => {
    stopInertia()
    const frictionPer16ms = 0.92 // smaller = more braking
    const minVel = 0.02 // px/ms

    let lastT = performance.now()

    const tick = (now) => {
      const dt = now - lastT
      lastT = now

      let { vx, vy } = velRef.current

      // stop condition
      if (Math.abs(vx) < minVel && Math.abs(vy) < minVel) {
        velRef.current = { vx: 0, vy: 0 }
        rafRef.current = null
        return
      }

      // apply friction (normalized to 16ms frames)
      const f = Math.pow(frictionPer16ms, dt / 16.67)
      vx *= f
      vy *= f

      const { vw, vh } = viewport
      const { w: imgW, h: imgH } = canvasSize

      setCam((c) => {
        const next = { x: c.x + vx * dt, y: c.y + vy * dt }
        const clamped = clampCam(next, vw, vh, imgW, imgH)

        // if clamped hard on an axis, kill that velocity axis (prevents “vibration” on edges)
        if (Math.abs(clamped.x - next.x) > 0.1) vx = 0
        if (Math.abs(clamped.y - next.y) > 0.1) vy = 0

        velRef.current = { vx, vy }
        return clamped
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const go = async (targetPath) => {
    const href = targetPath || '/'
    await navigateSard({
      href,
      lang,
      pathname: pathnameRaw,
      router,
      runSequence,
      timings: {
        closeMs: 750,
        logoMs: 650,
        openMs: 1250,
        fadeMs: 650,
        maxWaitMs: 8000,
      },
    })
  }

  // measure viewport
  const measure = () => {
    const el = viewportRef.current
    if (!el) return
    setViewport({ vw: el.clientWidth, vh: el.clientHeight })
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // compute canvas from CMS widths + natural aspect
  useEffect(() => {
    if (!viewport.vw) return
    const targetW = pickCanvasWidth(scene, viewport.vw)
    const aspect = imgNatural.w > 0 ? imgNatural.h / imgNatural.w : 9 / 16
    const targetH = Math.round(targetW * aspect)
    setCanvasSize({ w: targetW, h: targetH })
  }, [viewport.vw, scene, imgNatural.w, imgNatural.h])

  // center on every resize (and stop inertia)
  useEffect(() => {
    const { vw, vh } = viewport
    const { w: imgW, h: imgH } = canvasSize
    if (!vw || !vh || !imgW || !imgH) return

    stopInertia()
    velRef.current = { vx: 0, vy: 0 }

    const centered = clampCam({ x: (vw - imgW) / 2, y: (vh - imgH) / 2 }, vw, vh, imgW, imgH)
    setCam(centered)
  }, [viewport.vw, viewport.vh, canvasSize.w, canvasSize.h])

  // ===== drag events (pointer) =====
  const onPointerDown = (e) => {
    const { vw, vh } = viewport
    const { w: imgW, h: imgH } = canvasSize
    if (!canPan(vw, vh, imgW, imgH)) return

    stopInertia()
    velRef.current = { vx: 0, vy: 0 }

    draggingRef.current = true
    pointerIdRef.current = e.pointerId

    lastRef.current = { x: e.clientX, y: e.clientY, t: performance.now() }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return

    const now = performance.now()
    const dx = e.clientX - lastRef.current.x
    const dy = e.clientY - lastRef.current.y
    const dt = Math.max(1, now - lastRef.current.t)

    lastRef.current = { x: e.clientX, y: e.clientY, t: now }

    const { vw, vh } = viewport
    const { w: imgW, h: imgH } = canvasSize

    // velocity (px/ms) for inertia
    velRef.current = {
      vx: dx / dt,
      vy: dy / dt,
    }

    setCam((c) => clampCam({ x: c.x + dx, y: c.y + dy }, vw, vh, imgW, imgH))
  }

  const onPointerUp = (e) => {
    if (!draggingRef.current) return
    if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return

    draggingRef.current = false
    pointerIdRef.current = null

    // start inertia if there is velocity
    startInertia()
  }

  // ===== pan arrows state =====
  const panState = useMemo(() => {
    const { vw, vh } = viewport
    const { w: imgW, h: imgH } = canvasSize
    if (!vw || !vh) return { left: false, right: false, up: false, down: false, any: false }

    const leftHidden = imgW > vw + EPS && cam.x < -EPS
    const rightHidden = imgW > vw + EPS && cam.x > vw - imgW + EPS
    const upHidden = imgH > vh + EPS && cam.y < -EPS
    const downHidden = imgH > vh + EPS && cam.y > vh - imgH + EPS

    const any = leftHidden || rightHidden || upHidden || downHidden
    return { left: leftHidden, right: rightHidden, up: upHidden, down: downHidden, any }
  }, [viewport, canvasSize, cam.x, cam.y])

  // periodic arrow pulse
  const [hintPulseOn, setHintPulseOn] = useState(false)
  useEffect(() => {
    const t = setInterval(() => {
      setHintPulseOn(true)
      setTimeout(() => setHintPulseOn(false), 1400)
    }, 5200)
    return () => clearInterval(t)
  }, [])

  const cursor = panState.any ? (draggingRef.current ? 'grabbing' : 'grab') : 'default'

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <PageContentReveal className="absolute inset-0 bg-black">
        <div
          ref={viewportRef}
          className="absolute inset-0"
          style={{ touchAction: 'none', cursor }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Canvas (moves with cam) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: canvasSize.w,
              height: canvasSize.h,
              transform: `translate3d(${cam.x}px, ${cam.y}px, 0)`,
              transformOrigin: '0 0',
              willChange: draggingRef.current || rafRef.current ? 'transform' : 'auto',
            }}
          >
            {/* Background */}
            {bg && (
              <Image
                src={bg}
                alt={scene?.title || 'Sard scene'}
                fill
                priority
                className="object-contain object-center select-none pointer-events-none"
                onLoadingComplete={(img) => {
                  const w = img?.naturalWidth || 1600
                  const h = img?.naturalHeight || 900
                  setImgNatural({ w, h })
                }}
              />
            )}

            {/* Hotspots — IMPORTANT: absolute INSIDE CANVAS (world space) */}
            {hotspots?.map((spot, index) => {
              const xPct = isMobile && spot.xMobile != null ? spot.xMobile : spot.x
              const yPct = isMobile && spot.yMobile != null ? spot.yMobile : spot.y

              const wx = (Number(xPct) / 100) * canvasSize.w
              const wy = (Number(yPct) / 100) * canvasSize.h

              const isActive = hoveredId === spot.id
              const pulseDelay = (index % 5) * 0.6

              const handleHotspotPointerDown = (e) => {
                // يمنع map-drag لما تمسك الهوتسبوت
                e.stopPropagation()
              }

              const handleHotspotClick = (e) => {
                e.stopPropagation()
                if (isMobile) {
                  setHoveredId((prev) => (prev === spot.id ? null : spot.id))
                } else {
                  go(spot.targetPath || '/')
                }
              }

              return (
                <div
                  key={spot.id}
                  style={{
                    position: 'absolute',
                    left: wx,
                    top: wy,
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
                      onPointerDown={handleHotspotPointerDown}
                      className="relative flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm"
                      style={{
                        background: 'rgba(135, 29, 63, 0.08)',
                        border: `1px solid rgba(135, 29, 63, 0.85)`,
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleHotspotClick}
                    >
                      <motion.span
                        className="pointer-events-none absolute inset-[-6px] rounded-full border-2 mix-blend-screen"
                        style={{
                          borderColor: 'rgba(135, 29, 63, 0.85)',
                          boxShadow: '0 0 18px rgba(135, 29, 63, 0.55)',
                        }}
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

                      <span
                        className="block h-2 w-2 rounded-full"
                        style={{
                          background: ACCENT,
                          boxShadow: '0 0 10px rgba(135, 29, 63, 0.85)',
                        }}
                      />
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
                            className="pointer-events-auto rounded-full px-3 py-1 text-[11px] leading-tight text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                            style={{
                              background: 'rgba(135, 29, 63, 0.88)',
                              border: '1px solid rgba(255,255,255,0.16)',
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation()
                              go(spot.targetPath || '/')
                            }}
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
          </div>

          {/* Hint text */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/80">
            {hint}
          </div>

          {/* Elegant pan arrows */}
          <AnimatePresence>
            {panState.any && hintPulseOn && (
              <>
                {panState.left && (
                  <motion.div
                    className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 0.9, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.35 }}
                    style={{ color: ACCENT }}
                  >
                    <Arrow dir="left" />
                  </motion.div>
                )}

                {panState.right && (
                  <motion.div
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 0.9, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.35 }}
                    style={{ color: ACCENT }}
                  >
                    <Arrow dir="right" />
                  </motion.div>
                )}

                {panState.up && (
                  <motion.div
                    className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.9, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.35 }}
                    style={{ color: ACCENT }}
                  >
                    <Arrow dir="up" />
                  </motion.div>
                )}

                {panState.down && (
                  <motion.div
                    className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 0.9, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    style={{ color: ACCENT }}
                  >
                    <Arrow dir="down" />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </PageContentReveal>
    </div>
  )
}

function Arrow({ dir = 'left' }) {
  const rot =
    dir === 'left'
      ? 'rotate(180deg)'
      : dir === 'up'
        ? 'rotate(-90deg)'
        : dir === 'down'
          ? 'rotate(90deg)'
          : 'none'

  return (
    <div
      style={{
        transform: rot,
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 999,
        background: 'rgba(0,0,0,0.28)',
        border: '1px solid rgba(135, 29, 63, 0.35)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

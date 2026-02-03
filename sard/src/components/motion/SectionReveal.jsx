'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

const EASE = [0.19, 1, 0.22, 1]

const VARIANTS = {
  // Cinematic defaults
  fadeUp: {
    hidden: { opacity: 0, y: 30, filter: 'blur(7px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  centerZoom: {
    hidden: { opacity: 0, scale: 0.92, filter: 'blur(10px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  },

  // Directional slides (useful for split layouts)
  slideLeft: {
    hidden: { opacity: 0, x: 36, filter: 'blur(8px)' },
    show: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  slideRight: {
    hidden: { opacity: 0, x: -36, filter: 'blur(8px)' },
    show: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  slideDown: {
    hidden: { opacity: 0, y: -28, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },

  // Reveal masks
  wipeLTR: {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
  },
  wipeRTL: {
    hidden: { opacity: 0, clipPath: 'inset(0 0 0 100%)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0 0)' },
  },
  wipeUp: {
    hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0 0)' },
  },
  wipeDown: {
    hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0 0)' },
  },

  // Subtle “film” feeling (great for headers)
  softRise: {
    hidden: { opacity: 0, y: 18, scale: 0.995, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },

  // Blur-only (لو عندك layout حساس مش عايز y/x)
  blurFade: {
    hidden: { opacity: 0, filter: 'blur(14px)' },
    show: { opacity: 1, filter: 'blur(0px)' },
  },

  // For sections that need to feel “snappy”
  pop: {
    hidden: { opacity: 0, scale: 0.97 },
    show: { opacity: 1, scale: 1 },
  },

  // Flip + scale (inView)
  flipScale: {
    hidden: {
      opacity: 0,
      scale: 0.92,
      y: 18,
      rotateX: -12,
      filter: 'blur(10px)',
    },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
    },
  },
}

/**
 * ✅ Scroll-linked effect (زي الفيديو):
 * - وهو داخل من تحت: صغير ويكبر تدريجيًا
 * - في النص: 1.0
 * - وهو خارج لفوق: يبدأ يصغر تدريجيًا قبل ما يختفي
 */
function ScrollFlipReveal({
  children,
  className,
  // knobs
  perspective = 1200,
  origin = '50% 65%',
  scaleMin = 0.92,
  scaleNear = 0.98,
  yOffset = 22,
  rot = 10,
}) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [scaleMin, scaleNear, 1, scaleNear, scaleMin],
  )

  const rawOpacity = useTransform(scrollYProgress, [0, 0.12, 0.5, 0.88, 1], [0, 1, 1, 1, 0])

  const rawRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-rot, 0, rot])
  const rawY = useTransform(scrollYProgress, [0, 0.5, 1], [yOffset, 0, -yOffset])

  const scale = useSpring(rawScale, { stiffness: 220, damping: 30, mass: 0.6 })
  const opacity = useSpring(rawOpacity, { stiffness: 220, damping: 30, mass: 0.6 })
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 30, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 220, damping: 30, mass: 0.6 })

  return (
    <motion.div
      ref={ref}
      className={`${className ?? ''} overflow-x-hidden`}
      style={{
        opacity,
        scale,
        rotateX,
        y,
        transformPerspective: perspective,
        transformOrigin: origin,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  )
}

export default function SectionReveal({
  children,
  className,
  variant = 'fadeUp',
  duration = 0.7,
  delay = 0,

  // inView options
  once = true,
  amount = 0.12,
  margin = '0px 0px 10% 0px',
}) {
  const reduce = useReducedMotion()

  // ✅ Reduce motion: no animations
  if (reduce) return <div className={className}>{children}</div>

  // ✅ Scroll-linked variant
  if (variant === 'scrollFlip') {
    return <ScrollFlipReveal className={className}>{children}</ScrollFlipReveal>
  }
  if (variant === 'scrollStack') {
    return <ScrollStackReveal className={className}>{children}</ScrollStackReveal>
  }

  // ✅ Normal inView variants
  const v = VARIANTS[variant] || VARIANTS.fadeUp
  const needs3D = variant === 'flipScale'

  return (
    <motion.div
      className={`${className ?? ''}`}
      style={needs3D ? { transformPerspective: 1200, transformOrigin: '50% 65%' } : undefined}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin }}
      transition={{ ease: EASE, duration, delay }}
    >
      {children}
    </motion.div>
  )
}
function ScrollStackReveal({
  children,
  className,

  // controls
  perspective = 1200,
  origin = '50% 60%',

  // feel like video: exit snaps, enter smooth
  inScaleFrom = 0.92,
  outScaleTo = 0.86,

  inYFrom = 26,
  outYTo = -18,

  inRotate = -8,
  outRotate = 10,

  // how "fast" exit happens vs enter
  exitStart = 0.58, // بعد النص يبدأ يطلع بسرعة
  exitEnd = 0.78, // عندها يكون "طلع" تقريبًا
}) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // دخول ناعم: 0 -> 0.55
  const scaleIn = useTransform(scrollYProgress, [0, 0.55], [inScaleFrom, 1])
  const yIn = useTransform(scrollYProgress, [0, 0.55], [inYFrom, 0])
  const rIn = useTransform(scrollYProgress, [0, 0.55], [inRotate, 0])
  const oIn = useTransform(scrollYProgress, [0, 0.18], [0, 1])

  // خروج أسرع (snap): exitStart -> exitEnd
  const scaleOut = useTransform(
    scrollYProgress,
    [exitStart, exitEnd, 1],
    [1, outScaleTo, outScaleTo],
  )
  const yOut = useTransform(scrollYProgress, [exitStart, exitEnd, 1], [0, outYTo, outYTo])
  const rOut = useTransform(scrollYProgress, [exitStart, exitEnd, 1], [0, outRotate, outRotate])
  const oOut = useTransform(scrollYProgress, [exitStart, 1], [1, 0])

  // combine (Framer: values are MotionValues)
  // هنا بنستخدم transform تاني يختار بين in/out حسب progress
  const scale = useTransform(scrollYProgress, (p) =>
    p < exitStart ? scaleIn.get() : scaleOut.get(),
  )
  const y = useTransform(scrollYProgress, (p) => (p < exitStart ? yIn.get() : yOut.get()))
  const rotateX = useTransform(scrollYProgress, (p) => (p < exitStart ? rIn.get() : rOut.get()))
  const opacity = useTransform(scrollYProgress, (p) => (p < exitStart ? oIn.get() : oOut.get()))

  return (
    <motion.div
      ref={ref}
      className={`${className ?? ''} overflow-x-hidden`}
      style={{
        opacity,
        scale,
        rotateX,
        y,
        transformPerspective: perspective,
        transformOrigin: origin,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  )
}

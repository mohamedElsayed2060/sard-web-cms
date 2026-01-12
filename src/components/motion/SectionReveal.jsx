'use client'

import { motion, useReducedMotion } from 'framer-motion'

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
}

export default function SectionReveal({
  children,
  className,
  variant = 'fadeUp',
  duration = 0.7,
  delay = 0,
  // scroll options
  once = true,
  amount = 0.12,
  margin = '0px 0px 10% 0px',
}) {
  const reduce = useReducedMotion()
  const v = VARIANTS[variant] || VARIANTS.fadeUp

  return (
    <motion.div
      className={`${className} overflow-x-hidden`}
      variants={reduce ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : v}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin }}
      transition={{ ease: EASE, duration, delay }}
    >
      {children}
    </motion.div>
  )
}

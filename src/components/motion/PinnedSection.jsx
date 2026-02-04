'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export default function PinnedSection({
  children,
  className = '',
  holdStart = 0.18,
  holdEnd = 0.72,

  scaleIn = 0.92,
  scaleOut = 0.86,
  yIn = 26,
  yOut = -18,
  rotIn = -8,
  rotOut = 10,

  track = '220vh',
}) {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, holdStart, holdEnd, 1], [scaleIn, 1, 1, scaleOut])

  const y = useTransform(scrollYProgress, [0, holdStart, holdEnd, 1], [yIn, 0, 0, yOut])

  const rotateX = useTransform(scrollYProgress, [0, holdStart, holdEnd, 1], [rotIn, 0, 0, rotOut])

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.08, holdStart, holdEnd, 0.92, 1],
    [0, 1, 1, 1, 1, 0],
  )

  if (reduce) {
    return <section className={className}>{children}</section>
  }

  return (
    <section ref={wrapRef} style={{ height: track }}>
      <div className="sticky top-0 h-[100dvh] flex items-center justify-center">
        <motion.div
          className={className}
          style={{
            opacity,
            scale,
            y,
            rotateX,
            transformPerspective: 1200,
            transformOrigin: '50% 60%',
            willChange: 'transform, opacity',
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}

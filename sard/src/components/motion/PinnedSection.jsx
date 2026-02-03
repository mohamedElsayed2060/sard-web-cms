'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export default function PinnedSection({
  children,
  className = '',
  // قد إيه “يمسك” قبل ما يبدأ يتحرك
  holdStart = 0.18,
  holdEnd = 0.72,

  // الحركة (زي الفيديو)
  scaleIn = 0.92,
  scaleOut = 0.86,
  yIn = 26,
  yOut = -18,
  rotIn = -8,
  rotOut = 10,

  // طول “مسار” السيكشن (كل ما زوّدته، مسك أكتر)
  track = '220vh', // جرّب 200vh لو عايز أسرع
}) {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)

  // progress من 0->1 وإنت بتسحب على “مسار” السيكشن
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
  })

  // ✅ Plateau: في النص ثابت (1 / 0 / 0)
  const scale = useTransform(scrollYProgress, [0, holdStart, holdEnd, 1], [scaleIn, 1, 1, scaleOut])

  const y = useTransform(scrollYProgress, [0, holdStart, holdEnd, 1], [yIn, 0, 0, yOut])

  const rotateX = useTransform(scrollYProgress, [0, holdStart, holdEnd, 1], [rotIn, 0, 0, rotOut])

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.08, holdStart, holdEnd, 0.92, 1],
    [0, 1, 1, 1, 1, 0],
  )

  if (reduce) {
    // بدون أنيميشن على reduce motion
    return <section className={className}>{children}</section>
  }

  return (
    // Wrapper طويل عشان يديك “مسك”
    <section ref={wrapRef} style={{ height: track }}>
      {/* Sticky container: يمسك الشاشة */}
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

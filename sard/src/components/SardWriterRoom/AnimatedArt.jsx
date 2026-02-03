'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.19, 1, 0.22, 1]

export default function AnimatedArt({ src, alt, anim = 'float', isActive = false }) {
  // ✅ الحركة الأساسية لما تكون الأيقونة هي الـ active
  const activeAnim =
    anim === 'clapper'
      ? { rotate: [0, -6, 0, -3, 0], y: [0, -2, 0] }
      : anim === 'pen'
        ? { x: [0, 10, 0], rotate: [0, 2, 0] }
        : anim === 'sparkle'
          ? { scale: [1, 1.08, 1] }
          : { y: [0, -7, 0] } // float default

  // ✅ hover لطيف (اختياري)
  const hoverAnim = anim === 'sparkle' ? { scale: 1.06 } : { y: -3, scale: 1.01 }

  return (
    <motion.div
      className="relative w-[92px] md:w-[110px] h-[92px] md:h-[110px]"
      // hover
      whileHover={hoverAnim}
      transition={{ duration: 0.45, ease: EASE }}
      // ✅ تشغيل الحركة فقط لما isActive true
      animate={isActive ? activeAnim : { x: 0, y: 0, rotate: 0, scale: 1 }}
      // مدة الحركة لما تكون active (wave)
      {...(isActive ? { transition: { duration: 0.95, ease: EASE } } : {})}
    >
      <Image src={src} alt={alt} fill className="object-contain" sizes="110px" />
    </motion.div>
  )
}

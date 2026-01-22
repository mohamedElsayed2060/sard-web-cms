'use client'

import { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useTransitionUI } from './TransitionProvider'

export default function TransitionBridge() {
  const pathname = usePathname()
  const { setCurrentPath } = useTransitionUI()

  // ✅ normalize بسيطة (اختياري) عشان نخلي المقارنة ثابتة
  const clean = useMemo(() => {
    if (!pathname) return '/'
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  }, [pathname])

  useEffect(() => {
    setCurrentPath?.(clean)
  }, [clean, setCurrentPath])

  return null
}

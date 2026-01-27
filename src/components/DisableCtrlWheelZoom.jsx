'use client'

import { useEffect } from 'react'

export default function DisableCtrlWheelZoom() {
  useEffect(() => {
    const onWheel = (e) => {
      // Ctrl + Wheel (Windows/Linux) / Cmd + trackpad zoom أحيانًا
      if (e.ctrlKey || e.metaKey) e.preventDefault()
    }

    const onKeyDown = (e) => {
      const isZoomModifier = e.ctrlKey || e.metaKey
      if (!isZoomModifier) return

      // بعض المتصفحات بتبعت '=' بدل '+'
      const key = e.key

      const isZoomIn = key === '+' || key === '='
      const isZoomOut = key === '-'
      const isZoomReset = key === '0'

      if (isZoomIn || isZoomOut || isZoomReset) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel, { passive: false })
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}

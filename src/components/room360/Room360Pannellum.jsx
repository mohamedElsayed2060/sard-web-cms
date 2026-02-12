'use client'

import { useEffect, useRef } from 'react'
import 'pannellum/build/pannellum.css'

export default function Room360Pannellum({
  src = '/demo/room-360.jpg',
  heightClass = 'h-[520px] md:h-[640px]',
}) {
  const elRef = useRef(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!elRef.current) return

      // destroy previous instance (if any)
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy()
        } catch {}
        viewerRef.current = null
      }

      // ✅ load pannellum JS only on client (avoids "window is not defined")
      await import('pannellum/build/pannellum.js')

      if (cancelled) return

      // pannellum attaches itself to window
      const pannellum = window.pannellum
      if (!pannellum?.viewer) {
        console.error('Pannellum failed to load (window.pannellum.viewer not found)')
        return
      }

      viewerRef.current = pannellum.viewer(elRef.current, {
        type: 'equirectangular',
        panorama: src,
        autoLoad: true,
        showZoomCtrl: true,
        showFullscreenCtrl: true,

        // زاوية أوسع = إحساس أوضح (أقل زووم)
        hfov: 95,
        minHfov: 40,
        maxHfov: 120,

        yaw: 0,
        pitch: 0,
      })
    }

    init()

    return () => {
      cancelled = true
      try {
        viewerRef.current?.destroy()
      } catch {}
      viewerRef.current = null
    }
  }, [src])

  return (
    <div
      className={`w-full ${heightClass} rounded-[22px] overflow-hidden border border-black/10 bg-black/10`}
    >
      <div ref={elRef} className="w-full h-full" />
    </div>
  )
}

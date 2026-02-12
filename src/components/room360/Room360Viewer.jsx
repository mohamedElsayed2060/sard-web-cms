'use client'

import { useEffect, useRef } from 'react'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'

import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/markers-plugin/index.css'

export default function Room360Viewer({
  src = '/demo/room-360.jpg',
  heightClass = 'h-[520px] md:h-[640px]',
}) {
  const elRef = useRef(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    if (!elRef.current) return

    viewerRef.current = new Viewer({
      container: elRef.current,
      panorama: src,
      navbar: ['zoom', 'fullscreen'],
      mousewheel: true,
      plugins: [
        [
          MarkersPlugin,
          {
            markers: [
              {
                id: 'tv',
                position: { yaw: 0.8, pitch: -0.05 },
                html: `<div style="
                  background: rgba(0,0,0,.65);
                  color: #fff;
                  padding: 8px 12px;
                  border-radius: 999px;
                  font-size: 11px;
                  letter-spacing: .22em;
                  text-transform: uppercase;
                  border: 1px solid rgba(255,255,255,.15);
                  backdrop-filter: blur(6px);
                  ">TV AREA</div>`,
                anchor: 'center center',
                tooltip: { content: 'TV Area', position: 'top' },
              },
              {
                id: 'meeting',
                position: { yaw: -1.4, pitch: -0.12 },
                html: `<div style="background: rgba(0,0,0,.65); color:#fff; padding:8px 12px; border-radius:999px; font-size:11px; letter-spacing:.22em; text-transform:uppercase; border:1px solid rgba(255,255,255,.15); backdrop-filter: blur(6px);">MEETING</div>`,
                anchor: 'center center',
                tooltip: 'Meeting Table',
              },
            ],
          },
        ],
      ],
    })
    // ✅ DEBUG: click anywhere to get yaw/pitch
    const viewer = viewerRef.current

    const handleClick = (e) => {
      // PSV غالبًا بيرجع yaw/pitch جوه e.data
      const yaw = e?.data?.yaw
      const pitch = e?.data?.pitch

      if (typeof yaw !== 'number' || typeof pitch !== 'number') return

      const payload = {
        yaw: +yaw.toFixed(4),
        pitch: +pitch.toFixed(4),
      }

      console.log('📍 HOTSPOT COORDS:', payload)

      // (اختياري) Copy to clipboard عشان تلزقها في الـ CMS بسرعة
      try {
        navigator.clipboard.writeText(JSON.stringify(payload))
      } catch {}
    }

    // بعض الإصدارات event اسمه click
    viewer.addEventListener('click', handleClick)

    // cleanup
    return () => {
      try {
        viewer.removeEventListener('click', handleClick)
      } catch {}
      viewer.destroy()
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

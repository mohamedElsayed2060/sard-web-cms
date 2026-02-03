// src/components/shared/SmartImage.jsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function SmartImage({ className = '', ...props }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative overflow-hidden">
      {/* Blur/Skeleton layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(18px)',
        }}
      />

      <Image
        {...props}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  )
}

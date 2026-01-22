'use client'

import { useEffect, useState } from 'react'

export default function useDocumentDir(fallback = 'ltr') {
  const [dir, setDir] = useState(fallback)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const read = () => document.documentElement.getAttribute('dir') || fallback
    setDir(read())

    // لو الـ dir اتغير (مثلاً تنقل بين /en و /ar بدون reload كامل)
    const obs = new MutationObserver(() => setDir(read()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })

    return () => obs.disconnect()
  }, [fallback])

  return dir
}

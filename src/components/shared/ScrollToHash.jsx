'use client'

import { useEffect } from 'react'

export default function ScrollToHash({ enabled = true, offset = 0 }) {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const hash = window.location.hash || ''
    if (!hash) return

    const id = hash.replace('#', '').trim()
    if (!id) return

    let tries = 0
    const maxTries = 18

    const tryScroll = () => {
      tries += 1
      const el = document.getElementById(id)

      if (el) {
        const rect = el.getBoundingClientRect()
        const y = window.scrollY + rect.top - Number(offset || 0)
        window.scrollTo({ top: y, behavior: 'smooth' })
        return
      }

      if (tries < maxTries) {
        setTimeout(tryScroll, 120)
      }
    }

    // start after paint
    setTimeout(tryScroll, 60)
  }, [enabled, offset])

  return null
}

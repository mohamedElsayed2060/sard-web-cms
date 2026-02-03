'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { useTransitionUI } from './TransitionProvider'
import {
  isExternalHref,
  isHashOnly,
  getLangFromPath,
  navigateSard,
  normalizePathname,
} from '@/lib/sardNavigation'

export default function TransitionLink({ href, children, timings, onClick, ...props }) {
  const router = useRouter()
  const pathnameRaw = usePathname() || '/'
  const pathname = normalizePathname(pathnameRaw)
  const lang = useMemo(() => getLangFromPath(pathnameRaw), [pathnameRaw])
  const { runSequence } = useTransitionUI()

  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return

        // ✅ allow new tab / modified clicks / middle click
        if (e.button !== 0) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        if (props?.target === '_blank') return

        const isHrefString = typeof href === 'string'
        const raw = isHrefString ? href : href?.pathname || href?.href || ''

        // ✅ external/hash => سيبه طبيعي
        if (isHrefString && (isExternalHref(raw) || isHashOnly(raw))) return

        // ✅ same page guard (normalize target)
        const targetPath = normalizePathname(
          isHrefString ? raw : href?.pathname || href?.href || '',
        )
        if (targetPath === pathname) return

        e.preventDefault()

        // ✅ unified nav (doors/stack) + lang prefix handled inside navigateSard
        navigateSard({
          href,
          lang,
          pathname: pathnameRaw,
          router,
          runSequence,
          timings,
        })
      }}
    >
      {children}
    </Link>
  )
}

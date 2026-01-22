// src/components/shared/LanguageSwitch.jsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function swapLangPath(pathname) {
  // pathname مثال: /en/about-sard
  // أو: /ar/sard-production
  const parts = (pathname || '/').split('/')
  const current = parts[1]
  const next = current === 'ar' ? 'en' : 'ar'

  // لو مفيش lang أصلاً
  if (current !== 'en' && current !== 'ar') {
    return `/${next}${pathname}`
  }

  parts[1] = next
  return parts.join('/') || `/${next}`
}

export default function LanguageSwitch({ className = '' }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isAR = pathname?.startsWith('/ar')
  const nextLang = isAR ? 'en' : 'ar'
  const label = isAR ? 'EN' : 'AR'

  const nextPath = swapLangPath(pathname)
  const qs = searchParams?.toString()
  const href = qs ? `${nextPath}?${qs}` : nextPath

  return (
    <Link
      href={href}
      className={
        'inline-flex items-center justify-center rounded-full border border-[#871D3F]/15 px-3 py-1.5 text-xs font-semibold tracking-wider text-[#871D3F]/90 hover:bg-[white]/10 transition ' +
        className
      }
      aria-label={`Switch language to ${nextLang.toUpperCase()}`}
      prefetch={false}
    >
      {label}
    </Link>
  )
}

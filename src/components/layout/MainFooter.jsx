'use client'

import { useEffect, useMemo } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import PageContentReveal from '../PageContentReveal'
import { imgUrl } from '@/lib/cms'
import TransitionLink from '../transition/TransitionLink'
import { useTransitionUI } from '../transition/TransitionProvider'
import useDocumentDir from '@/components/shared/useDocumentDir'

const SUPPORTED_LANGS = ['en', 'ar']

const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const pick = (en, ar, lang) => (lang === 'ar' ? ar || en || '' : en || ar || '')

const pickUpload = (enFile, arFile, lang) => {
  const chosen = lang === 'ar' ? arFile || enFile : enFile || arFile
  return chosen ? imgUrl(chosen) : null
}

export default function MainFooter({ footer, bgImage }) {
  const pathname = usePathname()
  const { ui } = useTransitionUI()

  const lang = getLangFromPath(pathname || '')
  const dir = useDocumentDir(lang === 'ar' ? 'rtl' : 'ltr')

  // ✅ نفس منطق الهيدر: يظهر من opening (مش يستنى idle)
  const phase = ui?.phase || 'idle'
  const showFooter = phase === 'opening' || phase === 'fading' || phase === 'idle'

  useEffect(() => {}, [pathname])

  const links = footer?.links || []

  const leftLogoSrc = pickUpload(footer?.logoLeftEn, footer?.logoLeftAr, lang)
  const rightLogoSrc = pickUpload(footer?.logoRightEn, footer?.logoRightAr, lang)

  const leftAlt = pick(footer?.logoLeftAltEn, footer?.logoLeftAltAr, lang) || 'Sard'
  const rightAlt = pick(footer?.logoRightAltEn, footer?.logoRightAltAr, lang) || 'Sard icon'

  const copyright = pick(footer?.copyrightEn, footer?.copyrightAr, lang) || 'Copyright © 2025'

  const navJustify = dir === 'rtl' ? 'justify-center' : 'justify-center'
  const navTextAlign = dir === 'rtl' ? 'text-right' : 'text-left'

  const normalizedLinks = useMemo(() => {
    return links.map((link) => ({
      id: link?.id || link?.href,
      href: link?.href || '#',
      label: pick(link?.labelEn, link?.labelAr, lang),
    }))
  }, [links, lang])

  return (
    <footer
      key={pathname}
      dir={dir}
      className={[
        'bg-black pt-5 px-3 pb-5 max-w-[1490px] mx-auto',
        showFooter ? '' : 'pointer-events-none opacity-0',
      ].join(' ')}
      style={{ transition: 'none' }}
    >
      <PageContentReveal
        variant="slideUp"
        paperColor="#F4E8D7"
        className="rounded-[24px] px-6 md:px-18 py-10 space-y-8"
        bgImage={bgImage}
      >
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {leftLogoSrc ? (
              <TransitionLink href={`/${lang}`} aria-label="Sard Home">
                <Image
                  src={leftLogoSrc}
                  alt={leftAlt}
                  width={160}
                  height={44}
                  className="h-9 w-auto md:h-10 object-contain"
                />
              </TransitionLink>
            ) : (
              <div className="h-4 w-20 rounded-full bg-black/80" />
            )}
          </div>

          <div className="flex items-center">
            {rightLogoSrc ? (
              <Image
                src={rightLogoSrc}
                alt={rightAlt}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                <span className="h-3 w-3 rounded-full border border-[#F4E8D7]" />
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <nav
          className={`flex flex-wrap ${navJustify} gap-6 text-sm text-[#252525] font-bold ${navTextAlign}`}
        >
          {normalizedLinks.map((link) => (
            <div className="md:w-auto w-full" key={link.id}>
              <TransitionLink href={link.href}>{link.label}</TransitionLink>
            </div>
          ))}
        </nav>

        <div className="h-px w-full bg-black/20 m-0 mb-8" />

        {/* Copyright */}
        <div className="flex items-center justify-center text-xs text-[#252525] font-bold">
          <span>{copyright}</span>
        </div>
      </PageContentReveal>
    </footer>
  )
}

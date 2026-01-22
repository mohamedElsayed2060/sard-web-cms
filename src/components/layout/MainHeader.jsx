// src/components/layout/MainHeader.jsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

import PageContentReveal from '../PageContentReveal'
import { imgUrl } from '@/lib/cms'
import TransitionLink from '../transition/TransitionLink'
import { useTransitionUI } from '../transition/TransitionProvider'
import LanguageSwitch from '@/components/shared/LanguageSwitch'

const EASE = [0.19, 1, 0.22, 1]

// ====== i18n helpers (App Router [lang]) ======
const SUPPORTED_LANGS = ['en', 'ar']

const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const pick = (obj, lang = 'en') => {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj?.[lang] ?? obj?.en ?? ''
}

const withLangHref = (href = '/', lang = 'en') => {
  if (!href) href = '/'
  if (!href.startsWith('/')) href = '/' + href

  const seg = href.split('/')[1]
  if (SUPPORTED_LANGS.includes(seg)) return href

  return `/${lang}${href === '/' ? '' : href}`
}

export default function MainHeader({ header, bgImage }) {
  const pathname = usePathname()
  const { ui } = useTransitionUI()

  const [menuOpen, setMenuOpen] = useState(false)
  const lang = useMemo(() => getLangFromPath(pathname), [pathname])

  // close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const logoLargeSrc = header?.logoLarge ? imgUrl(header.logoLarge) : null
  const logoSmallSrc = header?.logoSmall ? imgUrl(header.logoSmall) : null

  const logoLargeAlt = header?.logoLargeAlt || 'Sard'
  const logoSmallAlt = header?.logoSmallAlt || 'Menu'
  const socialLinks = header?.social || []

  const navLinksRaw = header?.links || []
  const navLinks = navLinksRaw.map((l) => ({
    ...l,
    labelText: pick(l.label, lang),
    hrefWithLang: withLangHref(l.href || '/', lang),
  }))

  const toggleMenu = () => setMenuOpen((v) => !v)
  const closeMenu = () => setMenuOpen(false)

  const phase = ui?.phase || 'idle'
  const showHeader = phase === 'opening' || phase === 'fading' || phase === 'idle'

  return (
    <>
      {/* ✅ الهيدر نفسه بدون أي motion/transition — لكن لسه بنخفيه فورياً أثناء closing/logo */}
      <section
        className={[
          'bg-black pt-5 px-3 max-w-[1490px] mx-auto relative z-30',
          showHeader ? '' : 'pointer-events-none opacity-0',
        ].join(' ')}
        style={{ transition: 'none' }}
      >
        <PageContentReveal
          paperColor="#F4E8D7"
          className="rounded-[24px] px-3 py-5 md:px-18 md:py-6"
          bgImage={bgImage}
        >
          <div
            className="flex items-center justify-between gap-6 relative"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-3">
              {logoLargeSrc ? (
                <TransitionLink href={withLangHref('/', lang)} aria-label="Sard Home">
                  <Image
                    src={logoLargeSrc}
                    alt={logoLargeAlt}
                    width={180}
                    height={48}
                    className="h-8 w-auto md:h-10 object-contain"
                    priority
                  />
                </TransitionLink>
              ) : (
                <div className="h-6 w-20 rounded-full bg-black/80" />
              )}
            </div>

            <div className="relative flex items-center">
              <LanguageSwitch className="me-3" />

              <motion.button
                type="button"
                onClick={toggleMenu}
                whileTap={{ scale: 0.94 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full cursor-pointer text-[#F4E8D7] overflow-hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {logoSmallSrc ? (
                  <Image
                    src={logoSmallSrc}
                    alt={logoSmallAlt}
                    width={32}
                    height={32}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#F4E8D7]/5"
                      animate={
                        menuOpen
                          ? { opacity: 0.2, scale: 1.08 }
                          : { opacity: [0.05, 0.3, 0.05], scale: [1, 1.08, 1] }
                      }
                      transition={{
                        duration: menuOpen ? 0.25 : 2,
                        repeat: menuOpen ? 0 : Infinity,
                      }}
                    />
                    <motion.span
                      className="relative h-4 w-4 rounded-full border border-[#F4E8D7]"
                      animate={menuOpen ? { scale: 0.7, opacity: 0.8 } : {}}
                    />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </PageContentReveal>
      </section>

      <HeaderMenuOverlay
        open={menuOpen}
        onClose={closeMenu}
        navLinks={navLinks}
        socialLinks={socialLinks}
        logoLargeSrc={logoLargeSrc}
        logoLargeAlt={logoLargeAlt}
        lang={lang}
        bgImage={bgImage}
      />
    </>
  )
}

function HeaderMenuOverlay({
  open,
  onClose,
  navLinks,
  socialLinks = [],
  logoLargeSrc,
  logoLargeAlt,
  lang = 'en',
  bgImage,
}) {
  const pathname = usePathname()
  const reduce = useReducedMotion()

  const normalizePath = (p = '') => {
    const clean = p.split('?')[0].split('#')[0]
    const withSlash = clean.startsWith('/') ? clean : '/' + clean
    return withSlash !== '/' ? withSlash.replace(/\/+$/, '') : '/'
  }

  const isActiveHref = (href) => {
    if (!href || href === '#') return false
    const target = normalizePath(href)
    const current = normalizePath(pathname)
    return current === target || current.startsWith(target + '/')
  }

  // overlay slide-down + fade
  const panelVariants = reduce
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 1, y: 0 } }
    : {
        hidden: { y: '-105%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.75, ease: EASE } },
        exit: { y: '-105%', opacity: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } },
      }

  // stacked cards geometry
  const MENU_CARD_H = 92
  const PEEK = 64
  const OFFSET = MENU_CARD_H - PEEK - 8
  const minCardH = MENU_CARD_H

  // Cards “appear from below” one after another
  const CARDS_START_AT = 0.35

  const listVariants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: {
          transition: {
            delayChildren: CARDS_START_AT,
            staggerChildren: 0.09,
            staggerDirection: 1,
          },
        },
      }

  const itemVariants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 8, filter: 'blur(2px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0,
          y: 10,
          filter: 'blur(2px)',
          transition: { duration: 0.22, ease: [0.65, 0, 0.35, 1] },
        },
      }

  // lock body scroll when open
  useEffect(() => {
    if (!open) return

    const body = document.body
    const html = document.documentElement

    const prevBodyOverflow = body.style.overflow
    const prevBodyPaddingRight = body.style.paddingRight
    const prevHtmlOverflow = html.style.overflow

    const scrollbarW = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`

    return () => {
      body.style.overflow = prevBodyOverflow
      body.style.paddingRight = prevBodyPaddingRight
      html.style.overflow = prevHtmlOverflow
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40">
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            exit={reduce ? {} : { opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          />

          {/* panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 text-black pt-0"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundImage: `url('${bgImage.src}')` }}
          >
            {/* hide scrollbar globally for this overlay list */}
            <style jsx global>{`
              .sard-menu-scroll {
                scrollbar-width: none;
                -ms-overflow-style: none;
                scrollbar-gutter: stable;
              }
              .sard-menu-scroll::-webkit-scrollbar {
                width: 0px;
                height: 0px;
              }
            `}</style>

            <div
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="mx-auto flex h-full max-w-[1490px] flex-col px-3 md:px-0"
            >
              <div className="pt-5 flex-1 min-h-0">
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="sard-menu-scroll h-full min-h-0 pb-5 flex flex-col overflow-y-scroll overscroll-contain"
                >
                  {/* Header Card */}
                  <motion.li
                    variants={itemVariants}
                    className="relative w-full flex-1 mb-3"
                    style={{ zIndex: 1, minHeight: minCardH }}
                  >
                    <div
                      className="h-full flex items-center justify-between md:px-10 px-6 rounded-[22px] border border-black/10"
                      style={{ minHeight: minCardH, backgroundImage: `url('${bgImage.src}')` }}
                    >
                      {logoLargeSrc && (
                        <Image
                          src={logoLargeSrc}
                          alt={logoLargeAlt}
                          width={200}
                          height={52}
                          className="h-9 w-auto md:h-11 object-contain"
                        />
                      )}

                      <motion.button
                        type="button"
                        onClick={onClose}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-[#871D3F] text-[#F4E8D7]"
                        aria-label="Close menu"
                      >
                        ✕
                      </motion.button>
                    </div>
                  </motion.li>

                  {/* Links */}
                  {navLinks.map((link, i) => {
                    const href = link.hrefWithLang || '#'
                    const active = isActiveHref(href)

                    return (
                      <motion.li
                        key={link.id || href}
                        variants={itemVariants}
                        className="relative w-full flex-1"
                        style={{ zIndex: i + 2, marginTop: `-${OFFSET}px`, minHeight: minCardH }}
                      >
                        <motion.div
                          initial={false}
                          animate={{ y: active ? -14 : 0 }}
                          whileHover={{ y: -14 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className={[
                            'relative overflow-hidden rounded-[22px] h-full',
                            'border border-black/10',
                            'transition-shadow',
                          ].join(' ')}
                          style={{ backgroundImage: `url('${bgImage.src}')` }}
                        >
                          <TransitionLink
                            href={href}
                            onClick={onClose}
                            className={[
                              'h-full flex items-center justify-between',
                              'px-6 md:px-10',
                              'text-[20px] md:text-[28px] italic',
                              'text-black/80 hover:text-black',
                              'group',
                            ].join(' ')}
                          >
                            <span className="tracking-[0.02em]">{link.labelText}</span>
                          </TransitionLink>
                        </motion.div>
                      </motion.li>
                    )
                  })}

                  {/* Footer Card */}
                  <motion.li
                    variants={itemVariants}
                    className="relative w-full flex-1"
                    style={{
                      zIndex: navLinks.length + 3,
                      marginTop: `-${OFFSET}px`,
                      minHeight: minCardH,
                    }}
                  >
                    <div
                      className="h-full flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-black/60 md:px-10 px-6 rounded-[22px] border border-black/10"
                      style={{ minHeight: minCardH, backgroundImage: `url('${bgImage.src}')` }}
                    >
                      <div className="flex items-center justify-center gap-5">
                        {socialLinks?.map((s, idx) => {
                          const iconSrc = s?.icon ? imgUrl(s.icon) : null
                          const href = s?.href || '#'
                          const label = s?.label || 'Social'

                          return (
                            <a
                              key={s?.id || href || idx}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={label}
                              className="h-10 w-10 flex items-center justify-center transition hover:scale-[1.03]"
                            >
                              {iconSrc ? (
                                <Image
                                  src={iconSrc}
                                  alt={label}
                                  width={18}
                                  height={18}
                                  className="h-5 w-5 object-contain opacity-80"
                                />
                              ) : (
                                <span className="text-[10px] tracking-normal">•</span>
                              )}
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  </motion.li>
                </motion.ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// src/components/layout/MainHeader.jsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

import PageContentReveal from '../PageContentReveal'
import { imgUrl } from '@/lib/cms'
import TransitionLink from '../transition/TransitionLink'
import { useTransitionUI } from '../transition/TransitionProvider'

// نفس الـ easing بتاع المشروع
const EASE = [0.19, 1, 0.22, 1]

// تقدر تغيّرها لو حبيت
const OVERLAY_VARIANT = 'circle' // currently only "circle"

export default function MainHeader({ header, bgImage }) {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const { ui } = useTransitionUI()

  const [menuOpen, setMenuOpen] = useState(false)

  // اقفل المنيو تلقائيًا لو الصفحة اتغيرت لأي سبب
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const logoLargeSrc = header?.logoLarge ? imgUrl(header.logoLarge) : null
  const logoSmallSrc = header?.logoSmall ? imgUrl(header.logoSmall) : null
  const navLinks = header?.links || []

  const logoLargeAlt = header?.logoLargeAlt || 'Sard'
  const logoSmallAlt = header?.logoSmallAlt || 'Menu'
  const socialLinks = header?.social || []

  const toggleMenu = () => setMenuOpen((v) => !v)
  const closeMenu = () => setMenuOpen(false)

  /**
   * ✅ المهم: الهيدر يظهر من "opening" (مش بعد idle)
   * - boot/closing/logo => مخفي
   * - opening/fading/idle => ظاهر
   */
  const phase = ui?.phase || 'idle'
  const showHeader = phase === 'opening' || phase === 'fading' || phase === 'idle'

  const headerVariants = reduce
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: -14, filter: 'blur(10px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)' },
      }

  return (
    <>
      {/* ✅ الهيدر الأساسي + انيميشن synchronized مع opening */}
      <motion.section
        className={[
          'bg-black pt-5 px-3 max-w-[1490px] mx-auto relative z-30',
          showHeader ? '' : 'pointer-events-none',
        ].join(' ')}
        variants={headerVariants}
        initial="hidden"
        animate={showHeader ? 'show' : 'hidden'}
        transition={{
          duration: reduce ? 0 : 0.55,
          ease: EASE,
          // سنة صغيرة تخليه يسبق/يمشي مع أول سيكشن
          delay: showHeader && phase === 'opening' ? 0.12 : 0,
        }}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <PageContentReveal
          paperColor="#F4E8D7"
          className="rounded-[24px] px-3 py-5 md:px-18 md:py-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          bgImage={bgImage}
        >
          <div className="flex items-center justify-between gap-6 relative">
            {/* اللوجو الكبير – شمال – clickable للـ Home */}
            <div className="flex items-center gap-3">
              {logoLargeSrc ? (
                <TransitionLink href="/" aria-label="Sard Home">
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

            {/* أيكون المنيو – يمين */}
            <div className="relative">
              <motion.button
                type="button"
                onClick={toggleMenu}
                whileTap={{ scale: 0.94 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full cursor-pointer text-[#F4E8D7] overflow-hidden"
                aria-label="Open menu"
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
      </motion.section>

      {/* ✅ Overlay Menu */}
      <HeaderMenuOverlay
        open={menuOpen}
        onClose={closeMenu}
        navLinks={navLinks}
        socialLinks={socialLinks} // ✅
        logoLargeSrc={logoLargeSrc}
        logoLargeAlt={logoLargeAlt}
        variant={OVERLAY_VARIANT}
      />
    </>
  )
}

/* ============================
   Overlay Menu
   ============================ */
function HeaderMenuOverlay({
  open,
  onClose,
  navLinks,
  socialLinks = [],
  logoLargeSrc,
  logoLargeAlt,
  variant = 'circle',
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

  const overlayVariantsMap = {
    circle: {
      hidden: { clipPath: 'circle(0% at 95% 10%)' },
      visible: {
        clipPath: 'circle(150% at 95% 10%)',
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      },
      exit: {
        clipPath: 'circle(0% at 95% 10%)',
        transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
      },
    },
  }

  const bgVariants = overlayVariantsMap[variant] || overlayVariantsMap.circle

  // ✅ إعدادات شكل الفيجما (مرة واحدة بدل تكرار)
  const MENU_CARD_H = 92
  const PEEK = 64
  const OFFSET = MENU_CARD_H - PEEK - 8
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

          <motion.div
            variants={bgVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-[#F4E8D7] text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-full max-w-[1490px] flex-col ">
              {/* Header */}
              <div className="flex items-center justify-between md:px-10 px-6 rounded-[22px] border border-black/10 h-[92px] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-black text-[#F4E8D7]"
                  aria-label="Close menu"
                >
                  ✕
                </motion.button>
              </div>

              {/* Stacked Menu List */}
              <motion.ul className="mt-16 w-full flex-1 min-h-0 overflow-y-auto overscroll-contain pb-10">
                {navLinks.map((link, i) => {
                  const href = link.href || '#'
                  const active = isActiveHref(href)

                  return (
                    <motion.li
                      key={link.id || href}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      animate={reduce ? {} : { opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="relative w-full"
                      style={{
                        zIndex: i + 1,
                        marginTop: i === 0 ? 0 : `-${OFFSET}px`,
                      }}
                    >
                      <motion.div
                        initial={false}
                        animate={{ y: active ? -14 : 0 }}
                        whileHover={{ y: -14 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={[
                          'relative overflow-hidden rounded-[22px]',
                          'border border-black/10',
                          'bg-[#F4E8D7]',
                          'shadow-[0_16px_40px_rgba(0,0,0,0.18)]',
                          'hover:shadow-[0_22px_55px_rgba(0,0,0,0.22)]',
                          'transition-shadow',
                        ].join(' ')}
                      >
                        <TransitionLink
                          href={href}
                          onClick={onClose}
                          className={[
                            'flex items-center justify-between',
                            'px-6 md:px-10',
                            'text-[20px] md:text-[22px] italic',
                            'text-black/80 hover:text-black',
                            'group',
                          ].join(' ')}
                          style={{ height: MENU_CARD_H }}
                        >
                          <span className="tracking-[0.02em]">{link.label}</span>
                        </TransitionLink>
                      </motion.div>
                    </motion.li>
                  )
                })}
              </motion.ul>

              {/* Footer */}
              <div className="h-[92px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-black/60 md:px-10 px-6 rounded-[22px] border border-black/10">
                <div className="flex items-center justify-center gap-3">
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
                        className="h-10 w-10 flex items-center justify-center transition"
                      >
                        {iconSrc ? (
                          <Image
                            src={iconSrc}
                            alt={label}
                            width={18}
                            height={18}
                            className="h-4 w-4 object-contain opacity-80"
                          />
                        ) : (
                          <span className="text-[10px] tracking-normal">•</span>
                        )}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

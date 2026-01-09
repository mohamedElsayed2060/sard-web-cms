// src/components/layout/MainHeader.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageContentReveal from "../PageContentReveal";
import { imgUrl } from "@/lib/cms";
import TransitionLink from "../transition/TransitionLink";
import { usePathname } from "next/navigation";
// ================================
// إعدادات سهلة تغيّر بيها السلوك
// ================================
const USE_DROPDOWN_MENU = false;
// ⬅️ خليها true عشان تستخدم الدروب داون بدل الـ overlay

const OVERLAY_VARIANT = "circle";
// options: "circle" | "slideUp" | "fade"

const DROPDOWN_VARIANT = "slideDown";
// options: "fade" | "scale" | "slideDown"

// ================================

export default function MainHeader({ header, bgImage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const logoLargeSrc = header?.logoLarge ? imgUrl(header.logoLarge) : null;
  const logoSmallSrc = header?.logoSmall ? imgUrl(header.logoSmall) : null;
  const navLinks = header?.links || [];

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const logoLargeAlt = header?.logoLargeAlt || "Sard";
  const logoSmallAlt = header?.logoSmallAlt || "Menu";

  return (
    <>
      {/* الهيدر الأساسي */}
      <section className="bg-black pt-5 px-3 max-w-[1490px] mx-auto relative z-30">
        <PageContentReveal
          variant="slideUp"
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

            {/* Nav وسط – ديسكتوب فقط (ممكن نطوره بعدين) */}

            {/* <nav className="hidden md:flex items-center gap-7 text-sm text-black/70">
              {navLinks.map((link) => (
                <Link
                  key={link.id || link.href}
                  href={link.href || "#"}
                  className="relative group overflow-hidden"
                >
                  <span className="transition-colors duration-200 group-hover:text-black">
                    {link.label}
                  </span>
                  <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-black/80 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              ))}
            </nav> */}

            {/* أيكون المنيو – يمين */}
            <div className="relative">
              <motion.button
                type="button"
                onClick={toggleMenu}
                whileTap={{ scale: 0.94 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full cursor-pointer text-[#F4E8D7] overflow-hidden"
                aria-label="Open menu"
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

      {/* لو وضع overlay، نعرض الـ Overlay Menu */}
      {!USE_DROPDOWN_MENU && (
        <HeaderMenuOverlay
          open={menuOpen}
          onClose={closeMenu}
          navLinks={navLinks}
          logoLargeSrc={logoLargeSrc}
          logoLargeAlt={logoLargeAlt}
          variant={OVERLAY_VARIANT}
        />
      )}
    </>
  );
}
/* ============================
   Overlay Menu Variants
   ============================ */
function HeaderMenuOverlay({
  open,
  onClose,
  navLinks,
  logoLargeSrc,
  logoLargeAlt,
  variant = "circle",
}) {
  const pathname = usePathname();

  // إعدادات المسافات
  const CARD_H = 70; // الارتفاع الكلي للكارت
  const PEEK = 40; // الجزء اللي عايزينه يبان من الكارت اللي تحته
  const OFFSET = CARD_H - PEEK; // المسافة اللي الكارت هيتحركها لفوق عشان يغطي اللي قبله

  const normalizePath = (p = "") => {
    const clean = p.split("?")[0].split("#")[0];
    const withSlash = clean.startsWith("/") ? clean : "/" + clean;
    return withSlash !== "/" ? withSlash.replace(/\/+$/, "") : "/";
  };

  const isActiveHref = (href) => {
    if (!href || href === "#") return false;
    const target = normalizePath(href);
    const current = normalizePath(pathname);
    return current === target || current.startsWith(target + "/");
  };

  const overlayVariantsMap = {
    circle: {
      hidden: { clipPath: "circle(0% at 95% 10%)" },
      visible: {
        clipPath: "circle(150% at 95% 10%)",
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      },
      exit: {
        clipPath: "circle(0% at 95% 10%)",
        transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
      },
    },
    // ... بقية الـ variants كما هي
  };

  const bgVariants = overlayVariantsMap[variant] || overlayVariantsMap.circle;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            variants={bgVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-[#F4E8D7] text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-full max-w-[1490px] flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between  md:px-10 px-6 rounded-[22px] border border-black/10 h-[92px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] ">
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
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-black text-[#F4E8D7]"
                >
                  ✕
                </motion.button>
              </div>

              {/* Stacked Menu List */}
              <motion.ul className="mt-16 w-full">
                {navLinks.map((link, i) => {
                  const href = link.href || "#";
                  const active = isActiveHref(href);

                  // ✅ إعدادات شكل الفيجما
                  const CARD_H = 92; // ارتفاع الكارت (زوّده لو عايز الكروت “أكبر”)
                  const PEEK = 64; // الجزء الظاهر من الكارت اللي تحته (زوّده عشان يبان أكتر)
                  const OFFSET = CARD_H - PEEK - 8; // قد ايه الكارت يغطي اللي فوقه

                  return (
                    <motion.li
                      key={link.id || href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="relative w-full"
                      style={{
                        // ✅ مهم: آخر واحد يبقى فوق (هو اللي ظاهر كامل)
                        zIndex: i + 1,
                        marginTop: i === 0 ? 0 : `-${OFFSET}px`,
                      }}
                    >
                      <motion.div
                        // ✅ مفيش scale نهائي
                        initial={false}
                        animate={{ y: active ? -14 : 0 }}
                        whileHover={{ y: -14 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={[
                          "relative overflow-hidden rounded-[22px]",
                          "border border-black/10",
                          "bg-[#F4E8D7]",
                          "shadow-[0_16px_40px_rgba(0,0,0,0.18)]",
                          "hover:shadow-[0_22px_55px_rgba(0,0,0,0.22)]",
                          "transition-shadow",
                        ].join(" ")}
                      >
                        <TransitionLink
                          href={href}
                          onClick={onClose}
                          className={[
                            "flex items-center justify-between",
                            "px-6 md:px-10",
                            `h-[${CARD_H}px]`,
                            "text-[20px] md:text-[22px] italic",
                            "text-black/80 hover:text-black",
                            "group",
                          ].join(" ")}
                        >
                          <span className="tracking-[0.02em]">
                            {link.label}
                          </span>

                          {/* دائرة يمين زي الفيجما */}
                          {/* <span className="h-10 w-10 rounded-full border border-black/15 grid place-items-center">
                            <span className="h-2.5 w-2.5 rounded-full bg-black/30" />
                          </span> */}
                        </TransitionLink>
                      </motion.div>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Footer */}
              <div
                className="
                h-[92px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-black/60 md:px-10 px-6 rounded-[22px] border border-black/10"
              >
                <span>Sard · Rooms</span>
                <span>Storytelling Studio</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

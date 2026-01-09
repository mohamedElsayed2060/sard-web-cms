// src/components/layout/MainFooter.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import PageContentReveal from "../PageContentReveal";
import { imgUrl } from "@/lib/cms";
import TransitionLink from "../transition/TransitionLink";

export default function MainFooter({ footer, bgImage }) {
  const links = footer?.links || [];
  const leftLogoSrc = footer?.logoLeft ? imgUrl(footer.logoLeft) : null;
  const rightLogoSrc = footer?.logoRight ? imgUrl(footer.logoRight) : null;
  const leftAlt = footer?.logoLeftAlt || "Sard";
  const rightAlt = footer?.logoRightAlt || "Sard icon";
  const copyright = footer?.copyright || "Copyright © 2025";
  return (
    <footer className="bg-black pt-5 px-3 pb-5 max-w-[1490px] mx-auto">
      <PageContentReveal
        variant="slideUp"
        paperColor="#F4E8D7"
        className="rounded-[24px] px-6 md:px-18 py-10 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        bgImage={bgImage}
      >
        {/* الصف اللي فوق: صورتين شمال ويمين زي الهيدر */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {leftLogoSrc ? (
              // نقدر نخليها برضه ترجع للهوم عادي لو حابب
              <TransitionLink href="/" aria-label="Sard Home">
                <Image
                  src={leftLogoSrc}
                  alt={leftAlt}
                  width={160}
                  height={44}
                  className="h-7 w-auto md:h-9 object-contain"
                />
              </TransitionLink>
            ) : (
              <div className="h-6 w-20 rounded-full bg-black/80" />
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

        {/* اللينكات في النص */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#252525] font-bold">
          {links.map((link) => (
            <div className="md:w-auto w-full" key={link.id || link.href}>
              <TransitionLink href={link.href || "#"}>
                {link.label}
              </TransitionLink>
            </div>
          ))}
        </nav>

        <div className="h-px w-full bg-black/20 m-0 mb-8" />

        {/* الكوبي رايت تحت */}
        <div className="flex items-center justify-center text-xs text-[#252525] font-bold">
          <span>{copyright}</span>
        </div>
      </PageContentReveal>
    </footer>
  );
}

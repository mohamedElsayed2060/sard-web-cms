// src/components/learning/LearningSection.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageContentReveal from "@/components/PageContentReveal";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { imgUrl } from "@/lib/cms";
import { RichColumn } from "./LearningAboutHero";
import SectionReveal from "../motion/SectionReveal";

export default function LearningSection({ works, bgImage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // ✅ عشان نمنع مشاكل الـ SSR

  const tabsSplideRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!works || works.length === 0) return null;

  const safeIndex =
    activeIndex >= 0 && activeIndex < works.length ? activeIndex : 0;
  const activeWork = works[safeIndex];

  const handleTabClick = (index) => {
    setActiveIndex(index);

    // نحرك التابز لو فيه overflow
    const inst = tabsSplideRef.current?.splide || tabsSplideRef.current || null;
    if (inst && inst.go) inst.go(index);
  };

  const posterSrc = activeWork?.poster ? imgUrl(activeWork?.poster) : null;
  const castItems = (activeWork?.cast ?? []).map((c) => c.name || c);

  return (
    <SectionReveal variant="fadeUp" delay={0.1}>
      <section className="bg-black pt-5 px-3 md:px-5">
        <div className="mx-auto max-w-[1490px]">
          {/* ===== Tabs ===== */}
          <div className="relative mb-6 md:mb-8">
            {isMounted && (
              <div className="absolute -top-[44px] left-0  right-0 px-6 md:px-12">
                <Splide
                  ref={tabsSplideRef}
                  aria-label="Works tabs"
                  options={{
                    type: "slide",
                    pagination: false,
                    gap: "0.75rem",
                    arrows: works.length > 3,
                    drag: "free",
                    autoWidth: true,
                  }}
                >
                  {works?.map((work, index) => {
                    const isActive = index === safeIndex;

                    return (
                      <SplideSlide key={work.id}>
                        <button
                          style={{ minWidth: "180px" }}
                          type="button"
                          onClick={() => handleTabClick(index)}
                          className={[
                            "px-6 py-3 text-sm whitespace-nowrap transition-all",
                            "rounded-tl-[20px] rounded-b-none",
                            isActive
                              ? "bg-[#4A569F] text-white shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
                              : "bg-[#4A569F] text-white/75 hover:bg-[#636fbb] shadow-[inset_0_-10px_5px_rgba(0,0,0,0.3)]",
                          ].join(" ")}
                        >
                          {work.title}
                        </button>
                      </SplideSlide>
                    );
                  })}
                </Splide>
              </div>
            )}
          </div>

          {/* ===== Card ===== */}
          <PageContentReveal
            paperColor="#4A569F"
            className="rounded-[24px] px-3 py-7 md:py-18 md:px-18 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden"
            bgImage={bgImage}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork?.id}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="mt-2 space-y-6 md:mt-0"
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] md:gap-8">
                  {/* Poster */}
                  <SectionReveal variant="slideRight" delay={0.6}>
                    <div className="overflow-hidden rounded-[24px] ">
                      {posterSrc ? (
                        <Image
                          src={posterSrc}
                          alt={activeWork?.title}
                          width={500}
                          height={700}
                          className="w-full h-auto object-cover"
                          priority={false}
                        />
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center text-sm text-white/40">
                          Poster
                        </div>
                      )}
                    </div>
                  </SectionReveal>
                  {/* Right column */}
                  <SectionReveal variant="slideLeft" delay={0.6}>
                    <div className="flex flex-col gap-5 md:gap-7">
                      {/* ===== Text / cast ===== */}
                      <div className="space-y-2 text-[#F0EADB]">
                        <div className="flex flex-wrap items-baseline gap-3 text-sm md:text-2xl">
                          <span className="italic font-semibold">
                            {activeWork?.title}
                          </span>
                        </div>

                        <div className="h-px w-full bg-[#F0EADB]/30" />
                        <div className="italic text-[11px] flex items-center gap-3 md:text-base">
                          {activeWork?.subTitle}
                        </div>
                      </div>
                      {/* عمودين باراجرافس من الـ richText */}
                      <div className="grid gap-6 md:grid-cols-2 md:gap-8 ">
                        <div className="space-y-4">
                          <RichColumn
                            value={activeWork.leftColumn}
                            textColor={"text-[#F0EADB]"}
                          />
                        </div>
                        <div className="space-y-4">
                          <RichColumn
                            value={activeWork.rightColumn}
                            textColor={"text-[#F0EADB]"}
                          />
                        </div>
                      </div>

                      <div className="h-px w-full bg-[#F0EADB]/30" />

                      <div className="flex flex-wrap gap-2 text-xs md:text-sm text-[#F0EADB]/80">
                        {castItems.map((name, i) => (
                          <span key={i}>
                            {name}
                            {i < castItems.length - 1 && (
                              <span className="mx-1 text-[#F0EADB]/40">|</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SectionReveal>
                </div>
              </motion.div>
            </AnimatePresence>
          </PageContentReveal>
        </div>
      </section>
    </SectionReveal>
  );
}

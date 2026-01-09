"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { imgUrl } from "@/lib/cms";
import PageContentReveal from "@/components/PageContentReveal";
import BookModal from "@/components/shared/BookModal";
import { RichColumn } from "./AboutSardHero";

// لو عندك Splide (زي ما كنت بتستخدم قبل كده)
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import SectionReveal from "../motion/SectionReveal";

/** استخراج نص بسيط من Lexical/Array عشان نعمل excerpt سطرين في الكارت */
function plainTextFromRich(value) {
  const nodes = Array.isArray(value) ? value : value?.root?.children || [];

  const walk = (n) => {
    if (!n) return "";
    if (Array.isArray(n)) return n.map(walk).join(" ");
    if (n.type === "text") return n.text || n.content || "";
    if (n.type === "linebreak") return "\n";
    if (n.children) return walk(n.children);
    return "";
  };

  return walk(nodes).replace(/\s+/g, " ").trim();
}

export default function AboutSardTeam({ members = [], bgImage, brandMark }) {
  const list = useMemo(() => members || [], [members]);
  const [active, setActive] = useState(null);

  if (!list.length) return null;

  return (
    <SectionReveal variant="fadeUp" delay={0.1}>
      <section className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
        <PageContentReveal
          variant="slideUp"
          paperColor="#F4E8D7"
          className="rounded-[24px] px-3 py-7 md:px-10 md:py-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          bgImage={bgImage}
        >
          {/* Header */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="h-px flex-1 bg-black/70" />

              <h2 className="w-full italic text-2xl md:text-4xl font-semibold text-[#252525] whitespace-nowrap">
                Our Team
              </h2>
              <div className="h-px flex-1 bg-black/50 mb-2" />
            </div>
          </div>

          {/* Slider */}
          <SectionReveal variant="fadeUp" delay={0.5}>
            <div className="relative">
              <Splide
                className="w-full"
                options={{
                  type: "slide",
                  gap: "1rem",
                  pagination: false,
                  arrows: false,
                  drag: "free",
                  perPage: 3.5,
                  // perMove: 1,
                  focus: "end",
                  // trimSpace: false,
                  breakpoints: {
                    1024: { perPage: 2 },
                    768: { perPage: 2 },
                    640: {
                      perPage: 1.5,
                      // padding: { right: "20%" }, // بنبانى جزء من اللي بعده
                    },
                    480: {
                      perPage: 1.5,
                      // padding: { right: "24%" },
                    },
                  },
                }}
              >
                {list.map((m, i) => {
                  const photoSrc = imgUrl(m?.photo);
                  const badgeSrc = imgUrl(m?.badgeIcon);

                  const excerpt = plainTextFromRich(m?.details || "").slice(
                    0,
                    220
                  );

                  // alternating rounded: الأول round ناحية، التاني عكسه...
                  const roundTL = i % 2 === 1; // odd => round top-left
                  const roundTR = i % 2 === 0; // even => round top-right

                  return (
                    <SplideSlide key={m?.id || i}>
                      <button
                        type="button"
                        onClick={() => setActive(m)}
                        className="w-full text-left"
                      >
                        <div className=" overflow-hidden ">
                          {/* Photo */}
                          <div
                            className={[
                              "relative w-full h-[260px] md:h-[290px] ",
                              // rounded only on one corner (زي التصميم)
                              roundTR ? "rounded-tr-[28px]" : "",
                              roundTL ? "rounded-tl-[28px]" : "",
                            ].join(" ")}
                          >
                            {photoSrc ? (
                              <Image
                                src={photoSrc}
                                alt={m?.name || "Team member"}
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover rounded-lg rounded-tl-3xl"
                                priority={i < 2}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
                                Upload photo in CMS
                              </div>
                            )}
                          </div>

                          {/* Body */}
                          <div
                            className="pt-5 px-1"
                            style={{
                              backgroundImage: bgImage?.src
                                ? `url('${bgImage.src}')`
                                : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <h3 className="italic text-2xl md:text-3xl font-semibold text-[#252525] leading-none">
                                {m?.name || "Team member"}
                              </h3>

                              {badgeSrc ? (
                                <Image
                                  src={badgeSrc}
                                  alt=""
                                  width={28}
                                  height={28}
                                  className="object-contain"
                                />
                              ) : null}
                            </div>

                            <div className="h-px bg-black/35 mt-3 mb-4" />

                            {/* excerpt سطرين */}
                            <p
                              className="text-sm text-[#252525]/80"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {excerpt}
                            </p>
                          </div>
                        </div>
                      </button>
                    </SplideSlide>
                  );
                })}
              </Splide>
            </div>
          </SectionReveal>

          {/* Modal */}
          <BookModal
            open={!!active}
            onClose={() => setActive(null)}
            brandMark={brandMark.src}
            paperBg="#F4E8D7"
            introMs={2050}
            openMs={1050}
          >
            <div
              className="p-6 md:p-10"
              style={{
                backgroundImage: bgImage?.src
                  ? `url('${bgImage.src}')`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Photo */}
                <div className="rounded-[22px] overflow-hidden bg-black/90">
                  {active?.photo ? (
                    <Image
                      src={imgUrl(active.photo)}
                      alt={active?.name || "Team member"}
                      width={900}
                      height={900}
                      className="w-full h-[340px] md:h-[520px] object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-[340px] md:h-[520px]" />
                  )}
                </div>

                {/* Content */}
                <div className="text-[#252525]">
                  <div className="flex items-center gap-3">
                    <h3 className="italic text-3xl md:text-5xl font-semibold">
                      {active?.name}
                    </h3>

                    {active?.badgeIcon ? (
                      <Image
                        src={imgUrl(active.badgeIcon)}
                        alt=""
                        width={34}
                        height={34}
                        className="object-contain"
                      />
                    ) : null}
                  </div>

                  <div className="h-px bg-black/35 mt-4 mb-5" />

                  {active?.details ? (
                    <RichColumn
                      value={active.details}
                      textColor="text-[#252525]"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </BookModal>
        </PageContentReveal>
      </section>
    </SectionReveal>
  );
}

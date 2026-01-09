"use client";

import PageContentReveal from "@/components/PageContentReveal";
import { RichColumn } from "./AboutSardHero";
import SectionReveal from "../motion/SectionReveal";

export default function AboutSardVisionMission({ data, bgImage }) {
  if (!data) return null;

  const title = data.sectionTitle || "VISION & MISSION";

  return (
    <SectionReveal variant="fadeUp" delay={0.1}>
      <section className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
        <PageContentReveal
          variant="slideUp"
          paperColor="#F4E8D7"
          className="rounded-[24px] px-5 py-8 md:px-14 md:py-12 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          bgImage={bgImage}
        >
          {/* Title + lines */}
          <div className="space-y-4 text-[#252525]">
            <div className="h-px w-full bg-black/40" />
            <h2 className="italic text-2xl md:text-4xl font-semibold tracking-[0.18em]">
              {title}
            </h2>
            <div className="h-px w-full bg-black/40" />
          </div>

          {/* 3 Columns */}
          <div className="mt-7 grid gap-8 md:grid-cols-3 md:gap-10 text-[#252525]">
            <SectionReveal variant="slideLeft" delay={0.6}>
              <div>
                <h3 className="font-semibold mb-3">
                  {data?.vision?.title || "Vision Statement"}
                </h3>
                <RichColumn
                  value={data?.vision?.body}
                  textColor="text-black/80"
                />
              </div>
            </SectionReveal>
            <SectionReveal variant="slideLeft" delay={0.7}>
              <div>
                <h3 className="font-semibold mb-3">
                  {data?.mission?.title || "Mission Statement"}
                </h3>
                <RichColumn
                  value={data?.mission?.body}
                  textColor="text-black/80"
                />
              </div>
            </SectionReveal>
            <SectionReveal variant="slideLeft" delay={0.8}>
              <div>
                <h3 className="font-semibold mb-3">
                  {data?.values?.title || "Our Values"}
                </h3>
                <RichColumn
                  value={data?.values?.body}
                  textColor="text-black/80"
                />
              </div>
            </SectionReveal>
          </div>
        </PageContentReveal>
      </section>
    </SectionReveal>
  );
}

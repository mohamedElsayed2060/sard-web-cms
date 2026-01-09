// src/app/about/page.jsx
import MainHeader from "@/components/layout/MainHeader";
import MainFooter from "@/components/layout/MainFooter";

import { getAboutSardPageData } from "@/lib/cms";
import { getSiteHeader, getSiteFooter } from "@/lib/cms";
import marim_bg from "@/assets/marim-bg.png";

import learning_bg from "@/assets/learning-bg.png";
import brand_mark from "@/assets/brand-mark.svg";
import sard_milston from "@/assets/about-sard-milston.png";
import AboutSardHero from "@/components/AboutSard/AboutSardHero";
import AboutSardWork from "@/components/AboutSard/AboutSardWork";
import AboutSardVisionMission from "@/components/AboutSard/AboutSardVisionMission";
import AboutSardAwards from "@/components/AboutSard/AboutSardAwards";
import AboutSardTeam from "@/components/AboutSard/AboutSardTeam";

export const revalidate = 0;

export default async function AboutSardPage() {
  const [pageData, header, footer] = await Promise.all([
    getAboutSardPageData(),
    getSiteHeader(),
    getSiteFooter(),
  ]);
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <AboutSardHero data={pageData?.hero} bgImage={marim_bg} />
      <AboutSardWork
        works={pageData?.sardAboutSard?.docs}
        bgImage={sard_milston}
      />
      <AboutSardVisionMission
        data={pageData?.visionMission}
        bgImage={marim_bg}
      />
      <AboutSardAwards awards={pageData?.awards} bgImage={marim_bg} />
      <AboutSardTeam
        members={pageData?.team}
        bgImage={marim_bg}
        brandMark={brand_mark}
      />

      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  );
}
// i need to add the last 2 sections in this page
//  in the marim page i need to add the overlay that open up when click on the cards

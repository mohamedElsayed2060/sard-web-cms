// src/app/(frontend)/[lang]/about-sard/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'

import { getAboutSardPageData } from '@/lib/cms'
import { getSiteHeader, getSiteFooter } from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'

// import learning_bg from '@/assets/learning-bg.png'
import brand_mark from '@/assets/brand-mark.svg'
// import sard_milston from '@/assets/about-sard-milston.png'
import AboutSardHero from '@/components/AboutSard/AboutSardHero'
// import AboutSardWork from '@/components/AboutSard/AboutSardWork'
import AboutSardVisionMission from '@/components/AboutSard/AboutSardVisionMission'
import AboutSardAwards from '@/components/AboutSard/AboutSardAwards'
import AboutSardTeam from '@/components/AboutSard/AboutSardTeam'
import AboutSardNewestProduction from '@/components/AboutSard/AboutSardNewestProduction'
import AboutSardGrants from '@/components/AboutSard/AboutSardGrants'
import AboutSardPartners from '@/components/AboutSard/AboutSardPartners'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}/about-sard`

  return {
    title: 'About Sard',
    description:
      'Learn about Sard’s vision, mission, milestones, and awards as a leading Arab storytelling hub.',
    alternates: {
      canonical: path,
      languages: {
        en: `/en/about-sard`,
        ar: `/ar/about-sard`,
      },
    },
  }
}
export const revalidate = 60

export default async function AboutSardPage({ params }) {
  const { lang = 'en' } = await params
  const [pageData, header, footer] = await Promise.all([
    getAboutSardPageData(),
    getSiteHeader(),
    getSiteFooter(),
  ])
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <AboutSardHero data={pageData?.hero} bgImage={marim_bg} lang={lang} />
      {/* <AboutSardWork works={pageData?.sardAboutSard?.docs} bgImage={sard_milston} /> */}
      <AboutSardVisionMission data={pageData?.visionMission} bgImage={marim_bg} />
      <AboutSardAwards awards={pageData?.awards} bgImage={marim_bg} />
      <AboutSardTeam members={pageData?.team} bgImage={marim_bg} brandMark={brand_mark} />

      <AboutSardGrants
        doc={pageData?.grantsDoc}
        bgImage={marim_bg}
        brandMark={brand_mark}
        lang={lang}
      />
      <AboutSardPartners doc={pageData?.partnersDoc} bgImage={marim_bg} lang={lang} />
      {/* ✅ New reusable gallery section (data from Payload: Galleries collection) */}
      <AboutSardNewestProduction gallery={pageData?.newestProduction} bgImage={marim_bg} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

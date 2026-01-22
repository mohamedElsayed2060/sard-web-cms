// src/app/about/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import AboutMariamHero from '@/components/mariam/AboutMariamHero'
import MariamWorksSection from '@/components/mariam/MariamWorksSection'
import { getMariamPageData } from '@/lib/cms'
import { getSiteHeader, getSiteFooter } from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'
import work_bg from '@/assets/work-bg.png'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}/about-mariam`

  return {
    title: 'About Mariam Naoum',
    description: 'Learn more about Mariam.',
    alternates: {
      canonical: path,
      languages: {
        en: `/en/about-mariam`,
        ar: `/ar/about-mariam`,
      },
    },
  }
}

export const revalidate = 60

export default async function AboutPage({ params }) {
  const { lang = 'en' } = await params
  // const { hero, works } = await getMariamPageData();
  const [pageData, header, footer] = await Promise.all([
    getMariamPageData(),
    getSiteHeader(),
    getSiteFooter(),
  ])
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <AboutMariamHero data={pageData?.hero} bgImage={marim_bg} lang={lang} />
      <MariamWorksSection works={pageData?.works} bgImage={work_bg} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

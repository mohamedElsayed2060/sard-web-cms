// src/app/about/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import AboutMariamHero from '@/components/mariam/AboutMariamHero'
import MariamWorksSection from '@/components/mariam/MariamWorksSection'
import { getMariamPageData } from '@/lib/cms'
import { getSiteHeader, getSiteFooter } from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'
import work_bg from '@/assets/work-bg.png'

export const metadata = {
  title: 'About Mariam Naoum',
  description: 'About Mariam Naoum.',
}

export const revalidate = 0

export default async function AboutPage() {
  // const { hero, works } = await getMariamPageData();
  const [pageData, header, footer] = await Promise.all([
    getMariamPageData(),
    getSiteHeader(),
    getSiteFooter(),
  ])
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <AboutMariamHero data={pageData?.hero} bgImage={marim_bg} />
      <MariamWorksSection works={pageData?.works} bgImage={work_bg} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

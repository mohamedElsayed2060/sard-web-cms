// src/app/about/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import LearningAboutHero from '@/components/learning/LearningAboutHero'
import LearningSection from '@/components/learning/LearningSection'
import { getLatestNewsBar, getLearningPageData } from '@/lib/cms'
import { getSiteHeader, getSiteFooter } from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'
import learning_bg from '@/assets/learning-bg.png'
import LatestNewsBar from '@/components/layout/LatestNewsBar'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}/learning`

  return {
    title: 'Sard learning',
    description: 'Sard learning programs and initiatives.',

    alternates: {
      canonical: path,
      languages: {
        en: `/en/learning`,
        ar: `/ar/learning`,
      },
    },
  }
}

export const revalidate = 60

export default async function AboutPage({ params }) {
  const { lang = 'en' } = await params
  const [pageData, header, footer, latestNews] = await Promise.all([
    getLearningPageData(),
    getSiteHeader(),
    getSiteFooter(),
    getLatestNewsBar(),
  ])
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <LatestNewsBar data={latestNews} bgImage={marim_bg} lang={lang} />

      <LearningAboutHero data={pageData?.hero} bgImage={marim_bg} lang={lang} />
      <LearningSection works={pageData?.sardLearning?.docs} bgImage={learning_bg} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

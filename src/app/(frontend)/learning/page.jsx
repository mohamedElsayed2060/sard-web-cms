// src/app/about/page.jsx
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import LearningAboutHero from '@/components/learning/LearningAboutHero'
import LearningSection from '@/components/learning/LearningSection'
import { getLearningPageData } from '@/lib/cms'
import { getSiteHeader, getSiteFooter } from '@/lib/cms'
import marim_bg from '@/assets/marim-bg.png'
import learning_bg from '@/assets/learning-bg.png'

export const metadata = {
  title: 'Sard learning',
  description: 'Sard learning.',
}

export const revalidate = 0

export default async function AboutPage() {
  const [pageData, header, footer] = await Promise.all([
    getLearningPageData(),
    getSiteHeader(),
    getSiteFooter(),
  ])
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <LearningAboutHero data={pageData?.hero} bgImage={marim_bg} />
      <LearningSection works={pageData?.sardLearning?.docs} bgImage={learning_bg} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

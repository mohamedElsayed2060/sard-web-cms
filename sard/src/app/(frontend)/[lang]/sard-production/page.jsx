// src/app/(frontend)/[lang]/sard-production/page.jsx
import marim_bg from '@/assets/marim-bg.png'
import production from '@/assets/writer-room.png'

import SardProductionGallerySection from '@/components/SardProduction/SardProductionGallerySection'
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'

import { getSardProductionPageData } from '@/lib/cms'
import AboutSardProductionHero from '@/components/SardProduction/AboutSardProductionHero'
import LatestNewsBar from '@/components/layout/LatestNewsBar'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}/sard-production`

  return {
    title: 'Sard Production',
    description: 'Sard production work and projects.',
    alternates: {
      canonical: path,
      languages: {
        en: `/en/sard-production`,
        ar: `/ar/sard-production`,
      },
    },
  }
}
export const revalidate = 60

export default async function SardProductionPage({ params }) {
  const { lang = 'en' } = await params

  const { header, footer, gallery, hero, latestNews } = await getSardProductionPageData()

  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <LatestNewsBar data={latestNews} bgImage={marim_bg} lang={lang} />
      <AboutSardProductionHero data={hero} bgImage={marim_bg} lang={lang} />
      <SardProductionGallerySection gallery={gallery} bgImage={production} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

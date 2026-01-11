// src/app/(frontend)/sard-production/page.jsx
import marim_bg from '@/assets/marim-bg.png'
import production from '@/assets/production.png'

import SardProductionGallerySection from '@/components/SardProduction/SardProductionGallerySection'
import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'

import { getSardProductionPageData } from '@/lib/cms'
import AboutSardProductionHero from '@/components/SardProduction/AboutSardProductionHero'

export default async function SardProductionPage() {
  const { header, footer, gallery, hero } = await getSardProductionPageData()
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <AboutSardProductionHero data={hero} bgImage={marim_bg} />

      <SardProductionGallerySection gallery={gallery} bgImage={production} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

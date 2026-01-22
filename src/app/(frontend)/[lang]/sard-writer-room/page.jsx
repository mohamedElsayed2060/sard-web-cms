// src/app/(frontend)/sard-production/page.jsx
import marim_bg from '@/assets/marim-bg.png'
import writer_room from '@/assets/writer-room.png'

import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import AboutSardWriterHero from '@/components/SardWriterRoom/AboutSardWriterHero'
import { getSardWriterRoomPageData } from '@/lib/cms'
import SardWriterRoomGallerySection from '@/components/SardWriterRoom/SardWriterRoomGallerySection'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}/sard-writer-room`

  return {
    title: "Sard Writer's Room",
    description: 'Sard writer room programs and content.',
    alternates: {
      canonical: path,
      languages: {
        en: `/en/sard-writer-room`,
        ar: `/ar/sard-writer-room`,
      },
    },
  }
}

export const revalidate = 60

export default async function SardWriterRoomPage({ params }) {
  const { lang = 'en' } = await params

  const { header, footer, gallery, hero } = await getSardWriterRoomPageData()
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <AboutSardWriterHero data={hero} bgImage={marim_bg} lang={lang} />

      <SardWriterRoomGallerySection gallery={gallery} bgImage={writer_room} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

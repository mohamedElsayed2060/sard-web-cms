// src/app/(frontend)/sard-production/page.jsx
import marim_bg from '@/assets/marim-bg.png'
import writer_room from '@/assets/writer-room.png'

import MainHeader from '@/components/layout/MainHeader'
import MainFooter from '@/components/layout/MainFooter'
import AboutSardWriterHero from '@/components/SardWriterRoom/AboutSardWriterHero'
import { getSardWriterRoomPageData } from '@/lib/cms'
import SardWriterRoomGallerySection from '@/components/SardWriterRoom/SardWriterRoomGallerySection'
export default async function SardWriterRoomPage() {
  const { header, footer, gallery, hero } = await getSardWriterRoomPageData()
  console.log('Sard Writer Room Hero Data:', gallery)
  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <MainHeader header={header} bgImage={marim_bg} />
      <AboutSardWriterHero data={hero} bgImage={marim_bg} />

      <SardWriterRoomGallerySection gallery={gallery} bgImage={writer_room} />
      <MainFooter footer={footer} bgImage={marim_bg} />
    </main>
  )
}

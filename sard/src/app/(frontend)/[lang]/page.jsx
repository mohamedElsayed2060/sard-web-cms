// src/app/page.jsx
import SceneHome from '@/components/Scene/SceneHome'
import { fetchJSON } from '@/lib/cms'
import { getHomeSceneData } from '@/lib/cms'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const path = `/${lang}`

  return {
    title: 'Sard',
    description: 'Sard storytelling studio.',
    alternates: {
      canonical: path,
      languages: {
        en: `/en`,
        ar: `/ar`,
      },
    },
  }
}

export const revalidate = 60

export default async function HomePage() {
  const { scene, hotspots, propsItems } = await getHomeSceneData()

  return <SceneHome scene={scene} hotspots={hotspots} propsItems={propsItems} />
}

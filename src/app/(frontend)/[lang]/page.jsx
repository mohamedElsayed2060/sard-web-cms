// src/app/page.jsx
import SceneHome from '@/components/Scene/SceneHome'
import { fetchJSON } from '@/lib/cms'

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
  const [scene, hotspotsRes] = await Promise.all([
    fetchJSON('/api/globals/scene?depth=2', { revalidate: 60, tags: ['global:scene'] }).catch(
      () => null,
    ),
    fetchJSON('/api/scene-hotspots?limit=100', {
      revalidate: 60,
      tags: ['collection:scene-hotspots'],
    }).catch(() => null),
  ])

  const hotspots = hotspotsRes?.docs || []

  return <SceneHome scene={scene} hotspots={hotspots} />
}

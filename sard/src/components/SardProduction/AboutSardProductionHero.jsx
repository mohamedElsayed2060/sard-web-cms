// src/components/AboutSard/AboutSardProductionHero.jsx
'use client'

import TwoColumnAboutHero from '@/components/heroes/TwoColumnAboutHero'

export default function AboutSardProductionHero({ data, bgImage, lang }) {
  return <TwoColumnAboutHero data={data} bgImage={bgImage} lang={lang} />
}

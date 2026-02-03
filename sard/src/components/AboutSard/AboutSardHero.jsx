// src/components/AboutSard/AboutSardHero.jsx
'use client'

import TwoColumnAboutHero from '@/components/heroes/TwoColumnAboutHero'

export default function AboutSardHero({ data, bgImage, lang }) {
  return <TwoColumnAboutHero data={data} bgImage={bgImage} lang={lang} />
}

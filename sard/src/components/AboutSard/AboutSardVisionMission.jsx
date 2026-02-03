'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import PageContentReveal from '@/components/PageContentReveal'
import SectionReveal from '../motion/SectionReveal'
import RichColumn from '../richtext/RichColumn'

const SUPPORTED_LANGS = ['en', 'ar']
const getLangFromPath = (pathname = '') => {
  const seg = pathname.split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

const FALLBACKS = {
  en: {
    sectionTitle: 'VISION & MISSION',
    visionTitle: 'Vision Statement',
    missionTitle: 'Mission Statement',
    valuesTitle: 'Our Values',
  },
  ar: {
    sectionTitle: 'الرؤية والرسالة',
    visionTitle: 'الرؤية',
    missionTitle: 'الرسالة',
    valuesTitle: 'قيمنا',
  },
}

const pickText = (en, ar, lang) => {
  if (lang === 'ar') return ar || en || ''
  return en || ar || ''
}

const pickRich = (enVal, arVal, lang) => {
  if (lang === 'ar') return arVal || enVal || null
  return enVal || arVal || null
}

export default function AboutSardVisionMission({ data, bgImage, lang: langProp }) {
  const pathname = usePathname()
  const lang = langProp || getLangFromPath(pathname || '')
  const fb = FALLBACKS[lang] || FALLBACKS.en

  if (!data) return null

  const sectionTitle = useMemo(
    () => pickText(data?.sectionTitleEn, data?.sectionTitleAr, lang) || fb.sectionTitle,
    [data, lang, fb.sectionTitle],
  )

  const visionTitle = pickText(data?.vision?.titleEn, data?.vision?.titleAr, lang) || fb.visionTitle
  const missionTitle =
    pickText(data?.mission?.titleEn, data?.mission?.titleAr, lang) || fb.missionTitle
  const valuesTitle = pickText(data?.values?.titleEn, data?.values?.titleAr, lang) || fb.valuesTitle

  const visionBody = pickRich(data?.vision?.bodyEn, data?.vision?.bodyAr, lang)
  const missionBody = pickRich(data?.mission?.bodyEn, data?.mission?.bodyAr, lang)
  const valuesBody = pickRich(data?.values?.bodyEn, data?.values?.bodyAr, lang)

  return (
    <SectionReveal once={true} delay={0.1}>
      <section className="bg-black px-3 pb-5 max-w-[1490px] mx-auto">
        <PageContentReveal
          variant="slideUp"
          paperColor="#F4E8D7"
          className="rounded-[24px] p-3 py-7 md:py-18 md:px-18"
          bgImage={bgImage}
        >
          {/* Title + lines */}
          <div className="space-y-4 text-[#252525]">
            <div className="h-px w-full bg-black/40" />
            <h2 className="italic text-2xl md:text-4xl font-semibold tracking-[0.18em]">
              {sectionTitle}
            </h2>
            <div className="h-px w-full bg-black/40" />
          </div>

          {/* 3 Columns */}
          <div className="mt-7 grid gap-8 md:grid-cols-3 md:gap-10 text-[#252525]">
            <SectionReveal variant="slideLeft" delay={0.6}>
              <div>
                <h3 className="font-semibold mb-3">{visionTitle}</h3>
                <RichColumn value={visionBody} textColor="text-black/80" />
              </div>
            </SectionReveal>

            <SectionReveal variant="slideLeft" delay={0.7}>
              <div>
                <h3 className="font-semibold mb-3">{missionTitle}</h3>
                <RichColumn value={missionBody} textColor="text-black/80" />
              </div>
            </SectionReveal>

            <SectionReveal variant="slideLeft" delay={0.8}>
              <div>
                <h3 className="font-semibold mb-3">{valuesTitle}</h3>
                <RichColumn value={valuesBody} textColor="text-black/80" />
              </div>
            </SectionReveal>
          </div>
        </PageContentReveal>
      </section>
    </SectionReveal>
  )
}

'use client'

import PageContentReveal from '@/components/PageContentReveal'
import SectionReveal from '@/components/motion/SectionReveal'
import CMSImage from '@/components/CMSImage'
import RichColumn from '@/components/richtext/RichColumn'
import { imgUrl } from '@/lib/cms'
import { pick } from '@/lib/i18n'

function hasLexicalContent(v) {
  const c = v?.root?.children
  if (!Array.isArray(c) || c.length === 0) return false
  // check any paragraph has children text
  return c.some((n) => Array.isArray(n?.children) && n.children.length > 0)
}

export default function TwoColumnAboutHero({
  data,
  bgImage,
  lang = 'en',
  // optional overrides
  paperColor = '#F4E8D7',
  maxWidthClass = 'max-w-[1490px]',
}) {
  if (!data) return null

  const portraitFile = lang === 'ar' && data.portraitAr ? data.portraitAr : data.portrait

  const portraitSrc = portraitFile ? imgUrl(portraitFile) : null

  const allAboutLabel = pick(data.allAboutLabel, lang) || 'All About'
  const displayName = pick(data.displayName, lang) || ''

  const left = data.leftColumn
    ? data.leftColumn.en || data.leftColumn.ar
      ? data.leftColumn
      : null
    : null
  const right = data.rightColumn
    ? data.rightColumn.en || data.rightColumn.ar
      ? data.rightColumn
      : null
    : null

  // دعم الشكلين:
  // 1) لو عملت i18n: leftColumn: {en: rich, ar: rich}
  // 2) لو لسه قديم: leftColumn: richText
  const leftValue = left ? left[lang] || left.en : data.leftColumn
  const rightValue = right ? right[lang] || right.en : data.rightColumn

  const hasRight = hasLexicalContent(rightValue)

  return (
    <SectionReveal once={true} duration={0.8}>
      <section className={`bg-black pt-5 px-3 pb-5 ${maxWidthClass} mx-auto`}>
        <PageContentReveal
          variant="slideUp"
          paperColor={paperColor}
          className="rounded-[24px] px-3 py-7 md:px-18 md:py-10"
          bgImage={bgImage}
        >
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] md:gap-10">
            <SectionReveal variant="slideRight" delay={1} duration={0.8}>
              <div className="relative overflow-hidden rounded-[24px]">
                {portraitSrc ? (
                  <CMSImage
                    src={portraitSrc}
                    alt={displayName || 'Portrait'}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center text-sm text-black/40">
                    Upload portrait in CMS
                  </div>
                )}
              </div>
            </SectionReveal>

            <SectionReveal variant="slideLeft" delay={1} duration={0.8}>
              <div className="space-y-8 text-[#252525]">
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <span className="text-lg italic font-bold text-black whitespace-nowrap">
                      {allAboutLabel}
                    </span>
                    <div className="h-px flex-1 bg-black" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="italic text-2xl md:text-3xl lg:text-5xl font-bold h-title">
                      {displayName}
                    </h1>
                    <div className="w-full h-px bg-black" />
                  </div>
                </div>

                <div className={`grid gap-6 ${hasRight ? 'md:grid-cols-2' : ''} md:gap-8`}>
                  <div className={`space-y-4 ${hasRight ? '' : 'md:w-[90%]'}`}>
                    <RichColumn value={leftValue} />
                  </div>
                  {hasRight ? (
                    <div className="space-y-4">
                      <RichColumn value={rightValue} />
                    </div>
                  ) : null}
                </div>
              </div>
            </SectionReveal>
          </div>
        </PageContentReveal>
      </section>
    </SectionReveal>
  )
}

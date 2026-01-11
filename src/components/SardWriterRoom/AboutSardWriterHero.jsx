// src/components/AboutSard/AboutSardProductionHero.jsx
'use client'

import Image from 'next/image'
import PageContentReveal from '@/components/PageContentReveal'
import { imgUrl } from '@/lib/cms'
import SectionReveal from '../motion/SectionReveal'
// Helper يشتغل مع richText + يحترم الـ bold/italic/links => ( updated one )
export function RichColumn({ value, textColor }) {
  let nodes = []

  // 1) Array (شكل Slate/Plain)
  if (Array.isArray(value)) {
    nodes = value
  }
  // 2) Lexical: { root: { children: [...] } }
  else if (value?.root?.children) {
    nodes = value.root.children
  }

  if (!nodes || nodes.length === 0) return null

  const colorClass = textColor ?? 'text-black/80'

  const renderChildren = (children) => {
    if (!Array.isArray(children)) return null

    return children.map((child, idx) => {
      // line break من Lexical
      if (child.type === 'linebreak') {
        return <br key={idx} />
      }

      // نص عادي مع فورمات
      if (child.type === 'text') {
        const text = child.text || child.content || ''
        if (!text) return null

        const format = child.format

        const isBold =
          child.bold ||
          format === 'bold' ||
          (typeof format === 'string' && format.includes('bold')) ||
          (typeof format === 'number' && (format & 1) === 1) // Lexical: 1 = BOLD

        const isItalic =
          child.italic ||
          format === 'italic' ||
          (typeof format === 'string' && format.includes('italic')) ||
          (typeof format === 'number' && (format & 2) === 2) // Lexical: 2 = ITALIC

        let content = text

        if (isItalic) content = <em>{content}</em>
        if (isBold) content = <strong>{content}</strong>

        return <span key={idx}>{content}</span>
      }

      // لينك
      if (child.type === 'link') {
        const href = child.fields?.url || child.url || child.fields?.href || '#'

        return (
          <a
            key={idx}
            href={href}
            className="underline underline-offset-2 decoration-black/40 hover:decoration-black"
            target={child.newTab ? '_blank' : undefined}
            rel={child.newTab ? 'noopener noreferrer' : undefined}
          >
            {renderChildren(child.children || [])}
          </a>
        )
      }

      // أي nested children تاني
      if (child.children) {
        return <span key={idx}>{renderChildren(child.children)}</span>
      }

      return null
    })
  }

  const renderNode = (node, index) => {
    if (!node) return null

    // فقرة عادية
    if (node.type === 'paragraph') {
      return (
        <p key={`p-${index}`} className={`text-sm leading-relaxed ${colorClass} mb-4 last:mb-0`}>
          {renderChildren(node.children || [])}
        </p>
      )
    }

    // list من Lexical (bullet / number)
    if (node.type === 'list') {
      const Tag = node.tag || (node.listType === 'number' ? 'ol' : 'ul')

      return (
        <Tag
          key={`l-${index}`}
          className={`ml-5 mb-4 list-outside space-y-1 ${
            Tag === 'ul' ? 'list-disc' : 'list-decimal'
          }`}
        >
          {(node.children || []).map((li, liIdx) => (
            <li key={liIdx} className={`${colorClass} text-sm`}>
              {renderChildren(li.children || [])}
            </li>
          ))}
        </Tag>
      )
    }

    return null
  }

  return <>{nodes.map(renderNode)}</>
}

export default function AboutSardWriterHero({ data, bgImage }) {
  if (!data) return null

  const portraitSrc = data.portrait ? imgUrl(data.portrait) : null

  return (
    <SectionReveal variant="fadeUp" delay={0.08} duration={0.8}>
      <section className="bg-black pt-5 px-3 pb-5 max-w-[1490px] mx-auto">
        <PageContentReveal
          variant="slideUp"
          paperColor="#F4E8D7"
          className="rounded-[24px] px-3 py-7 md:py-18 md:px-18  shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          bgImage={bgImage}
        >
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] md:gap-10">
            {/* صورة مريم من الـ CMS */}
            <SectionReveal variant="slideRight" delay={1} duration={0.8}>
              <div className="relative overflow-hidden rounded-[24px] ">
                {portraitSrc ? (
                  <Image
                    src={portraitSrc}
                    alt={data.displayName || 'Mariam Naoum'}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority // ⬅⬅ هنا
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center text-sm text-black/40">
                    Upload portrait in CMS
                  </div>
                )}
              </div>
            </SectionReveal>
            {/* النص */}
            <SectionReveal variant="slideLeft" delay={1} duration={0.8}>
              <div className="space-y-8 text-[#252525]">
                {/* All About + الخط */}
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <span className="text-lg italic font-bold   text-black whitespace-nowrap">
                      {data.allAboutLabel || 'All About'}
                    </span>
                    <div className="h-px flex-1 bg-black" />
                  </div>

                  {/* MARIAM + الخط الصغير */}
                  <div className="space-y-2">
                    <h1 className="italic text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[0.20em]">
                      {data.displayName || 'MARIAM  NAOUM'}
                    </h1>
                    <div className=" w-full h-px bg-black" />
                  </div>
                </div>

                {/* عمودين باراجرافس من الـ richText */}
                <div
                  className={`grid gap-6 ${data?.rightColumn?.root?.children[0]?.children?.length ? 'md:grid-cols-2' : ''} md:gap-8`}
                >
                  <div
                    className={`space-y-4 ${data?.rightColumn?.root?.children[0]?.children?.length ? '' : 'md:w-[70%]'}`}
                  >
                    <RichColumn value={data.leftColumn} />
                  </div>
                  <div className="space-y-4">
                    <RichColumn value={data.rightColumn} />
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </PageContentReveal>
      </section>
    </SectionReveal>
  )
}

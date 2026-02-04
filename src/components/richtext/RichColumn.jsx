'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { imgUrl } from '@/lib/cms'

export default function RichColumn({ value, textColor }) {
  let nodes = []
  if (Array.isArray(value)) nodes = value
  else if (value?.root?.children) nodes = value.root.children
  if (!nodes || nodes.length === 0) return null

  const colorClass = textColor ?? 'text-black/80'

  const isInternalHref = (href = '') => href.startsWith('/') && !href.startsWith('//')

  const renderChildren = (children) => {
    if (!Array.isArray(children)) return null

    return children.map((child, idx) => {
      if (!child) return null

      // line break
      if (child.type === 'linebreak') return <br key={idx} />

      // text
      if (child.type === 'text') {
        const text = child.text || child.content || ''
        if (!text) return null

        const format = child.format
        const isBold =
          child.bold ||
          format === 'bold' ||
          (typeof format === 'string' && format.includes('bold')) ||
          (typeof format === 'number' && (format & 1) === 1)

        const isItalic =
          child.italic ||
          format === 'italic' ||
          (typeof format === 'string' && format.includes('italic')) ||
          (typeof format === 'number' && (format & 2) === 2)

        const isUnderline =
          child.underline ||
          format === 'underline' ||
          (typeof format === 'string' && format.includes('underline')) ||
          (typeof format === 'number' && (format & 4) === 4)

        const isStrike =
          child.strikethrough ||
          format === 'strikethrough' ||
          (typeof format === 'string' && format.includes('strikethrough')) ||
          (typeof format === 'number' && (format & 8) === 8)

        let content = text
        if (isItalic) content = <em>{content}</em>
        if (isBold) content = <strong>{content}</strong>
        if (isUnderline) content = <u>{content}</u>
        if (isStrike) content = <s>{content}</s>

        return <span key={idx}>{content}</span>
      }

      // link
      if (child.type === 'link') {
        const href = child.fields?.url || child.url || child.fields?.href || '#'
        const newTab = child.newTab ?? child.fields?.newTab ?? true
        const rel = newTab ? 'noopener noreferrer' : undefined

        return (
          <a
            key={idx}
            href={href}
            className={clsx(
              'underline underline-offset-2 decoration-black/40 hover:decoration-black',
              colorClass,
            )}
            target={newTab ? '_blank' : undefined}
            rel={rel}
          >
            {renderChildren(child.children || [])}
          </a>
        )
      }

      // nested
      if (child.children) return <span key={idx}>{renderChildren(child.children)}</span>

      return null
    })
  }

  const renderNode = (node, index) => {
    if (!node) return null

    // Paragraph
    if (node.type === 'paragraph') {
      // sometimes empty paragraph nodes exist
      const hasChildren = Array.isArray(node.children) && node.children.length > 0
      if (!hasChildren) return <div key={`sp-${index}`} className="h-3" />

      return (
        <p
          key={`p-${index}`}
          className={clsx('text-sm leading-relaxed mb-4 last:mb-0', colorClass)}
        >
          {renderChildren(node.children || [])}
        </p>
      )
    }

    // Headings (heading / heading1..)
    if (node.type === 'heading') {
      const tag = node.tag || 'h2' // lexical often uses tag: 'h1'..'h6'
      const Heading = tag
      const size =
        tag === 'h1'
          ? 'text-2xl md:text-3xl'
          : tag === 'h2'
            ? 'text-xl md:text-2xl'
            : tag === 'h3'
              ? 'text-lg md:text-xl'
              : 'text-base md:text-lg'

      return (
        <Heading key={`h-${index}`} className={clsx('mt-7 mb-3 font-semibold', size, colorClass)}>
          {renderChildren(node.children || [])}
        </Heading>
      )
    }

    // Payload sometimes outputs: { type: 'heading', tag: 'h1' } OR { type:'heading1' }
    if (String(node.type).startsWith('heading')) {
      const lvl = String(node.type).replace('heading', '') || '2'
      const tag = `h${lvl}`
      const Heading = tag
      const size =
        tag === 'h1'
          ? 'text-2xl md:text-3xl'
          : tag === 'h2'
            ? 'text-xl md:text-2xl'
            : tag === 'h3'
              ? 'text-lg md:text-xl'
              : 'text-base md:text-lg'

      return (
        <Heading key={`h2-${index}`} className={clsx('mt-7 mb-3 font-semibold', size, colorClass)}>
          {renderChildren(node.children || [])}
        </Heading>
      )
    }

    if (node.type === 'quote' || node.type === 'blockquote') {
      const isRTL = typeof document !== 'undefined' && document?.dir === 'rtl'

      return (
        <blockquote
          key={`q-${index}`}
          className={clsx('my-6', isRTL ? 'pr-4 md:pr-6' : 'pl-4 md:pl-6')}
        >
          <div
            className={clsx(
              isRTL ? 'border-r-2 pr-4 md:pr-5' : 'border-l-2 pl-4 md:pl-5',
              'border-black/25',
              'text-sm leading-relaxed italic',
              colorClass,
            )}
          >
            {renderChildren(node.children || [])}
          </div>
        </blockquote>
      )
    }

    // Horizontal Rule
    if (node.type === 'horizontalrule' || node.type === 'hr') {
      return <hr key={`hr-${index}`} className="my-8 border-black/15" />
    }

    // List
    if (node.type === 'list') {
      const Tag = node.tag || (node.listType === 'number' ? 'ol' : 'ul')
      return (
        <Tag
          key={`l-${index}`}
          className={clsx(
            'mb-4 list-outside space-y-1',
            Tag === 'ul' ? 'list-disc' : 'list-decimal',
            // RTL support: use margin on the correct side
            'ps-6',
          )}
        >
          {(node.children || []).map((li, liIdx) => (
            <li key={liIdx} className={clsx(colorClass, 'text-sm')}>
              {renderChildren(li.children || [])}
            </li>
          ))}
        </Tag>
      )
    }

    // Upload / Image node
    // Payload Lexical often returns node.type = 'upload' with fields/value/relationTo
    if (node.type === 'upload') {
      const media =
        node.value || node.fields?.value || node.fields?.media || node.media || node.fields || null

      const src = imgUrl(media)
      const alt = media?.alt || media?.filename || 'image'

      if (!src) return null

      return (
        <div
          key={`up-${index}`}
          className="my-6 overflow-hidden rounded-2xl border border-black/10"
        >
          <div className="relative w-full aspect-[16/9] bg-black/5">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 900px"
            />
          </div>
          {media?.caption ? (
            <div className={clsx('px-4 py-3 text-xs', colorClass)}>{media.caption}</div>
          ) : null}
        </div>
      )
    }

    // fallback: if node has children, try render them
    if (node.children) {
      return (
        <div key={`u-${index}`} className={clsx('mb-4', colorClass)}>
          {renderChildren(node.children)}
        </div>
      )
    }

    return null
  }

  return <>{nodes.map(renderNode)}</>
}

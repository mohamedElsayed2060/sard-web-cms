'use client'

export default function RichColumn({ value, textColor }) {
  let nodes = []
  if (Array.isArray(value)) nodes = value
  else if (value?.root?.children) nodes = value.root.children
  if (!nodes || nodes.length === 0) return null

  const colorClass = textColor ?? 'text-black/80'

  const renderChildren = (children) => {
    if (!Array.isArray(children)) return null

    return children.map((child, idx) => {
      if (child.type === 'linebreak') return <br key={idx} />

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

        let content = text
        if (isItalic) content = <em>{content}</em>
        if (isBold) content = <strong>{content}</strong>
        return <span key={idx}>{content}</span>
      }

      if (child.type === 'link') {
        const href = child.fields?.url || child.url || child.fields?.href || '#'
        return (
          <a
            key={idx}
            href={href}
            className="underline underline-offset-2 decoration-black/40 hover:decoration-black"
            target={'_blank'}
            rel={child.newTab ? 'noopener noreferrer' : undefined}
          >
            {renderChildren(child.children || [])}
          </a>
        )
      }

      if (child.children) return <span key={idx}>{renderChildren(child.children)}</span>
      return null
    })
  }

  const renderNode = (node, index) => {
    if (!node) return null

    if (node.type === 'paragraph') {
      return (
        <p
          key={`p-${index}`}
          className={`text-sm leading-relaxed ${colorClass} mb-4 last:mb-0 rich-text`}
        >
          {renderChildren(node.children || [])}
        </p>
      )
    }

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

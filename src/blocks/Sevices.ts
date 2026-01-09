import { Block } from 'payload'

export const Services: Block = {
  slug: 'services',
  labels: { singular: 'Services', plural: 'Services Sections' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (optional)' },
    { name: 'title', type: 'text', required: true, defaultValue: 'Services' },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro (optional)',
    },
    {
      name: 'items',
      label: 'Service Items',
      labels: { singular: 'Service', plural: 'Services' },
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media', // نفس Collection الصور عندك
          required: true,
          label: 'Icon / Sketch',
        },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'cta',
      label: 'Top CTA (optional)',
      type: 'group',
      fields: [
        { name: 'text', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'bgTexture',
      label: 'Background texture (optional)',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

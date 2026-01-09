import { Block } from 'payload'

export const HaveYouChecked: Block = {
  slug: 'have-you-checked',
  labels: { singular: 'Have You Checked', plural: 'Have You Checked Sections' },
  fields: [
    { name: 'section_title', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    {
      name: 'bgImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'cta',
      label: 'Button (optional)',
      type: 'group',
      fields: [
        { name: 'text', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'ctaBottom',
      label: 'Button (optional)',
      type: 'group',
      fields: [
        { name: 'text', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}

import { Block } from 'payload'

export const TextWithImage: Block = {
  slug: 'text-with-image',
  labels: { singular: 'Text + Image', plural: 'Text + Image Sections' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imageSide',
      label: 'Image Side',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
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
    { name: 'bgColor', label: 'Background Color (hex)', type: 'text' },
  ],
}

import { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero Sections' },
  fields: [
    {
      name: 'bgImage',
      label: 'Background Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'overlayImage',
      label: 'Overlay/Gradient Image (optional)',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
    {
      name: 'cta',
      label: 'Primary Button',
      type: 'group',
      fields: [
        { name: 'text', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'align',
      label: 'Text Alignment',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'height',
      label: 'Hero Height',
      type: 'select',
      defaultValue: 'lg',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'

const SardWriterRoomServices: GlobalConfig = {
  slug: 'sard-writer-room-services',
  label: 'Sard Writer Room · Services',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'titleEn',
      label: 'Title (EN)',
      type: 'text',
      required: true,
      defaultValue: 'Services Include',
    },
    {
      name: 'titleAr',
      label: 'Title (AR)',
      type: 'text',
      required: true,
      defaultValue: 'تشمل الخدمات',
    },

    {
      name: 'items',
      label: 'Services',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'labelEn',
          label: 'Label (EN)',
          type: 'text',
          required: true,
        },
        {
          name: 'labelAr',
          label: 'Label (AR)',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          defaultValue: 'pen',
          options: [
            { label: 'Pen / Writing', value: 'pen' },
            { label: 'Edit / Doctoring', value: 'edit' },
            { label: 'Clapperboard / Film', value: 'film' },
            { label: 'Lightbulb / Development', value: 'idea' },
            { label: 'Users / Mentorship', value: 'users' },
            { label: 'Sparkle / Special', value: 'sparkle' },
          ],
        },
        {
          name: 'art',
          label: 'Illustration (SVG/PNG)',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: { description: 'Prefer SVG or transparent PNG.' },
        },
        {
          name: 'anim',
          label: 'Animation',
          type: 'select',
          defaultValue: 'float',
          options: [
            { label: 'Float', value: 'float' },
            { label: 'Clapper (open/close)', value: 'clapper' },
            { label: 'Pen (write)', value: 'pen' },
            { label: 'Sparkle', value: 'sparkle' },
          ],
        },
        {
          name: 'sortOrder',
          label: 'Sort order',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
}

export default SardWriterRoomServices

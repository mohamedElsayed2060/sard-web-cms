// cms/src/globals/SardProductionAbout.ts
import type { GlobalConfig } from 'payload'

const SardWriterAbout: GlobalConfig = {
  slug: 'sard-writer-about-hero',
  label: 'Sard Writer About (Hero)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'portrait',
      label: 'Portrait image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    // ✅ NEW (optional)
    {
      name: 'portraitAr',
      label: 'Portrait image (AR - optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    {
      name: 'allAboutLabel',
      label: '"All About" label',
      type: 'group',
      fields: [
        { name: 'en', type: 'text', defaultValue: 'All About' },
        { name: 'ar', type: 'text', defaultValue: 'كل ما يتعلق بـ' },
      ],
    },
    {
      name: 'displayName',
      label: 'Display name',
      type: 'group',
      fields: [
        { name: 'en', type: 'text', required: true, defaultValue: '' },
        { name: 'ar', type: 'text', required: true, defaultValue: '' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftColumn',
          label: 'Left column text',
          type: 'group',
          fields: [
            { name: 'en', type: 'richText', required: true },
            { name: 'ar', type: 'richText', required: true },
          ],
        },
        {
          name: 'rightColumn',
          label: 'Right column text',
          type: 'group',
          fields: [
            { name: 'en', type: 'richText' },
            { name: 'ar', type: 'richText' },
          ],
        },
      ],
    },
  ],
}

export default SardWriterAbout

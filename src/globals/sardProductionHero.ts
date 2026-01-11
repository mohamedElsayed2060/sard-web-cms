// cms/src/globals/SardProductionAbout.ts
import type { GlobalConfig } from 'payload'

const SardProductionAbout: GlobalConfig = {
  slug: 'sard-production-about-hero',
  label: 'Sard Production About (Hero)',
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
    {
      name: 'allAboutLabel',
      label: '"All About" label',
      type: 'text',
      defaultValue: 'All ',
    },
    {
      name: 'displayName',
      label: 'Display name',
      type: 'text',
      required: true,
      defaultValue: 'Sard Production',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftColumn',
          label: 'Left column text',
          type: 'richText',
          required: true,
        },
        {
          name: 'rightColumn',
          label: 'Right column text',
          type: 'richText',
          required: false,
        },
      ],
    },
  ],
}

export default SardProductionAbout

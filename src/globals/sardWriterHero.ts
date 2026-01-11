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
      defaultValue: "Sard Writer's Room",
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

export default SardWriterAbout

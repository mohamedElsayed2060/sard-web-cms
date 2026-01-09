// cms/src/globals/mariamAbout.ts
import type { GlobalConfig } from 'payload'

const MariamAbout: GlobalConfig = {
  slug: 'mariam-about',
  label: 'About Mariam (Hero)',
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
      defaultValue: 'All About',
    },
    {
      name: 'displayName',
      label: 'Display name',
      type: 'text',
      required: true,
      defaultValue: 'MARIAM NAOUM',
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
          required: true,
        },
      ],
    },
  ],
}

export default MariamAbout

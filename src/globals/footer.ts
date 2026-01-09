// cms/src/globals/SiteFooter.ts
import type { GlobalConfig } from 'payload'

const SiteFooter: GlobalConfig = {
  slug: 'site-footer',
  label: 'Site Footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logoLeft',
      label: 'Left Logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoLeftAlt',
      label: 'Left Logo Alt Text',
      type: 'text',
      defaultValue: 'Sard',
    },
    {
      name: 'logoRight',
      label: 'Right Logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoRightAlt',
      label: 'Right Logo Alt Text',
      type: 'text',
      defaultValue: 'Sard icon',
    },
    {
      name: 'links',
      label: 'Footer Links',
      type: 'array',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'URL / Path',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'copyright',
      label: 'Copyright Text',
      type: 'text',
      required: true,
      defaultValue: 'Copyright © 2025',
    },
  ],
}
export default SiteFooter

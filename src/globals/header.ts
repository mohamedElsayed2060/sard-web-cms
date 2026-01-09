// cms/src/globals/SiteHeader.ts
import type { GlobalConfig } from 'payload'

const SiteHeader: GlobalConfig = {
  slug: 'site-header',
  label: 'Site Header',
  access: {
    read: () => true, // الهيدر متاح للفرونت
  },
  fields: [
    {
      name: 'logoLarge',
      label: 'Main Logo (left)',
      type: 'upload',
      relationTo: 'media', // عدّل لو اسم كولكشن الصور مختلف
      required: true,
    },
    {
      name: 'logoLargeAlt',
      label: 'Main Logo Alt Text',
      type: 'text',
      defaultValue: 'Sard',
    },
    {
      name: 'logoSmall',
      label: 'Menu Icon (right)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoSmallAlt',
      label: 'Menu Icon Alt Text',
      type: 'text',
      defaultValue: 'Menu',
    },
    {
      name: 'links',
      label: 'Navigation Links',
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
          defaultValue: '/',
        },
      ],
    },
  ],
}
export default SiteHeader

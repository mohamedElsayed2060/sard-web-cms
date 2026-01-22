// cms/src/globals/SiteHeader.ts
import type { GlobalConfig } from 'payload'

const SiteHeader: GlobalConfig = {
  slug: 'site-header',
  label: 'Site Header',
  access: { read: () => true },
  fields: [
    {
      name: 'logoLarge',
      label: 'Main Logo (left)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'logoLargeAlt', label: 'Main Logo Alt Text', type: 'text', defaultValue: 'Sard' },

    {
      name: 'logoSmall',
      label: 'Menu Icon (right)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    { name: 'logoSmallAlt', label: 'Menu Icon Alt Text', type: 'text', defaultValue: 'Menu' },

    {
      name: 'links',
      label: 'Navigation Links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'group',
          fields: [
            { name: 'en', type: 'text', required: true },
            { name: 'ar', type: 'text', required: true },
          ],
        },
        {
          name: 'href',
          label: 'URL / Path (no /en or /ar)',
          type: 'text',
          required: true,
          defaultValue: '/',
          admin: {
            description: 'Example: /about-sard (Do NOT include /en or /ar)',
          },
        },
      ],
    },

    // ✅ NEW: Social
    {
      name: 'social',
      label: 'Social Links',
      type: 'array',
      labels: { singular: 'Social Link', plural: 'Social Links' },
      admin: { description: 'Icons will show in the menu footer' },
      fields: [
        {
          name: 'label',
          label: 'Label (optional)',
          type: 'text',
          required: false,
        },
        {
          name: 'href',
          label: 'URL',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default SiteHeader

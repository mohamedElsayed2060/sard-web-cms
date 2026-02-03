// cms/src/globals/SiteFooter.ts
import type { GlobalConfig } from 'payload'

const SiteFooter: GlobalConfig = {
  slug: 'site-footer',
  label: 'Site Footer',
  access: { read: () => true },
  fields: [
    // ===== Logos (EN required, AR optional) =====
    {
      name: 'logoLeftEn',
      label: 'Left Logo (EN)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoLeftAr',
      label: 'Left Logo (AR) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoLeftAltEn',
      label: 'Left Logo Alt Text (EN)',
      type: 'text',
      defaultValue: 'Sard',
    },
    {
      name: 'logoLeftAltAr',
      label: 'Left Logo Alt Text (AR)',
      type: 'text',
      defaultValue: 'سارد',
    },

    {
      name: 'logoRightEn',
      label: 'Right Logo (EN)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoRightAr',
      label: 'Right Logo (AR) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'logoRightAltEn',
      label: 'Right Logo Alt Text (EN)',
      type: 'text',
      defaultValue: 'Sard icon',
    },
    {
      name: 'logoRightAltAr',
      label: 'Right Logo Alt Text (AR)',
      type: 'text',
      defaultValue: 'أيقونة سارد',
    },

    // ===== Links (EN/AR labels) =====
    {
      name: 'links',
      label: 'Footer Links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
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
          name: 'href',
          label: 'URL / Path',
          type: 'text',
          required: true,
        },
      ],
    },

    // ===== Copyright (EN/AR) =====
    {
      name: 'copyrightEn',
      label: 'Copyright Text (EN)',
      type: 'text',
      required: true,
      defaultValue: 'Copyright © 2025',
    },
    {
      name: 'copyrightAr',
      label: 'Copyright Text (AR)',
      type: 'text',
      required: true,
      defaultValue: 'حقوق النشر © 2025',
    },
  ],
}

export default SiteFooter

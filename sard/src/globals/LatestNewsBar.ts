// cms/src/globals/LatestNewsBar.ts
import type { GlobalConfig } from 'payload'

const LatestNewsBar: GlobalConfig = {
  slug: 'latest-news-bar',
  label: 'Latest News Bar',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      label: 'Enabled',
      type: 'checkbox',
      defaultValue: true,
    },

    // ستايل بسيط اختياري
    {
      name: 'accentColor',
      label: 'Accent Color (hex)',
      type: 'text',
      defaultValue: '#871D3F',
      required: false,
    },

    {
      name: 'items',
      label: 'News Items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'isActive',
          label: 'Active',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'order',
          label: 'Order',
          type: 'number',
          defaultValue: 0,
        },

        // صورة/ثَمبنيل
        {
          name: 'thumb',
          label: 'Thumbnail',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },

        // Date (نكتبها كنص علشان format يبقى مرن زي الصورة: "Feb 28")
        {
          name: 'dateText',
          label: 'Date text (e.g. Feb 28)',
          type: 'text',
          required: false,
        },

        // Title EN/AR
        {
          name: 'titleEn',
          label: 'Title (EN)',
          type: 'text',
          required: true,
        },
        {
          name: 'titleAr',
          label: 'Title (AR)',
          type: 'text',
          required: true,
        },

        // Summary EN/AR
        {
          name: 'summaryEn',
          label: 'Summary (EN)',
          type: 'textarea',
          required: false,
        },
        {
          name: 'summaryAr',
          label: 'Summary (AR)',
          type: 'textarea',
          required: false,
        },

        // Link
        {
          name: 'href',
          label: 'Link (internal "/about-sard" or external "https://...")',
          type: 'text',
          required: false,
        },
        {
          name: 'newTab',
          label: 'Open in new tab',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}

export default LatestNewsBar

// cms/src/collections/News.ts
import type { CollectionConfig } from 'payload'

const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News Item', plural: 'News' },
  admin: {
    useAsTitle: 'titleEn',
    defaultColumns: ['titleEn', 'titleAr', 'slug', 'publishedAt', 'isActive', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
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

    {
      name: 'slug',
      label: 'Slug (unique)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Used in frontend: /news/<slug>',
      },
    },

    {
      name: 'publishedAt',
      label: 'Published at',
      type: 'date',
      required: false,
    },

    {
      name: 'coverImage',
      label: 'Cover Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'coverHeightPreset',
      label: 'Cover height',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Compact', value: 'compact' },
        { label: 'Tall', value: 'tall' },
      ],
    },
    {
      name: 'excerptEn',
      label: 'Excerpt (EN) (optional)',
      type: 'textarea',
      required: false,
    },
    {
      name: 'excerptAr',
      label: 'Excerpt (AR) (optional)',
      type: 'textarea',
      required: false,
    },

    {
      name: 'contentEn',
      label: 'Content (EN)',
      type: 'richText',
      required: true,
    },
    {
      name: 'contentAr',
      label: 'Content (AR)',
      type: 'richText',
      required: true,
    },
    {
      name: 'media',
      label: 'Media (optional)',
      type: 'group',
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'External Link', value: 'external' },
            { label: 'Direct Video (mp4/webm)', value: 'direct' },
          ],
        },
        {
          name: 'url',
          label: 'Video URL',
          type: 'text',
          required: false,
          admin: {
            description:
              'Paste the full video URL (YouTube/Vimeo/Facebook). For External Link: any URL.',
            condition: (_, siblingData) => siblingData?.type !== 'none',
          },
        },
      ],
    },
    {
      name: 'poster',
      label: 'Poster image (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'direct',
      },
    },

    // Source (اختياري حتى لو الخبر داخلي… لو جاي من موقع تاني حطه هنا)
    {
      name: 'sources',
      label: 'Sources (optional)',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Label (optional)',
          type: 'text',
          required: false,
          admin: { description: 'e.g., Netflix, Ahram, Instagram' },
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Add one or more sources. You can reorder them.',
      },
    },
    {
      name: 'relatedNews',
      label: 'You may also like (ordered)',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'news',
          label: 'News item',
          type: 'relationship',
          relationTo: 'news',
          required: true,
        },
      ],
    },
    {
      name: 'displayOrder',
      label: 'Display order (optional)',
      type: 'number',
      required: false,
      admin: { description: 'Lower comes first. Leave empty to rely on publishedAt.' },
    },

    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  defaultSort: '-publishedAt',
}

export default News

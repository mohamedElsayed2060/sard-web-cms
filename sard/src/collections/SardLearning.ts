// cms/src/collections/SardLearning.ts
import type { CollectionConfig } from 'payload'

const SardLearning: CollectionConfig = {
  slug: 'sard-learning',
  labels: {
    singular: 'Sard Learning',
    plural: 'Sard Learning',
  },
  admin: {
    useAsTitle: 'titleEn',
    defaultColumns: ['titleEn', 'sortOrder'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ===== NEW ONLY (EN/AR) =====
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
      label: 'Slug (for tabs)',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'subTitleEn',
      label: 'Sub Title (EN)',
      type: 'text',
      required: false,
    },
    {
      name: 'subTitleAr',
      label: 'Sub Title (AR)',
      type: 'text',
      required: false,
    },

    // ===== Posters (EN/AR uploads) =====
    {
      name: 'posterEn',
      label: 'Main poster (EN)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'posterAr',
      label: 'Main poster (AR)',
      type: 'upload',
      relationTo: 'media',
      required: false, // ✅ "ممكن يحطها" (اختياري)
    },

    // ===== Media (commented) EN/AR =====
    // {
    //   name: 'media',
    //   label: 'Stills / Media',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'type',
    //       label: 'Type',
    //       type: 'select',
    //       defaultValue: 'image',
    //       options: [
    //         { label: 'Image', value: 'image' },
    //         { label: 'Video', value: 'video' },
    //       ],
    //     },
    //     {
    //       name: 'thumbEn',
    //       label: 'Image / Video thumbnail (EN)',
    //       type: 'upload',
    //       relationTo: 'media',
    //       required: true,
    //     },
    //     {
    //       name: 'thumbAr',
    //       label: 'Image / Video thumbnail (AR)',
    //       type: 'upload',
    //       relationTo: 'media',
    //       required: false, // ✅ اختياري
    //     },
    //     {
    //       name: 'videoUrl',
    //       label: 'Video URL (optional)',
    //       type: 'text',
    //       admin: {
    //         condition: (_, siblingData) => siblingData?.type === 'video',
    //       },
    //     },
    //   ],
    // },

    // ===== RichText columns EN/AR =====
    {
      type: 'row',
      fields: [
        {
          name: 'leftColumnEn',
          label: 'Left column text (EN)',
          type: 'richText',
          required: true,
        },
        {
          name: 'rightColumnEn',
          label: 'Right column text (EN)',
          type: 'richText',
          required: false,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftColumnAr',
          label: 'Left column text (AR)',
          type: 'richText',
          required: true,
        },
        {
          name: 'rightColumnAr',
          label: 'Right column text (AR)',
          type: 'richText',
          required: false,
        },
      ],
    },

    // ===== Cast EN/AR =====
    {
      name: 'cast',
      label: 'Cast',
      type: 'array',
      fields: [
        {
          name: 'nameEn',
          label: 'Name (EN)',
          type: 'text',
          required: true,
        },
        {
          name: 'nameAr',
          label: 'Name (AR)',
          type: 'text',
          required: true,
        },
      ],
    },

    {
      name: 'sortOrder',
      label: 'Sort order',
      type: 'number',
      defaultValue: 0,
    },
  ],
  defaultSort: 'sortOrder',
}

export default SardLearning

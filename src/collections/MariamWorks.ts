// cms/src/collections/MariamWorks.ts
import type { CollectionConfig } from 'payload'

const MariamWorks: CollectionConfig = {
  slug: 'mariam-works',
  labels: {
    singular: 'Mariam Work',
    plural: 'Mariam Works',
  },
  admin: {
    // أسهل للـ Admin: العنوان الظاهر يبقى Title EN
    useAsTitle: 'titleEn',
    defaultColumns: ['titleEn', 'year', 'directorEn', 'sortOrder'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ===== Titles (NEW ONLY) =====
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
      name: 'year',
      label: 'Year',
      type: 'number',
      required: true,
    },

    // ===== Director (NEW ONLY) =====
    {
      name: 'directorEn',
      label: 'Director (EN)',
      type: 'text',
      required: true,
    },
    {
      name: 'directorAr',
      label: 'Director (AR)',
      type: 'text',
      required: true,
    },

    // ===== Posters (EN/AR uploads) =====
    {
      name: 'posterEn',
      label: 'Main Poster (EN)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'posterAr',
      label: 'Main Poster (AR)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    // ===== Media (thumb EN/AR uploads) =====
    {
      name: 'media',
      label: 'Stills / Media',
      type: 'array',
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },

        // ✅ Upload للثَمب إنجليزي
        {
          name: 'thumbEn',
          label: 'Thumbnail (EN)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },

        // ✅ Upload للثَمب عربي
        {
          name: 'thumbAr',
          label: 'Thumbnail (AR)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },

        {
          name: 'videoUrl',
          label: 'Video URL (optional)',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
          },
        },
      ],
    },

    // ===== Cast (NEW ONLY) =====
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

export default MariamWorks

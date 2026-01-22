// cms/src/collections/Galleries.ts
import type { CollectionConfig } from 'payload'

const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  admin: {
    useAsTitle: 'titleEn',
    defaultColumns: ['titleEn', 'slug', 'isActive', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
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
        description: 'Use this slug in the frontend (e.g. about-sard-newest-production).',
      },
    },

    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
    },

    // Section heading (optional)
    {
      name: 'sectionTitleEn',
      label: 'Section title (EN) (optional)',
      type: 'text',
    },
    {
      name: 'sectionTitleAr',
      label: 'Section title (AR) (optional)',
      type: 'text',
    },
    {
      name: 'sectionDescriptionEn',
      label: 'Section description (EN) (optional)',
      type: 'textarea',
    },
    {
      name: 'sectionDescriptionAr',
      label: 'Section description (AR) (optional)',
      type: 'textarea',
    },

    {
      name: 'items',
      label: 'Gallery items',
      type: 'array',
      minRows: 1,
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
          name: 'descriptionEn',
          label: 'Description (EN) (optional)',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          label: 'Description (AR) (optional)',
          type: 'textarea',
        },

        // Background image EN/AR
        {
          name: 'backgroundEn',
          label: 'Background image (EN)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'backgroundAr',
          label: 'Background image (AR) (optional)',
          type: 'upload',
          relationTo: 'media',
          required: false, // ✅ اختياري
        },
        {
          name: 'directorEn',
          label: 'Director (EN)',
          type: 'text',
        },
        {
          name: 'directorAr',
          label: 'Director (AR)',
          type: 'text',
        },
        {
          name: 'videoUrl',
          label: 'Video URL (optional)',
          type: 'text',
          admin: {
            description:
              'YouTube link or direct mp4/webm link. If empty, play button can be hidden.',
          },
        },

        {
          name: 'sortOrder',
          label: 'Sort order',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
  defaultSort: '-updatedAt',
}

export default Galleries

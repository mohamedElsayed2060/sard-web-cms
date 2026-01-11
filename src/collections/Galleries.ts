// src/collections/Galleries.ts
import type { CollectionConfig } from 'payload'

const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isActive', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
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
    {
      name: 'sectionTitle',
      label: 'Section title (optional)',
      type: 'text',
    },
    {
      name: 'sectionDescription',
      label: 'Section description (optional)',
      type: 'textarea',
    },
    {
      name: 'items',
      label: 'Gallery items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
        },
        {
          name: 'background',
          label: 'Background image',
          type: 'upload',
          relationTo: 'media',
          required: true,
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

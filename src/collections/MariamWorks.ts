// cms/src/collections/MariamWorks.ts
import type { CollectionConfig } from 'payload'

const MariamWorks: CollectionConfig = {
  slug: 'mariam-works',
  labels: {
    singular: 'Mariam Work',
    plural: 'Mariam Works',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'director', 'sortOrder'],
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
    {
      name: 'director',
      label: 'Director',
      type: 'text',
      required: true,
    },
    {
      name: 'poster',
      label: 'Main poster',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
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
        {
          name: 'thumb',
          label: 'Image / Video thumbnail',
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
    {
      name: 'cast',
      label: 'Cast',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Name',
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

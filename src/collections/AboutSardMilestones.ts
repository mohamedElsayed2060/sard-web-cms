// cms/src/collections/AboutSardMilestones.ts
import type { CollectionConfig } from 'payload'

const AboutSardMilestones: CollectionConfig = {
  slug: 'about-sard-milestones',
  labels: {
    singular: 'About Sard Milestones',
    plural: 'About Sard Milestones',
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
      name: 'subTitle',
      label: 'Sub Title',
      type: 'text',
      required: false,
    },
    {
      name: 'poster',
      label: 'Main poster',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftColumn',
          label: 'Left column text',
          type: 'richText',
          required: true,
        },
        // {
        //   name: 'rightColumn',
        //   label: 'Right column text',
        //   type: 'richText',
        //   required: false,
        // },
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

export default AboutSardMilestones

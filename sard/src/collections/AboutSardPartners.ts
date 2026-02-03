// src/collections/AboutSardPartners.ts
import type { CollectionConfig } from 'payload'

const AboutSardPartners: CollectionConfig = {
  slug: 'about-sard-partners',
  labels: {
    singular: 'About Sard Partners Section',
    plural: 'About Sard Partners Section',
  },
  admin: {
    useAsTitle: 'sectionTitleEn',
    defaultColumns: ['sectionTitleEn', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    {
      name: 'sectionTitleEn',
      label: 'Section Title (EN)',
      type: 'text',
      required: true,
      defaultValue: 'OUR PARTNERS',
    },
    {
      name: 'sectionTitleAr',
      label: 'Section Title (AR)',
      type: 'text',
      required: true,
      defaultValue: 'شركاؤنا',
    },

    {
      name: 'items',
      label: 'Partners Logos',
      type: 'array',
      fields: [
        {
          name: 'logo',
          label: 'Partner Logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'name',
          label: 'Partner Name (optional)',
          type: 'text',
        },
        {
          name: 'isActive',
          label: 'Active',
          type: 'checkbox',
          defaultValue: true,
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
}

export default AboutSardPartners

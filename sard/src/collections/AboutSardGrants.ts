// src/collections/AboutSardGrants.ts
import type { CollectionConfig } from 'payload'

const AboutSardGrants: CollectionConfig = {
  slug: 'about-sard-grants',
  labels: {
    singular: 'About Sard Grants Section',
    plural: 'About Sard Grants Section',
  },
  admin: {
    useAsTitle: 'sectionTitleEn',
    defaultColumns: ['sectionTitleEn', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    // ====== Section header (title + description) ======
    {
      name: 'sectionTitleEn',
      label: 'Section Title (EN)',
      type: 'text',
      required: true,
      defaultValue: 'SARD GRANTS',
    },
    {
      name: 'sectionTitleAr',
      label: 'Section Title (AR)',
      type: 'text',
      required: true,
      defaultValue: 'منح سرد',
    },
    { name: 'descriptionEn', label: 'Description (EN)', type: 'richText' },
    { name: 'descriptionAr', label: 'Description (AR)', type: 'richText' },

    // ====== Slider items ======
    {
      name: 'items',
      label: 'Slider Items',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'year',
          label: 'Year (e.g. 2024)',
          type: 'text',
          required: true,
        },
        {
          name: 'captionEn',
          label: 'Caption under image (EN)',
          type: 'text',
          required: true,
        },
        {
          name: 'captionAr',
          label: 'Caption under image (AR)',
          type: 'text',
        },
        {
          name: 'detailsEn',
          label: 'Modal details (EN)',
          type: 'richText',
        },
        {
          name: 'detailsAr',
          label: 'Modal details (AR)',
          type: 'richText',
        },
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
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

export default AboutSardGrants

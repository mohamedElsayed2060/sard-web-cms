// cms/src/collections/AboutSardAwards.ts
import type { CollectionConfig } from 'payload'

const AboutSardAwards: CollectionConfig = {
  slug: 'about-sard-awards',
  labels: {
    singular: 'About Sard Award',
    plural: 'About Sard Awards',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sortOrder', 'isActive'],
  },
  access: { read: () => true },
  fields: [
    {
      name: 'title',
      label: 'Award name',
      type: 'text',
      required: true,
    },

    // ✅ احتياطي (مش هنستخدمه دلوقتي)
    {
      name: 'description',
      label: 'Description (optional)',
      type: 'richText',
      required: false,
    },

    // ✅ احتياطي (مش هنستخدمه دلوقتي)
    {
      name: 'image',
      label: 'Image (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
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
  defaultSort: 'sortOrder',
}

export default AboutSardAwards

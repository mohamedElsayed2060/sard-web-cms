// cms/src/collections/AboutSardAwards.ts
import type { CollectionConfig } from 'payload'

const AboutSardAwards: CollectionConfig = {
  slug: 'about-sard-awards',
  labels: {
    singular: 'About Sard Award',
    plural: 'About Sard Awards',
  },
  admin: {
    useAsTitle: 'titleEn',
    defaultColumns: ['titleEn', 'titleAr', 'sortOrder', 'isActive'],
  },
  access: { read: () => true },
  fields: [
    // ===== NEW ONLY (EN/AR) =====
    {
      name: 'titleEn',
      label: 'Award name (EN)',
      type: 'text',
      required: true,
    },
    {
      name: 'titleAr',
      label: 'Award name (AR)',
      type: 'text',
      required: true,
    },

    // ===== Description (EN/AR) (optional) =====
    {
      name: 'descriptionEn',
      label: 'Description (EN) (optional)',
      type: 'richText',
      required: false,
    },
    {
      name: 'descriptionAr',
      label: 'Description (AR) (optional)',
      type: 'richText',
      required: false,
    },

    // ===== Images (EN/AR) (optional) =====
    {
      name: 'imageEn',
      label: 'Image (EN) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'imageAr',
      label: 'Image (AR) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false, // ✅ صورة عربي اختياري
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

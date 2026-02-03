// cms/src/collections/TeamMembers.ts
import type { CollectionConfig } from 'payload'

const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  admin: {
    useAsTitle: 'nameEn',
    defaultColumns: ['nameEn', 'nameAr', 'isActive', 'sortOrder', 'displayOn'],
  },
  access: { read: () => true },
  fields: [
    // ===== Names (EN/AR) =====
    { name: 'nameEn', label: 'Name (EN)', type: 'text', required: true },
    { name: 'nameAr', label: 'Name (AR)', type: 'text', required: true },

    // ===== Photos (EN required, AR optional) =====
    {
      name: 'photoEn',
      label: 'Photo (EN)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photoAr',
      label: 'Photo (AR) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false, // ✅ عربي اختياري
    },

    // ===== Badge Icons (optional, EN/AR) =====
    {
      name: 'badgeIconEn',
      label: 'Small badge icon (EN) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'badgeIconAr',
      label: 'Small badge icon (AR) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false, // ✅ عربي اختياري
    },

    // ===== Details RichText (EN/AR) =====
    { name: 'detailsEn', label: 'Details (EN)', type: 'richText', required: true },
    { name: 'detailsAr', label: 'Details (AR)', type: 'richText', required: true },

    // ===== Reusable placement =====
    {
      name: 'displayOn',
      label: 'Show in sections',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['aboutSard'],
      options: [
        { label: 'About Sard', value: 'aboutSard' },
        { label: 'About Mariam', value: 'aboutMariam' },
        { label: 'Home', value: 'home' },
        { label: 'Portfolio', value: 'portfolio' },
      ],
    },

    { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
  ],
  defaultSort: 'sortOrder',
}

export default TeamMembers

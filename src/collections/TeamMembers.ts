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
      required: false,
    },
    {
      name: 'jobTitleEn',
      type: 'text',
      label: 'Job Title (EN)',
      required: false,
    },
    {
      name: 'jobTitleAr',
      type: 'text',
      label: 'Job Title (AR)',
      required: false,
    },

    {
      name: 'shortBioEn',
      type: 'textarea',
      label: 'Short Bio (EN)',
      required: false,
      admin: {
        description: 'Short teaser (1–3 lines). Used on the card instead of cutting from details.',
      },
    },
    {
      name: 'shortBioAr',
      type: 'textarea',
      label: 'Short Bio (AR)',
      required: false,
      admin: {
        description: 'نبذة قصيرة (سطر-٣). تُستخدم في الكارت بدل القص من التفاصيل.',
      },
    },
    {
      name: 'previousWorks',
      type: 'array',
      label: 'Previous Works (List)',
      required: false,
      fields: [
        {
          name: 'titleEn',
          type: 'text',
          label: 'Work Title (EN)',
          required: false,
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Work Title (AR)',
          required: false,
        },
        {
          name: 'year',
          type: 'number',
          label: 'Year (optional)',
          required: false,
          min: 1900,
          max: 2100,
        },
        {
          name: 'type',
          type: 'select',
          label: 'Type (optional)',
          required: false,
          options: [
            { label: 'Series', value: 'series' },
            { label: 'Film', value: 'film' },
            { label: 'Short', value: 'short' },
            { label: 'Program', value: 'program' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link (optional)',
          required: false,
        },
      ],
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
      required: false,
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

// src/collections/LearningHighlights.ts
import type { CollectionConfig } from 'payload'

/**
 * Photo-led events/workshops/programs shown in the Learning page highlights section.
 * This collection is intentionally lightweight (title + years + photos).
 */
const LearningHighlights: CollectionConfig = {
  slug: 'learning-highlights',
  labels: {
    singular: 'Learning Highlight',
    plural: 'Learning Highlights',
  },
  admin: {
    useAsTitle: 'titleEn',
    defaultColumns: ['titleEn', 'endYear', 'sortOrder', 'pinToTop'],
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
      required: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startYear',
          label: 'Start year (optional)',
          type: 'number',
          required: false,
          admin: { width: '50%' },
        },
        {
          name: 'endYear',
          label: 'End year (used for sorting)',
          type: 'number',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'pinToTop',
      label: 'Pin to top (optional)',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'coverImage',
      label: 'Cover image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photos',
      label: 'All photos (flat)',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: false,
    },
    {
      name: 'groups',
      label: 'Optional groups (Day 1 / Day 2...)',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Group title',
          type: 'text',
          required: true,
        },
        {
          name: 'photos',
          label: 'Group photos',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          required: false,
        },
      ],
    },
    {
      name: 'sortOrder',
      label: 'Sort order (tie-breaker)',
      type: 'number',
      defaultValue: 0,
    },
  ],
  // Newest first: pinToTop desc, endYear desc, then sortOrder asc
  defaultSort: '-pinToTop,-endYear,sortOrder',
}

export default LearningHighlights

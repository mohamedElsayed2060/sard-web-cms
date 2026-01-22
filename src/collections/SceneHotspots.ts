// cms/src/collections/SceneHotspots.ts
import type { CollectionConfig } from 'payload'

const SceneHotspots: CollectionConfig = {
  slug: 'scene-hotspots',
  admin: {
    useAsTitle: 'labelEn',
    defaultColumns: ['labelEn', 'labelAr', 'targetPath', 'x', 'y', 'xMobile', 'yMobile', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ===== Label EN/AR =====
    {
      name: 'labelEn',
      label: 'Label (EN)',
      type: 'text',
      required: true,
    },
    {
      name: 'labelAr',
      label: 'Label (AR)',
      type: 'text',
      required: true,
    },

    // ===== Description EN/AR (optional) =====
    {
      name: 'descriptionEn',
      label: 'Description (EN) (optional)',
      type: 'textarea',
      required: false,
    },
    {
      name: 'descriptionAr',
      label: 'Description (AR) (optional)',
      type: 'textarea',
      required: false,
    },

    {
      name: 'x',
      label: 'X Position Desktop (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 50,
    },
    {
      name: 'y',
      label: 'Y Position Desktop (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 50,
    },
    {
      name: 'xMobile',
      label: 'X Position Mobile (%)',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'yMobile',
      label: 'Y Position Mobile (%)',
      type: 'number',
      min: 0,
      max: 100,
    },

    // ✅ هنسيبه language-agnostic (هنضيف /en أو /ar في الفرونت تلقائيًا زي اللي عملناه)
    {
      name: 'targetPath',
      label: 'Target Path (e.g. /about-sard)',
      type: 'text',
      required: true,
      defaultValue: '/about-sard',
    },

    {
      name: 'order',
      label: 'Order',
      type: 'number',
      defaultValue: 0,
    },
  ],
  defaultSort: 'order',
}

export default SceneHotspots

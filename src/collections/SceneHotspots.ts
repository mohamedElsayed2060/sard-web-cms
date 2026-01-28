// cms/src/collections/SceneHotspots.ts
import type { CollectionConfig } from 'payload'

const SceneHotspots: CollectionConfig = {
  slug: 'scene-hotspots',
  admin: {
    useAsTitle: 'labelEn',
    defaultColumns: ['labelEn', 'labelAr', 'targetPath', 'x', 'y', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
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
      label: 'X Position (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 50,
    },
    {
      name: 'y',
      label: 'Y Position (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 50,
    },

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

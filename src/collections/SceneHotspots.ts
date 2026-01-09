// cms/src/collections/SceneHotspots.ts
import type { CollectionConfig } from 'payload'

const SceneHotspots: CollectionConfig = {
  slug: 'scene-hotspots',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'targetPath', 'x', 'y', 'xMobile', 'yMobile'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      label: 'Label',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
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
    {
      name: 'targetPath',
      label: 'Target Path (e.g. /about)',
      type: 'text',
      required: true,
      defaultValue: '/about',
    },
    {
      name: 'order',
      label: 'Order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}

export default SceneHotspots

// cms/src/collections/SceneProps.ts
import type { CollectionConfig } from 'payload'

const SceneProps: CollectionConfig = {
  slug: 'scene-props',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'x', 'y', 'widthPct', 'anchor', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Internal Title',
      type: 'text',
      required: true,
    },

    {
      name: 'image',
      label: 'Prop Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
      name: 'widthPct',
      label: 'Width (% of Canvas Width)',
      type: 'number',
      required: true,
      min: 1,
      max: 100,
      defaultValue: 18,
    },

    {
      name: 'anchor',
      label: 'Anchor',
      type: 'select',
      required: true,
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top', value: 'top' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Bottom Right', value: 'bottom-right' },
      ],
    },

    {
      name: 'rotation',
      label: 'Rotation (deg) (optional)',
      type: 'number',
      defaultValue: 0,
      min: -180,
      max: 180,
    },
    {
      name: 'opacity',
      label: 'Opacity (%) (optional)',
      type: 'number',
      defaultValue: 100,
      min: 0,
      max: 100,
    },
    {
      name: 'blendMode',
      label: 'Blend Mode (optional)',
      type: 'select',
      required: false,
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Multiply', value: 'multiply' },
        { label: 'Screen', value: 'screen' },
        { label: 'Overlay', value: 'overlay' },
      ],
    },

    {
      name: 'order',
      label: 'Order',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'pointerEvents',
      label: 'Pointer Events',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None (recommended)', value: 'none' },
        { label: 'Auto', value: 'auto' },
      ],
    },
  ],
  defaultSort: 'order',
}

export default SceneProps

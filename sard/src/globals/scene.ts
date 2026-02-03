// cms/src/globals/scene.ts
import type { GlobalConfig } from 'payload'

const Scene: GlobalConfig = {
  slug: 'scene',
  label: 'Sard Scene (Home)',
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'title',
      label: 'Internal Title',
      type: 'text',
    },

    // ✅ Background images (EN required, AR optional)
    {
      name: 'backgroundImageEn',
      label: 'Background Image (EN)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'backgroundImageAr',
      label: 'Background Image (AR) (optional)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    // ✅ Hint text (EN/AR)
    {
      name: 'hintEn',
      label: 'Hint Text (EN)',
      type: 'text',
      required: true,
      defaultValue: 'Explore Sard by tapping the glowing points.',
    },
    {
      name: 'hintAr',
      label: 'Hint Text (AR)',
      type: 'text',
      required: true,
      defaultValue: 'استكشف سارد بالضغط على النقاط المضيئة.',
    },

    // ✅ Canvas widths (world size) per breakpoint
    {
      type: 'collapsible',
      label: 'Canvas / Drag Map Settings',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'canvasWidthLg',
          label: 'Canvas width on Large screens (px)',
          type: 'number',
          defaultValue: 1600,
          min: 900,
          max: 5000,
        },
        {
          name: 'canvasWidthMd',
          label: 'Canvas width on Medium screens (px)',
          type: 'number',
          defaultValue: 1400,
          min: 700,
          max: 4000,
        },
        {
          name: 'canvasWidthSm',
          label: 'Canvas width on Small screens (px)',
          type: 'number',
          defaultValue: 1100,
          min: 500,
          max: 3000,
        },
      ],
    },
  ],
}

export default Scene

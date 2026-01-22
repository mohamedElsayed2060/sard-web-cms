// src/globals/scene.ts
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
  ],
}

export default Scene

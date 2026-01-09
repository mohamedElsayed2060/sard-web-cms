// src/globals/scene.ts
import type { GlobalConfig } from 'payload'

const Scene: GlobalConfig = {
  slug: 'scene', // مهم يفضل كده عشان /api/globals/scene
  label: 'Sard Scene (Home)',
  access: {
    read: () => true, // أي حد يقدر يقرى
    update: ({ req }) => !!req.user, // التعديل للمستخدمين اللي لوجين
  },
  fields: [
    {
      name: 'title',
      label: 'Internal Title',
      type: 'text',
    },
    {
      name: 'backgroundImage',
      label: 'Background Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'hint',
      label: 'Hint Text',
      type: 'text',
      defaultValue: 'Explore Sard by tapping the glowing points.',
    },
  ],
}

export default Scene

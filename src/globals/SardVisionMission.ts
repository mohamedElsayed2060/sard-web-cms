// cms/src/globals/SardVisionMission.ts
import type { GlobalConfig } from 'payload'

const SardVisionMission: GlobalConfig = {
  slug: 'sard-vision-mission',
  label: 'Sard Vision & Mission',
  access: { read: () => true },
  fields: [
    {
      name: 'sectionTitleEn',
      label: 'Section title (EN)',
      type: 'text',
      required: true,
      defaultValue: 'VISION & MISSION',
    },
    {
      name: 'sectionTitleAr',
      label: 'Section title (AR)',
      type: 'text',
      required: true,
      defaultValue: 'الرؤية والرسالة',
    },

    {
      type: 'row',
      fields: [
        {
          name: 'vision',
          type: 'group',
          label: 'Vision',
          fields: [
            {
              name: 'titleEn',
              label: 'Title (EN)',
              type: 'text',
              required: true,
              defaultValue: 'Vision Statement',
            },
            {
              name: 'titleAr',
              label: 'Title (AR)',
              type: 'text',
              required: true,
              defaultValue: 'الرؤية',
            },
            { name: 'bodyEn', label: 'Body (EN)', type: 'richText', required: true },
            { name: 'bodyAr', label: 'Body (AR)', type: 'richText', required: true },
          ],
        },

        {
          name: 'mission',
          type: 'group',
          label: 'Mission',
          fields: [
            {
              name: 'titleEn',
              label: 'Title (EN)',
              type: 'text',
              required: true,
              defaultValue: 'Mission Statement',
            },
            {
              name: 'titleAr',
              label: 'Title (AR)',
              type: 'text',
              required: true,
              defaultValue: 'الرسالة',
            },
            { name: 'bodyEn', label: 'Body (EN)', type: 'richText', required: true },
            { name: 'bodyAr', label: 'Body (AR)', type: 'richText', required: true },
          ],
        },

        {
          name: 'values',
          type: 'group',
          label: 'Values',
          fields: [
            {
              name: 'titleEn',
              label: 'Title (EN)',
              type: 'text',
              required: true,
              defaultValue: 'Our Values',
            },
            {
              name: 'titleAr',
              label: 'Title (AR)',
              type: 'text',
              required: true,
              defaultValue: 'قيمنا',
            },
            { name: 'bodyEn', label: 'Body (EN)', type: 'richText', required: true },
            { name: 'bodyAr', label: 'Body (AR)', type: 'richText', required: true },
          ],
        },
      ],
    },
  ],
}

export default SardVisionMission

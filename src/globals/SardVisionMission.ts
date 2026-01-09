// cms/src/globals/SardVisionMission.ts
import type { GlobalConfig } from 'payload'

const SardVisionMission: GlobalConfig = {
  slug: 'sard-vision-mission',
  label: 'Sard Vision & Mission',
  access: { read: () => true },
  fields: [
    {
      name: 'sectionTitle',
      label: 'Section title',
      type: 'text',
      required: true,
      defaultValue: 'VISION & MISSION',
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
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Vision Statement',
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          name: 'mission',
          type: 'group',
          label: 'Mission',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Mission Statement',
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          name: 'values',
          type: 'group',
          label: 'Values',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Our Values',
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

export default SardVisionMission

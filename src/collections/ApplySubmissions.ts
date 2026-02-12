import type { CollectionConfig } from 'payload'

const ApplySubmissions: CollectionConfig = {
  slug: 'apply-submissions',
  labels: {
    singular: 'Apply Submission',
    plural: 'Apply Submissions',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'program', 'createdAt'],
  },
  access: {
    create: () => true, // public can submit
    read: ({ req }) => !!req.user, // admin only
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },

    { name: 'program', type: 'text', required: true },

    { name: 'portfolio', type: 'text', required: false },

    { name: 'message', type: 'textarea', required: true },

    // honeypot
    {
      name: 'company',
      type: 'text',
      required: false,
      admin: { hidden: true },
    },
  ],
}

export default ApplySubmissions

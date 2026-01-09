import type { CollectionConfig } from 'payload'

const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isActive', 'sortOrder', 'displayOn'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },

    // ✅ صورة العضو (الكارت + المودال)
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    // ✅ أيقونة صغيرة جنب الاسم (Course/Badge)
    {
      name: 'badgeIcon',
      label: 'Small badge icon (next to name)',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    // ✅ تفاصيل كاملة RichText (نستخدم منها سطرين في الكارت والباقي داخل المودال)
    { name: 'details', type: 'richText', required: true },

    // ✅ عشان يبقى Reusable لأكتر من مكان
    {
      name: 'displayOn',
      label: 'Show in sections',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['aboutSard'],
      options: [
        { label: 'About Sard', value: 'aboutSard' },
        { label: 'About Mariam', value: 'aboutMariam' },
        { label: 'Home', value: 'home' },
        { label: 'Portfolio', value: 'portfolio' },
      ],
    },

    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  defaultSort: 'sortOrder',
}

export default TeamMembers

// cms/src/globals/learningApplyNow.ts
import type { GlobalConfig } from 'payload'

const learningApplyNow: GlobalConfig = {
  slug: 'learning-apply-now',
  label: 'Learning — Apply Now Section',
  access: { read: () => true },
  fields: [
    {
      name: 'enabled',
      label: 'Enable section',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sectionId',
      label: 'Section ID (used for #hash)',
      type: 'text',
      defaultValue: 'apply-now',
      admin: { readOnly: true },
    },
    {
      name: 'endpoint',
      label: 'Form endpoint',
      type: 'text',
      defaultValue: '/forms/apply',
      required: true,
    },

    // ========= EN =========
    {
      type: 'group',
      name: 'en',
      label: 'English',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Apply Now', required: true },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Fill in the form and we will get back to you.',
          required: false,
        },

        {
          type: 'group',
          name: 'form',
          label: 'Form labels',
          fields: [
            { name: 'nameLabel', type: 'text', defaultValue: 'Full name *', required: true },
            {
              name: 'namePlaceholder',
              type: 'text',
              defaultValue: 'Your full name',
              required: true,
            },

            { name: 'emailLabel', type: 'text', defaultValue: 'Email *', required: true },
            { name: 'emailPlaceholder', type: 'text', defaultValue: 'Your email', required: true },

            { name: 'phoneLabel', type: 'text', defaultValue: 'Phone *', required: true },
            {
              name: 'phonePlaceholder',
              type: 'text',
              defaultValue: 'Your phone number',
              required: true,
            },

            { name: 'programLabel', type: 'text', defaultValue: 'Program *', required: true },
            {
              name: 'programPlaceholder',
              type: 'text',
              defaultValue: 'Select program',
              required: true,
            },

            {
              name: 'programOptions',
              type: 'array',
              fields: [{ name: 'value', type: 'text', required: true }],
              defaultValue: [
                { value: 'Workshop' },
                { value: 'Writers Room' },
                { value: 'Mentorship' },
                { value: 'Course' },
                { value: 'Other' },
              ],
            },

            {
              name: 'portfolioLabel',
              type: 'text',
              defaultValue: 'Portfolio link',
              required: false,
            },
            {
              name: 'portfolioPlaceholder',
              type: 'text',
              defaultValue: 'https://',
              required: false,
            },

            { name: 'messageLabel', type: 'text', defaultValue: 'Message *', required: true },
            {
              name: 'messagePlaceholder',
              type: 'text',
              defaultValue: 'Tell us why you are applying',
              required: true,
            },

            { name: 'applyButton', type: 'text', defaultValue: 'Apply', required: true },
            { name: 'applyingButton', type: 'text', defaultValue: 'Applying…', required: true },
          ],
        },

        {
          type: 'group',
          name: 'messages',
          label: 'Form messages',
          fields: [
            {
              name: 'requiredError',
              type: 'text',
              defaultValue: 'Please fill in the required fields.',
              required: true,
            },
            {
              name: 'successMessage',
              type: 'text',
              defaultValue: 'Application sent successfully.',
              required: true,
            },
            {
              name: 'genericError',
              type: 'text',
              defaultValue: 'Something went wrong. Please try again.',
              required: true,
            },
            {
              name: 'networkError',
              type: 'text',
              defaultValue: 'Network error. Please try again.',
              required: true,
            },
          ],
        },
      ],
    },

    // ========= AR =========
    {
      type: 'group',
      name: 'ar',
      label: 'Arabic',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'قدّم الآن', required: true },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'املأ النموذج وسنقوم بالرد عليك.',
          required: false,
        },

        {
          type: 'group',
          name: 'form',
          label: 'Form labels',
          fields: [
            { name: 'nameLabel', type: 'text', defaultValue: 'الاسم بالكامل *', required: true },
            {
              name: 'namePlaceholder',
              type: 'text',
              defaultValue: 'اكتب اسمك بالكامل',
              required: true,
            },

            {
              name: 'emailLabel',
              type: 'text',
              defaultValue: 'البريد الإلكتروني *',
              required: true,
            },
            {
              name: 'emailPlaceholder',
              type: 'text',
              defaultValue: 'اكتب بريدك الإلكتروني',
              required: true,
            },

            { name: 'phoneLabel', type: 'text', defaultValue: 'رقم الهاتف *', required: true },
            {
              name: 'phonePlaceholder',
              type: 'text',
              defaultValue: 'اكتب رقم الهاتف',
              required: true,
            },

            { name: 'programLabel', type: 'text', defaultValue: 'البرنامج *', required: true },
            {
              name: 'programPlaceholder',
              type: 'text',
              defaultValue: 'اختر البرنامج',
              required: true,
            },

            {
              name: 'programOptions',
              type: 'array',
              fields: [{ name: 'value', type: 'text', required: true }],
              defaultValue: [
                { value: 'ورشة' },
                { value: 'غرفة الكتاب' },
                { value: 'إرشاد/منتورينج' },
                { value: 'دورة' },
                { value: 'أخرى' },
              ],
            },

            { name: 'portfolioLabel', type: 'text', defaultValue: 'رابط الأعمال', required: false },
            {
              name: 'portfolioPlaceholder',
              type: 'text',
              defaultValue: 'https://',
              required: false,
            },

            { name: 'messageLabel', type: 'text', defaultValue: 'رسالتك *', required: true },
            {
              name: 'messagePlaceholder',
              type: 'text',
              defaultValue: 'اكتب سبب التقديم',
              required: true,
            },

            { name: 'applyButton', type: 'text', defaultValue: 'إرسال', required: true },
            { name: 'applyingButton', type: 'text', defaultValue: 'جارٍ الإرسال…', required: true },
          ],
        },

        {
          type: 'group',
          name: 'messages',
          label: 'Form messages',
          fields: [
            {
              name: 'requiredError',
              type: 'text',
              defaultValue: 'من فضلك املأ الحقول المطلوبة.',
              required: true,
            },
            {
              name: 'successMessage',
              type: 'text',
              defaultValue: 'تم إرسال طلبك بنجاح.',
              required: true,
            },
            {
              name: 'genericError',
              type: 'text',
              defaultValue: 'حدث خطأ ما. حاول مرة أخرى.',
              required: true,
            },
            {
              name: 'networkError',
              type: 'text',
              defaultValue: 'مشكلة في الشبكة. حاول مرة أخرى.',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

export default learningApplyNow

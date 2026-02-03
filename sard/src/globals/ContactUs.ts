import type { GlobalConfig } from 'payload'

const ContactUs: GlobalConfig = {
  slug: 'contact-us',
  label: 'Contact Us Page',
  access: { read: () => true },
  fields: [
    {
      type: 'group',
      name: 'en',
      label: 'English',
      fields: [
        // ===== Page Top =====
        { name: 'pageTitle', type: 'text', defaultValue: 'How to Contact us', required: true },

        {
          type: 'group',
          name: 'contactLines',
          label: 'Top Contact Lines',
          fields: [
            { name: 'phoneLabel', type: 'text', defaultValue: 'Phone:', required: true },
            { name: 'phoneValue', type: 'text', defaultValue: '+202 333 51 757', required: true },

            { name: 'emailLabel', type: 'text', defaultValue: 'Email:', required: true },
            {
              name: 'emailValue',
              type: 'text',
              defaultValue: 'mailbox@sard-eg.com',
              required: true,
            },
          ],
        },

        // ===== Left Card (Location + Map) =====
        {
          type: 'group',
          name: 'locationCard',
          label: 'Location Card',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Location', required: true },
            {
              name: 'subtitle',
              type: 'text',
              defaultValue: 'Al Dokki, Giza Governorate, Egypt',
              required: true,
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Google Maps EMBED url (starts with https://www.google.com/maps/embed?pb=...)',
              },
              defaultValue: 'https://www.google.com/maps/embed?pb=REPLACE_ME',
            },
            { name: 'mapHeight', type: 'number', defaultValue: 420, required: true },
          ],
        },

        // ===== Right Card (Form) =====
        {
          type: 'group',
          name: 'formCard',
          label: 'Form Card',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Get in Touch!', required: true },

            // endpoint
            {
              name: 'endpoint',
              type: 'text',
              defaultValue: '/forms/contact',
              required: true,
            },

            // fields labels/placeholders
            { name: 'nameLabel', type: 'text', defaultValue: 'Your name *', required: true },
            { name: 'namePlaceholder', type: 'text', defaultValue: 'Your name', required: true },

            { name: 'emailLabel', type: 'text', defaultValue: 'Your email *', required: true },
            { name: 'emailPlaceholder', type: 'text', defaultValue: 'Your email', required: true },

            { name: 'subjectLabel', type: 'text', defaultValue: 'Subject', required: true },
            { name: 'subjectPlaceholder', type: 'text', defaultValue: 'Subject', required: true },

            { name: 'messageLabel', type: 'text', defaultValue: 'Message *', required: true },
            { name: 'messagePlaceholder', type: 'text', defaultValue: 'Message', required: true },

            // messages
            {
              name: 'requiredError',
              type: 'text',
              defaultValue: 'Please fill in the required fields.',
              required: true,
            },
            {
              name: 'successMessage',
              type: 'text',
              defaultValue: 'Message sent successfully.',
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

            // button text
            { name: 'sendButton', type: 'text', defaultValue: 'Send Message', required: true },
            { name: 'sendingButton', type: 'text', defaultValue: 'Sending…', required: true },
          ],
        },
      ],
    },

    // ===== Arabic =====
    {
      type: 'group',
      name: 'ar',
      label: 'Arabic',
      fields: [
        { name: 'pageTitle', type: 'text', defaultValue: 'كيفية التواصل معنا', required: true },

        {
          type: 'group',
          name: 'contactLines',
          label: 'Top Contact Lines',
          fields: [
            { name: 'phoneLabel', type: 'text', defaultValue: 'الهاتف:', required: true },
            { name: 'phoneValue', type: 'text', defaultValue: '+202 333 51 757', required: true },

            { name: 'emailLabel', type: 'text', defaultValue: 'البريد:', required: true },
            {
              name: 'emailValue',
              type: 'text',
              defaultValue: 'mailbox@sard-eg.com',
              required: true,
            },
          ],
        },

        {
          type: 'group',
          name: 'locationCard',
          label: 'Location Card',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'الموقع', required: true },
            {
              name: 'subtitle',
              type: 'text',
              defaultValue: 'الدقي، محافظة الجيزة، مصر',
              required: true,
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              required: true,
              defaultValue: 'https://www.google.com/maps/embed?pb=REPLACE_ME',
            },
            { name: 'mapHeight', type: 'number', defaultValue: 420, required: true },
          ],
        },

        {
          type: 'group',
          name: 'formCard',
          label: 'Form Card',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'تواصل معنا', required: true },

            { name: 'endpoint', type: 'text', defaultValue: '/forms/contact', required: true },

            { name: 'nameLabel', type: 'text', defaultValue: 'الاسم *', required: true },
            { name: 'namePlaceholder', type: 'text', defaultValue: 'اكتب اسمك', required: true },

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

            { name: 'subjectLabel', type: 'text', defaultValue: 'الموضوع', required: true },
            {
              name: 'subjectPlaceholder',
              type: 'text',
              defaultValue: 'اكتب الموضوع',
              required: true,
            },

            { name: 'messageLabel', type: 'text', defaultValue: 'الرسالة *', required: true },
            {
              name: 'messagePlaceholder',
              type: 'text',
              defaultValue: 'اكتب رسالتك',
              required: true,
            },

            {
              name: 'requiredError',
              type: 'text',
              defaultValue: 'من فضلك املأ الحقول المطلوبة.',
              required: true,
            },
            {
              name: 'successMessage',
              type: 'text',
              defaultValue: 'تم إرسال رسالتك بنجاح.',
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

            { name: 'sendButton', type: 'text', defaultValue: 'إرسال', required: true },
            { name: 'sendingButton', type: 'text', defaultValue: 'جارٍ الإرسال…', required: true },
          ],
        },
      ],
    },
  ],
}

export default ContactUs

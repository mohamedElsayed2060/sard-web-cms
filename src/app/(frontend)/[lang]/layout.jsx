// src/app/(frontend)/[lang]/layout.jsx
import { notFound } from 'next/navigation'

const LANGS = ['en', 'ar']

export default async function LangLayout({ children, params }) {
  const { lang } = await params

  if (!LANGS.includes(lang)) notFound()

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <div lang={lang} dir={dir} className={dir === 'rtl' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  )
}

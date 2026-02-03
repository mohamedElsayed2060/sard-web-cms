export const LANGS = ['en', 'ar']
export const dirOf = (lang) => (lang === 'ar' ? 'rtl' : 'ltr')

export const pick = (field, lang = 'en') => {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field?.[lang] ?? field?.en ?? ''
}

// src/lib/sardNavigation.js

export const DEFAULT_DOORS_TIMINGS = {
  closeMs: 650,
  logoMs: 450,
  openMs: 1100,
  fadeMs: 650,
  maxWaitMs: 8000,
}

export const DEFAULT_STACK_TIMINGS = {
  outMs: 420, // الصفحة الحالية تبدأ تطلع لفوق
  closeMs: 600, // overlay يقفل (درفتين) + يظهر د
  openMs: 400, // overlay يفتح من النص
  fadeMs: 280, // اختفاء بسيط بعد الفتح
  maxWaitMs: 12000,
}

export function getTransitionVariantFromEnv() {
  // ✅ client-safe (NEXT_PUBLIC_)
  const v = (process.env.NEXT_PUBLIC_TRANSITION_VARIANT || 'doors').toLowerCase()
  return v === 'stack' ? 'stack' : 'doors'
}

export const SUPPORTED_LANGS = ['en', 'ar']

export function getLangFromPath(pathname = '') {
  const seg = String(pathname || '').split('/')[1]
  return SUPPORTED_LANGS.includes(seg) ? seg : 'en'
}

export function normalizePathname(input = '') {
  if (!input) return '/'

  let s = String(input)
  try {
    if (s.startsWith('http')) s = new URL(s).pathname
  } catch {}

  s = s.split('?')[0].split('#')[0]

  if (!s.startsWith('/')) s = '/' + s
  if (s.length > 1) s = s.replace(/\/+$/, '')
  return s
}

export function isExternalHref(href = '') {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  )
}

export function isHashOnly(href = '') {
  return href.startsWith('#')
}

export function withLangPrefix(lang, targetPath) {
  const p = String(targetPath || '/').trim()
  if (!p) return '/'

  if (isExternalHref(p) || isHashOnly(p)) return p

  const path = p.startsWith('/') ? p : `/${p}`
  const parts = path.split('/').filter(Boolean)
  const first = parts[0]

  if (SUPPORTED_LANGS.includes(first)) return `/${parts.join('/')}`

  const L = SUPPORTED_LANGS.includes(lang) ? lang : 'en'
  return `/${L}${path}`
}

/**
 * ✅ الموحد: يشتغل doors أو stack حسب ENV
 * - external/hash سيبه طبيعي
 * - same page guard
 * - في doors: runSequence بيقفل/يفتح
 * - في stack: runSequence هيعمل overlay loading + enter/exit
 */
export async function navigateSard({ href, lang, pathname, router, runSequence, timings }) {
  if (!href) return

  const isHrefString = typeof href === 'string'
  const raw = isHrefString ? href : href?.pathname || href?.href || ''

  if (isHrefString && (isExternalHref(raw) || isHashOnly(raw))) return

  const finalHref = isHrefString ? withLangPrefix(lang, raw) : href

  const current = normalizePathname(pathname)
  const next = normalizePathname(
    isHrefString ? finalHref : finalHref?.pathname || finalHref?.href || '',
  )

  if (current === next) return

  await runSequence({
    timings,
    fromPath: pathname,
    onNavigate: async () => router.push(finalHref),
  })
}

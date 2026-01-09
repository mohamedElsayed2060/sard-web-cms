// ✅ IMPORTANT (Unified CMS + Web):
// Node.js `fetch()` (server-side) does NOT accept relative URLs like `/api/...`.
// This lib is imported by BOTH server components and client components, so it MUST stay
// client-safe (no `next/headers` import).
//
// لذلك لازم يبقى عندنا Origin واضح:
// - On Railway/Prod: set NEXT_PUBLIC_CMS_URL to your deployed domain (same service).
// - On local dev: NEXT_PUBLIC_CMS_URL can be http://localhost:3000
const FALLBACK_ORIGIN = 'http://localhost:3000'

export const CMS = (
  process.env.NEXT_PUBLIC_CMS_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : FALLBACK_ORIGIN)
).replace(/\/$/, '')

export const imgUrl = (file) => (file?.url ? file.url : null)

export async function fetchJSON(path) {
  const url = new URL(path, CMS).toString()
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch ${path} (${res.status})`)
  return res.json()
}

export async function getLayoutProps() {
  const [header, footer] = await Promise.all([
    fetchJSON(`/api/globals/site-header?depth=2`).catch(() => null),
    fetchJSON(`/api/globals/site-footer?depth=2`).catch(() => null),
  ])
  return { header, footer }
}

// HOC بسيط يحقن layout في أي getServerSideProps
export function withLayout(gssp) {
  return async (ctx) => {
    const layout = await getLayoutProps()
    const result = (await gssp?.(ctx)) || { props: {} }
    return {
      ...result,
      props: { ...(result.props || {}), layout },
    }
  }
}
export async function getMariamPageData() {
  const [hero, worksRes] = await Promise.all([
    // Global الجديد
    fetchJSON('/api/globals/mariam-about?depth=2'),
    // Collection للأعمال
    fetchJSON('/api/mariam-works?depth=2&limit=50&sort=sortOrder'),
  ])

  const works = worksRes?.docs ?? []

  return { hero, works }
}
export async function getSiteHeader() {
  // slug بتاع الـ Global في Payload
  const data = await fetchJSON('/api/globals/site-header')
  return data
}

export async function getSiteFooter() {
  const data = await fetchJSON('/api/globals/site-footer')
  return data
}
export async function getLearningPageData() {
  const [hero, sardLearning] = await Promise.all([
    // Global الجديد
    fetchJSON('/api/globals/learning-about?depth=2'),
    // Collection للأعمال
    fetchJSON('/api/sard-learning?depth=2&limit=50&sort=sortOrder'),
  ])

  // const works = worksRes?.docs ?? [];

  return {
    hero,
    sardLearning,
  }
}
export async function getTeamMembers(section = 'aboutSard') {
  // Payload where للـ select hasMany:
  // where[displayOn][contains]=aboutSard
  const res = await fetchJSON(
    `/api/team-members?depth=2&limit=50&sort=sortOrder&where[isActive][equals]=true&where[displayOn][contains]=${section}`,
  )

  return res?.docs ?? []
}
export async function getAboutSardPageData() {
  const [hero, sardAboutSard, visionMission, awardsRes, team] = await Promise.all([
    fetchJSON('/api/globals/sard-milestones-about?depth=2'),
    fetchJSON('/api/about-sard-milestones?depth=2&limit=50&sort=sortOrder'),
    fetchJSON('/api/globals/sard-vision-mission?depth=2'),
    fetchJSON('/api/about-sard-awards?depth=2&limit=50&sort=sortOrder'),
    getTeamMembers('aboutSard'),
  ])

  return {
    hero,
    sardAboutSard,
    visionMission,
    awards: awardsRes?.docs ?? [],
    team,
  }
}

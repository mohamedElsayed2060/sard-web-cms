// ✅ IMPORTANT (Unified CMS + Web):
// Node.js `fetch()` (server-side) does NOT accept relative URLs like `/api/...`.
// This lib is imported by BOTH server components and client components, so it MUST stay
// client-safe (no `next/headers` import).
//
// لذلك لازم يبقى عندنا Origin واضح:
// - On Railway/Prod: set NEXT_PUBLIC_CMS_URL to your deployed domain (same service).
// - On local dev: NEXT_PUBLIC_CMS_URL can be http://localhost:3000
const FALLBACK_ORIGIN = 'http://localhost:3000'
const DEFAULT_REVALIDATE = Number(process.env.CMS_REVALIDATE_SECONDS ?? 60)
const RV = Number.isFinite(DEFAULT_REVALIDATE) ? DEFAULT_REVALIDATE : 60
export const CMS = (
  process.env.NEXT_PUBLIC_CMS_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : FALLBACK_ORIGIN)
).replace(/\/$/, '')

export const imgUrl = (file) => (file?.url ? file.url : null)

export async function fetchJSON(path, options = {}) {
  const { revalidate, tags, cache: cacheOverride, ...init } = options || {}

  const url = new URL(path, CMS).toString()

  // لو فيه revalidate/tags هنخليها قابلة للكاش
  const cache =
    cacheOverride ??
    (typeof revalidate === 'number' || (Array.isArray(tags) && tags.length)
      ? 'force-cache'
      : 'no-store')

  const next =
    typeof revalidate === 'number' || (Array.isArray(tags) && tags.length)
      ? {
          ...(typeof revalidate === 'number' ? { revalidate } : null),
          ...(Array.isArray(tags) && tags.length ? { tags } : null),
          ...(init.next || {}),
        }
      : init.next

  const res = await fetch(url, {
    ...init,
    cache,
    ...(next ? { next } : null),
  })

  if (!res.ok) throw new Error(`Failed to fetch ${path} (${res.status})`)
  return res.json()
}

export async function getLayoutProps() {
  const [header, footer] = await Promise.all([
    fetchJSON(`/api/globals/site-header?depth=2`, {
      revalidate: RV,
      tags: ['global:site-header'],
    }).catch(() => null),
    fetchJSON(`/api/globals/site-footer?depth=2`, {
      revalidate: RV,
      tags: ['global:site-footer'],
    }).catch(() => null),
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
    fetchJSON('/api/globals/mariam-about?depth=2', {
      revalidate: RV,
      tags: ['global:mariam-about'],
    }),
    fetchJSON('/api/mariam-works?depth=2&limit=50&sort=sortOrder', {
      revalidate: RV,
      tags: ['collection:mariam-works'],
    }),
  ])

  const works = worksRes?.docs ?? []

  return { hero, works }
}
export async function getSiteHeader() {
  // slug بتاع الـ Global في Payload
  const data = await fetchJSON('/api/globals/site-header', {
    revalidate: RV,
    tags: ['global:site-header'],
  })
  return data
}

export async function getSiteFooter() {
  const data = await fetchJSON('/api/globals/site-footer', {
    revalidate: RV,
    tags: ['global:site-footer'],
  })
  return data
}
export async function getLearningPageData() {
  const [hero, sardLearning] = await Promise.all([
    fetchJSON('/api/globals/learning-about?depth=2', {
      revalidate: RV,
      tags: ['global:learning-about'],
    }),
    fetchJSON('/api/sard-learning?depth=2&limit=50&sort=sortOrder', {
      revalidate: RV,
      tags: ['collection:sard-learning'],
    }),
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
    { revalidate: RV, tags: [`collection:team-members:${section}`] },
  )

  return res?.docs ?? []
}

// ===== Galleries (Reusable carousel data) =====
export async function getGalleryBySlug(slug) {
  if (!slug) return null
  const safe = encodeURIComponent(slug)
  const res = await fetchJSON(`/api/galleries?depth=2&limit=1&where[slug][equals]=${safe}`, {
    revalidate: RV,
    tags: [`collection:galleries:${slug}`],
  })
  return res?.docs?.[0] ?? null
}

export async function getAboutSardPageData() {
  const [
    hero,
    // sardAboutSard, // this sard work removed
    visionMission,
    awardsRes,
    grantsRes, // ✅ NEW
    partnersRes,
    team,
    newestProduction,
  ] = await Promise.all([
    fetchJSON('/api/globals/sard-milestones-about?depth=2', {
      revalidate: RV,
      tags: ['global:sard-milestones-about'],
    }),
    fetchJSON('/api/globals/sard-vision-mission?depth=2', {
      revalidate: RV,
      tags: ['global:sard-vision-mission'],
    }),
    fetchJSON('/api/about-sard-awards?depth=2&limit=50&sort=sortOrder', {
      revalidate: RV,
      tags: ['collection:about-sard-awards'],
    }),

    // ✅ About Sard Grants (single doc in collection)
    fetchJSON('/api/about-sard-grants?depth=2&limit=1', {
      revalidate: RV,
      tags: ['collection:about-sard-grants'],
    }),
    // ✅ partners doc
    fetchJSON('/api/about-sard-partners?depth=2&limit=1', {
      revalidate: RV,
      tags: ['collection:about-sard-partners'],
    }),
    getTeamMembers('aboutSard'),
    // ✅ Reusable gallery doc slug (create it from Payload admin)
    getGalleryBySlug('about-sard-newest-production'),
  ])
  console.log(grantsRes?.docs[0])

  return {
    hero,
    // sardAboutSard,
    visionMission,
    awards: awardsRes?.docs ?? [],
    grantsDoc: grantsRes?.docs?.[0] ?? null, // ✅ NEW
    partnersDoc: partnersRes?.docs?.[0] ?? null,
    team,
    newestProduction,
  }
}

export async function getSardProductionPageData() {
  const [header, footer, gallery, hero] = await Promise.all([
    fetchJSON('/api/globals/site-header?depth=2', { revalidate: RV, tags: ['global:site-header'] }),
    fetchJSON('/api/globals/site-footer?depth=2', { revalidate: RV, tags: ['global:site-footer'] }),
    getGalleryBySlug('sard-production-gallery'),
    fetchJSON('/api/globals/sard-production-about-hero?depth=2', {
      revalidate: RV,
      tags: ['global:sard-production-about-hero'],
    }),
  ])

  return {
    header,
    footer,
    gallery,
    hero,
  }
}
export async function getSardWriterRoomPageData() {
  const [header, footer, gallery, hero] = await Promise.all([
    fetchJSON('/api/globals/site-header?depth=2', { revalidate: RV, tags: ['global:site-header'] }),
    fetchJSON('/api/globals/site-footer?depth=2', { revalidate: RV, tags: ['global:site-footer'] }),
    getGalleryBySlug('sard-writer-room-gallery'),
    fetchJSON('/api/globals/sard-writer-about-hero?depth=2', {
      revalidate: RV,
      tags: ['global:sard-writer-about-hero'],
    }),
  ])

  return {
    header,
    footer,
    gallery,
    hero,
  }
}

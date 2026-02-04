export const pickText = (en, ar, lang) => {
  if (lang === 'ar') return ar || en || ''
  return en || ar || ''
}

export const yearLabel = (startYear, endYear) => {
  const s = Number(startYear)
  const e = Number(endYear)
  if (!Number.isFinite(e)) return ''
  if (Number.isFinite(s) && s !== e) return `${s}–${e}`
  return `${e}`
}

export const flattenPhotos = (item) => {
  const flat = []
  const pushMany = (arr) => {
    ;(arr || []).forEach((m) => {
      if (m?.id) flat.push(m)
    })
  }
  pushMany(item?.photos)
  ;(item?.groups || []).forEach((g) => pushMany(g?.photos))

  const map = new Map()
  flat.forEach((m) => {
    if (!map.has(m.id)) map.set(m.id, m)
  })
  return Array.from(map.values())
}

export const getDaysCount = (item) => {
  const groups = (item?.groups || []).filter(Boolean)
  const filled = groups.filter((g) => (g?.photos || []).length > 0)
  return filled.length
}

export const bucketFromItem = (item) => {
  const e = Number(item?.endYear)
  if (e >= 2025) return '2025'
  if (e === 2024) return '2024'
  return 'older'
}

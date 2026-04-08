function parseCatalogYear(value) {
  if (value == null || value === '') return null
  const s = String(value).trim()
  if (!/^\d{4}$/.test(s)) return null
  const n = Number(s)
  if (n < 1800 || n > 2100) return null
  return n
}

/** "All years" plus every calendar year from min..max among titles (descending). */
export function yearSelectOptionsFromTitles(titles) {
  const years = titles
    .map((t) => parseCatalogYear(t.releaseYear))
    .filter((y) => y != null)
  if (years.length === 0) return ['all']
  const min = Math.min(...years)
  const max = Math.max(...years)
  const range = []
  for (let y = max; y >= min; y -= 1) range.push(String(y))
  return ['all', ...range]
}

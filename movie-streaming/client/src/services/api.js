const TOKEN_KEY = 'streamlab_token'

export function getApiBase() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  return base.replace(/\/$/, '')
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function parseJsonSafe(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { error: text }
  }
}

function formatApiErrorMessage(res, data) {
  const raw = data?.error
  if (typeof raw !== 'string') {
    return (
      (data?.error != null && String(data.error)) ||
      res.statusText ||
      'Request failed'
    )
  }
  const pre = raw.match(/<pre>([^<]*)<\/pre>/i)
  if (pre) {
    const inner = pre[1].trim()
    if (/^Cannot (POST|GET|PUT|PATCH|DELETE)\s/i.test(inner)) {
      return `${inner} — restart the API from the server folder (npm run dev) so it loads the latest routes, or check VITE_API_URL.`
    }
    return inner
  }
  if (raw.includes('<!DOCTYPE') || raw.toLowerCase().includes('<html')) {
    return 'The server returned a web page instead of JSON. Check VITE_API_URL points to the StreamLab API (e.g. http://localhost:4000).'
  }
  return raw
}

/**
 * @param {string} path - e.g. /api/titles
 * @param {RequestInit} options
 */
export async function apiRequest(path, options = {}) {
  const headers = {
    ...options.headers,
  }
  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (
    options.body &&
    typeof options.body === 'string' &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json'
  }
  const url = `${getApiBase()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, { ...options, headers })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    const msg = formatApiErrorMessage(res, data)
    const err = new Error(msg)
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}

export function apiGet(path) {
  return apiRequest(path, { method: 'GET' })
}

export function apiPost(path, body) {
  return apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body ?? {}),
  })
}

export function apiPut(path, body) {
  return apiRequest(path, {
    method: 'PUT',
    body: JSON.stringify(body ?? {}),
  })
}

export function apiPatch(path, body) {
  return apiRequest(path, {
    method: 'PATCH',
    body: JSON.stringify(body ?? {}),
  })
}

export function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' })
}

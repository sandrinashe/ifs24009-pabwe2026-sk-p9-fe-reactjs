// Wrapper fetch terpusat: base URL, token Bearer, dan penguraian respons standar {status,message,data}.
const TOKEN_KEY = 'delcom_blog_token'
const USER_KEY = 'delcom_blog_user'

export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_DELCOM_BASEURL ||
  ''
).replace(/\/$/, '')

function safe(fn, fallback = null) {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export const getToken = () => safe(() => localStorage.getItem(TOKEN_KEY))

export const getStoredUser = () => safe(() => JSON.parse(localStorage.getItem(USER_KEY)))

export function saveSession(token, user) {
  safe(() => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  })
}

export function clearSession() {
  safe(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  })
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Memanggil API dan mengembalikan `data`. Melempar ApiError bila gagal. */
export async function apiFetch(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = auth ? getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 0)
  }

  let json = null
  try {
    json = await res.json()
  } catch {
    json = null
  }
  if (!res.ok || json?.status !== 'success') {
    if (res.status === 401 && token) {
      clearSession()
      window.dispatchEvent(new Event('auth:expired'))
    }
    throw new ApiError(json?.message || `Permintaan gagal (${res.status})`, res.status)
  }
  return json.data
}

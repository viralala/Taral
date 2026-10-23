// ============================================================
// API HELPER
// - No VITE_API_URL set  -> requests go to the in-browser mock
//   server in src/mock/server.js (data persists in localStorage).
// - VITE_API_URL set     -> real fetch() to your backend.
//   e.g. create .env.local with: VITE_API_URL=http://localhost:5000
// Usage: const items = await api.get('/items')
//        await api.post('/submissions', { name: 'A' })
// ============================================================
import { mockRequest } from '../mock/server'

const BASE = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

function authHeader() {
  try {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export async function request(path, { method = 'GET', body, headers } = {}) {
  if (!BASE) return mockRequest(path, { method, body, headers: authHeader() })

  const isForm = body instanceof FormData
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...authHeader(), ...headers },
    body: body == null ? undefined : isForm ? body : JSON.stringify(body),
  })
  const text = await res.text()
  let data = text
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    /* plain-text response */
  }
  if (!res.ok) throw new ApiError(data?.message || res.statusText, res.status, data)
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
}

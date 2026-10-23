// ============================================================
// MOCK SERVER — fake REST backend that lives in the browser.
// Add a route: push { method, path: '/things/:id', handler }.
// handler({ params, body, user }) returns the JSON response,
// or throws httpError(status, message).
// ============================================================
import seed from './seed.json'

const KEY = 'mockdb:v1'
const LATENCY = 350

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return structuredClone(seed)
}
let db = load()
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {}
}
export function resetMockDb() {
  db = structuredClone(seed)
  save()
}

const id = () => Math.random().toString(36).slice(2, 10)
const now = () => new Date().toISOString()
const publicUser = ({ password, ...u }) => u

export function httpError(status, message) {
  const e = new Error(message)
  e.status = status
  return e
}

function requireUser(user) {
  if (!user) throw httpError(401, 'Please sign in first.')
  return user
}

const routes = [
  // ---- Auth ----
  {
    method: 'POST',
    path: '/auth/signup',
    handler: ({ body }) => {
      const email = String(body.email || '').toLowerCase().trim()
      if (db.users.some((u) => u.email === email)) throw httpError(409, 'An account with this email already exists.')
      const user = { id: id(), name: body.name, email, password: body.password, createdAt: now() }
      db.users.push(user)
      return { token: `mock.${user.id}`, user: publicUser(user) }
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: ({ body }) => {
      const email = String(body.email || '').toLowerCase().trim()
      const user = db.users.find((u) => u.email === email && u.password === body.password)
      if (!user) throw httpError(401, 'Email or password is incorrect.')
      return { token: `mock.${user.id}`, user: publicUser(user) }
    },
  },
  { method: 'GET', path: '/auth/me', handler: ({ user }) => publicUser(requireUser(user)) },

  // ---- Content ----
  { method: 'GET', path: '/posts', handler: () => db.posts },
  {
    method: 'GET',
    path: '/posts/:id',
    handler: ({ params }) => {
      const p = db.posts.find((x) => x.id === params.id)
      if (!p) throw httpError(404, 'Post not found')
      return p
    },
  },

  // ---- Generic items (rename to whatever the problem statement needs) ----
  { method: 'GET', path: '/items', handler: () => db.items },
  {
    method: 'POST',
    path: '/items',
    handler: ({ body }) => {
      const item = { id: id(), createdAt: now(), ...body }
      db.items.unshift(item)
      return item
    },
  },
  {
    method: 'PATCH',
    path: '/items/:id',
    handler: ({ params, body }) => {
      const item = db.items.find((x) => x.id === params.id)
      if (!item) throw httpError(404, 'Item not found')
      Object.assign(item, body)
      return item
    },
  },
  {
    method: 'DELETE',
    path: '/items/:id',
    handler: ({ params }) => {
      db.items = db.items.filter((x) => x.id !== params.id)
      return { ok: true }
    },
  },

  // ---- Form wizard submissions ----
  { method: 'GET', path: '/submissions', handler: ({ user }) => db.submissions.filter((s) => s.userId === user?.id) },
  {
    method: 'POST',
    path: '/submissions',
    handler: ({ body, user }) => {
      const s = { id: id(), status: 'received', createdAt: now(), userId: user?.id ?? null, ...body }
      db.submissions.unshift(s)
      return s
    },
  },

  // ---- Newsletter ----
  {
    method: 'POST',
    path: '/subscribe',
    handler: ({ body }) => {
      if (!/^\S+@\S+\.\S+$/.test(body.email || '')) throw httpError(422, 'Enter a valid email.')
      return { ok: true }
    },
  },
]

function match(pattern, path) {
  const a = pattern.split('/').filter(Boolean)
  const b = path.split('?')[0].split('/').filter(Boolean)
  if (a.length !== b.length) return null
  const params = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}

export async function mockRequest(path, { method = 'GET', body, headers = {} } = {}) {
  await new Promise((r) => setTimeout(r, LATENCY))
  const token = headers.Authorization?.replace('Bearer mock.', '')
  const user = token ? db.users.find((u) => u.id === token) : null

  for (const r of routes) {
    if (r.method !== method) continue
    const params = match(r.path, path)
    if (!params) continue
    try {
      const result = r.handler({ params, body: body ?? {}, user })
      if (method !== 'GET') save()
      return structuredClone(result)
    } catch (e) {
      const err = new Error(e.message)
      err.status = e.status ?? 500
      throw err
    }
  }
  const err = new Error(`Mock route not found: ${method} ${path}`)
  err.status = 404
  throw err
}

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let token = null
    try {
      token = localStorage.getItem('token')
    } catch {}
    if (!token) return setReady(true)
    api
      .get('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setReady(true))
  }, [])

  const finish = ({ token, user }) => {
    try {
      localStorage.setItem('token', token)
    } catch {}
    setUser(user)
    return user
  }

  const login = useCallback(async (email, password) => finish(await api.post('/auth/login', { email, password })), [])
  const signup = useCallback(async (data) => finish(await api.post('/auth/signup', data)), [])
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token')
    } catch {}
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, ready, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

// Wrap any route element: <RequireAuth><Account /></RequireAuth>
export function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

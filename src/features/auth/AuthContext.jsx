import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { clearSession, getStoredUser, getToken, saveSession } from '../../helpers/apiHelper'
import { getProfile } from './api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null))
  // "checking" true selama token tersimpan belum diverifikasi ke server
  const [checking, setChecking] = useState(() => Boolean(getToken()))

  useEffect(() => {
    let alive = true
    if (!getToken()) return undefined
    getProfile()
      .then((profile) => {
        if (!alive) return
        saveSession(getToken(), profile)
        setUser(profile)
      })
      .catch(() => {
        if (alive && !getToken()) setUser(null)
      })
      .finally(() => alive && setChecking(false))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const expired = () => setUser(null)
    window.addEventListener('auth:expired', expired)
    return () => window.removeEventListener('auth:expired', expired)
  }, [])

  const signIn = useCallback((token, profile) => {
    saveSession(token, profile)
    setUser(profile)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, checking, signIn, signOut }), [user, checking, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

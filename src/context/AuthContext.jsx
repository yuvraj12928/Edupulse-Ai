import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { changePasswordRequest, loginRequest, logoutRequest, updateProfileRequest } from '../services/authService'

const AuthContext = createContext(null)
const storedAuth = () => { try { return JSON.parse(localStorage.getItem('edupulse-auth')) } catch { return null } }

export function AuthProvider({ children }) {
  const [session, setSession] = useState(storedAuth)
  const [loading, setLoading] = useState(false)
  const [authChecked] = useState(true)
  const [authMessage, setAuthMessage] = useState(null)
  useEffect(() => { if (session) localStorage.setItem('edupulse-auth', JSON.stringify(session)); else localStorage.removeItem('edupulse-auth') }, [session])
  const login = async (email, password) => { setLoading(true); setAuthMessage(null); try { const result = await loginRequest(email, password); setSession(result); return result } finally { setLoading(false) } }
  const logout = async () => { setLoading(true); try { await logoutRequest(session?.token) } finally { setSession(null); setLoading(false); setAuthMessage('Signed out successfully.') } }
  const updateProfile = async (changes) => { setLoading(true); try { const user = await updateProfileRequest({ ...session.user, ...changes }, session.token); const next = { ...session, user }; setSession(next); return user } finally { setLoading(false) } }
  const changePassword = async (currentPassword, newPassword) => { setLoading(true); try { await changePasswordRequest(session.user.email, currentPassword, newPassword, session?.token) } finally { setLoading(false) } }
  const value = useMemo(() => ({ user: session?.user || null, token: session?.token || null, isAuthenticated: Boolean(session?.token), loading, authChecked, authMessage, setAuthMessage, login, logout, updateProfile, changePassword }), [session, loading, authChecked, authMessage])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context }

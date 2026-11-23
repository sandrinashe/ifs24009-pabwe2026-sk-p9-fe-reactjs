import { apiFetch } from '../../../helpers/apiHelper'

export const login = (username, password) =>
  apiFetch('/api/auth/login', { method: 'POST', auth: false, body: { username, password } })

export const register = (payload) =>
  apiFetch('/api/auth/register', { method: 'POST', auth: false, body: payload })

export const logout = () => apiFetch('/api/auth/logout', { method: 'POST' })

export const getProfile = () => apiFetch('/api/auth/profile')

export const updateProfile = (payload) => apiFetch('/api/auth/profile', { method: 'PUT', body: payload })

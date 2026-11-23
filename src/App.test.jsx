import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App, { matchRoute } from './App'
import { AuthProvider } from './features/auth/AuthContext'
import { apiFetch, ApiError, getToken, saveSession, clearSession } from './helpers/apiHelper'
import { formatDate, formatShortDate } from './helpers/toolsHelper'
import { navigate } from './helpers/navigation'

describe('matchRoute', () => {
  it('memetakan seluruh rute', () => {
    expect(matchRoute('/')).toEqual({ name: 'home' })
    expect(matchRoute('/public')).toEqual({ name: 'home' })
    expect(matchRoute('/login')).toEqual({ name: 'login' })
    expect(matchRoute('/register')).toEqual({ name: 'register' })
    expect(matchRoute('/author/')).toEqual({ name: 'author' })
    expect(matchRoute('/admin')).toEqual({ name: 'admin' })
    expect(matchRoute('/posts/abc-1')).toEqual({ name: 'post', slug: 'abc-1' })
    expect(matchRoute('/xyz')).toEqual({ name: 'notfound' })
  })
})

describe('apiHelper', () => {
  it('menyimpan dan menghapus sesi', () => {
    saveSession('tok', { username: 'a' })
    expect(getToken()).toBe('tok')
    clearSession()
    expect(getToken()).toBeNull()
  })

  it('mengembalikan data pada respons sukses dan melempar ApiError pada gagal', async () => {
    saveSession('tok', { username: 'a' })
    const spy = vi.spyOn(globalThis, 'fetch')
    spy.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ status: 'success', data: [1] }) })
    expect(await apiFetch('/api/x')).toEqual([1])
    expect(spy.mock.calls[0][1].headers.Authorization).toBe('Bearer tok')
    spy.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ status: 'fail', message: 'nope' }) })
    await expect(apiFetch('/api/x')).rejects.toBeInstanceOf(ApiError)
    expect(getToken()).toBeNull()
    spy.mockRejectedValueOnce(new Error('down'))
    await expect(apiFetch('/api/x', { method: 'POST', body: { a: 1 } })).rejects.toThrow('Tidak dapat terhubung')
  })
})

describe('toolsHelper', () => {
  it('memformat tanggal', () => {
    expect(formatDate('2026-11-19T00:00:00Z')).toContain('2026')
    expect(formatDate(null)).toBe('—')
    expect(formatShortDate('bukan-tanggal')).toBe('—')
  })
})

describe('App', () => {
  it('menampilkan halaman login dengan selector wajib', () => {
    navigate('/login')
    render(
      <AuthProvider>
        <App />
      </AuthProvider>,
    )
    expect(document.querySelector('#login-username')).toBeInTheDocument()
    expect(document.querySelector('#login-password')).toBeInTheDocument()
    expect(document.querySelector('#login-submit')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('masuk')
  })

  it('menampilkan 404 untuk rute tak dikenal', () => {
    navigate('/tidak-ada')
    render(
      <AuthProvider>
        <App />
      </AuthProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
  })
})

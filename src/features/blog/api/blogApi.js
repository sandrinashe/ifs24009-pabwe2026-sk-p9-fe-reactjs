import { apiFetch } from '../../../helpers/apiHelper'

export const getCategories = () => apiFetch('/api/public/categories', { auth: false })

export function getPublicPosts({ q = '', category = '' } = {}, signal) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category && category !== 'Semua') params.set('category', category)
  const qs = params.toString()
  return apiFetch(`/api/public/posts${qs ? `?${qs}` : ''}`, { auth: false, signal })
}

export const getPublicPost = (slug) => apiFetch(`/api/public/posts/${encodeURIComponent(slug)}`, { auth: false })

export const getMyPosts = () => apiFetch('/api/posts')
export const getMyStats = () => apiFetch('/api/posts/stats')
export const getMyPost = (id) => apiFetch(`/api/posts/${id}`)
export const createPost = (payload) => apiFetch('/api/posts', { method: 'POST', body: payload })
export const updatePost = (id, payload) => apiFetch(`/api/posts/${id}`, { method: 'PUT', body: payload })
export const togglePublish = (id) => apiFetch(`/api/posts/${id}/toggle-publish`, { method: 'PATCH' })
export const deletePost = (id) => apiFetch(`/api/posts/${id}`, { method: 'DELETE' })
export const aiGenerate = (payload) => apiFetch('/api/posts/ai-generate', { method: 'POST', body: payload })

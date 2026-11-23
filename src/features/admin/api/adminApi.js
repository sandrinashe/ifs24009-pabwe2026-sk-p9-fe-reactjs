import { apiFetch } from '../../../helpers/apiHelper'

export const getUsers = () => apiFetch('/api/admin/users')
export const getAllPosts = () => apiFetch('/api/admin/posts')
export const getUserPosts = (id) => apiFetch(`/api/admin/users/${id}/posts`)

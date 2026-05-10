// NestJS 后端 API 客户端
const BASE_URL = 'http://localhost:3000/api'

let token: string | null = localStorage.getItem('token')

export function setToken(t: string | null) {
  token = t
  if (t) localStorage.setItem('token', t)
  else localStorage.removeItem('token')
}

export function getToken() {
  return token
}

export async function api(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    // token 过期，清除登录状态
    setToken(null)
    window.location.href = '/login'
    throw new Error('登录已过期，请重新登录')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `请求失败 (${res.status})`)
  }

  // 204 No Content
  if (res.status === 204) return null

  return res.json()
}

// Helper 方法
export const apiClient = {
  get: (path: string) => api(path),
  post: (path: string, data?: any) => api(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: (path: string, data?: any) => api(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: (path: string) => api(path, { method: 'DELETE' }),
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient, setToken, getToken } from '../api/client'
import type { UserProfile } from '../types'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null)

  async function login(username: string, password: string) {
    const res = await apiClient.post('/auth/login', { username, password })
    setToken(res.token)
    user.value = res.user
  }

  async function logout() {
    setToken(null)
    user.value = null
  }

  let initialized = false

  async function init() {
    if (initialized) return
    initialized = true

    const token = getToken()
    if (!token) return

    try {
      const profile = await apiClient.get('/users/me')
      user.value = profile
    } catch {
      // token 无效，清除
      setToken(null)
    }
  }

  const isLoggedIn = computed(() => !!user.value)

  return { user, login, logout, init, isLoggedIn }
})

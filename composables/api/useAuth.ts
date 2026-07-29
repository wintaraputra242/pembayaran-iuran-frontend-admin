import type { LoginResponse, MeResponse } from "@/types/api/auth"
import { useApi } from "./useApi"

export const useAuth = () => {
  const { api } = useApi()
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const router = useRouter()

  const login = async (payload: { username: string; password: string, fcm_token?: string, platform?: string }): Promise<LoginResponse> => {
    const res = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    })

    authStore.setToken(res.data.access_token)
    authStore.setUser(res.data.user)

    return res
  }

  const fetchUser = async () => {
    uiStore.startLoading()

    try {
      const res: MeResponse = await api('/auth/me')
      authStore.setUser(res.data)
      uiStore.endLoading()
      return true
    } catch {
      authStore.logout()
      uiStore.endLoading()
      return false
    }
  }

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } finally {
      authStore.logout()
      router.push('/login')
    }
  }

  const logoutAll = async () => {
    try {
      await api('/auth/logout-all', { method: 'POST' })
    } finally {
      authStore.logout()
      router.push('/login')
    }
  }

  return { login, logout, logoutAll, fetchUser }
}

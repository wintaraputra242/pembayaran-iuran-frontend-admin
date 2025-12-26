import type { AuthUser, LoginResponse, MeResponse } from "@/types/api/auth"
import { useApi } from "./useApi"

export const useAuth = () => {
  const api = useApi()
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const router = useRouter()

  const fetchCsrf = async () => {
    await  $fetch('http://localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include'
    })
  }

  const login = async (payload: { username: string; password: string }): Promise<LoginResponse> => {
    await fetchCsrf()

    const res = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    })

    authStore.setUser(res.data as AuthUser)

    return res
  }

  const fetchUser = async () => {
    uiStore.startLoading()

    try {
      const res: MeResponse = await api('/auth/me')
      authStore.setUser(res.data)

      router.push(res.data.role === 'admin' ? '' : '/create-pembayaran')

      uiStore.endLoading()

      return true
    } catch {
      authStore.logout()
      uiStore.endLoading()
      return false
    }
  }

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' })
    authStore.logout()
  }

  return { login, logout, fetchUser }
}

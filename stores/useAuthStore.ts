import type { AuthUser } from "@/types/api/auth"
import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    fetched: false,
    token: import.meta.client ? (localStorage.getItem('auth_token') ?? '') : '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    role: (state) => state.user?.role,
  },

  actions: {
    setUser(user: AuthUser) {
      this.user = user
      this.fetched = true
    },

    setToken(token: string) {
      this.token = token
      if (import.meta.client) {
        localStorage.setItem('auth_token', token)
      }
    },

    logout() {
      this.user = null
      this.token = ''
      this.fetched = true
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
      }
    },
  },
})

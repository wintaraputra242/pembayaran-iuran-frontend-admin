import type { AuthUser } from "@/types/api/auth"
import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    fetched: false
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

    logout() {
      this.user = null
      this.fetched = true
    },
  },
})

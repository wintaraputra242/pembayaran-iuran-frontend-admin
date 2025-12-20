import { defineStore } from 'pinia'
// import { useAuthApi } from '@/composables/api/useAuthApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isLoggedIn: () => true,
    role: () => 'admin'
  },

  actions: {
    // async login(payload) {
    //   const api = useAuthApi()
    //   const res = await api.login(payload)

    //   this.token = res.token
    //   this.user = res.user
    // },

    // async fetchMe() {
    //   const api = useAuthApi()
    //   this.user = await api.me()
    // },

    logout() {
      this.user = null
      this.token = null
    }
  }
})

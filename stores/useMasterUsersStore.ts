import { useMasterUsers } from '@/composables/api/useMasterUsers'
import type { MasterUser } from '@/types/api/master-users'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const useMasterUsersStore = defineStore('master-users', {
  state: () => ({
    users: [] as MasterUser[],
    meta: null as PaginationMeta | null,
    loading: false,
    loadingDownload: false,
    reload: false,
    page: 0,

    filters: {
      keyword: '',
      role: '',
    },
  }),

  getters: {
    hasData: (state) => state.users.length > 0,
    hasMore: (state) => state.meta?.total !== state.users.length,
    hasFilter: (state) => !!state.filters.keyword || !!state.filters.role,
  },

  actions: {
    async fetchUsers(params?: {
      page?: number
      limit?: number
    }) {
      if (this.reload) {
        this.users = []
        this.reload = false
      }

      const api = useMasterUsers()
      this.loading = true

      try {
        const res = await api.getUsers({
          page: params?.page,
          limit: params?.limit,
          ...this.filters,
        })

        this.users = [...this.users, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta

        this.page = params?.page as number
      } finally {
        this.loading = false
      }
    },

    async downloadCredential() {
      const api = useMasterUsers()
      this.loadingDownload = true

      try {
        const blob = await api.downloadCredentialPdf()

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'credential-regu.pdf'
        a.click()
        URL.revokeObjectURL(url)
      } finally {
        this.loadingDownload = false
      }
    },

    setFilter(key: keyof typeof this.filters, value: string) {
      this.filters[key] = value
    },

    resetFilter() {
      this.filters = {
        keyword: '',
        role: '',
      }
      this.page = 0
    },
  },
})

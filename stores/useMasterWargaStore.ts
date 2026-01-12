import { useMasterWarga } from '@/composables/api/useMasterWarga'
import type { MasterWarga } from '@/types/api/master-warga'
import type { PaginationMeta } from '@/types/common'

export const useMasterWargaStore = defineStore('master-warga', {
  state: () => ({
    users: [] as MasterWarga[],
    meta: null as PaginationMeta | null,
    loading: false,
    reload: false,

    filters: {
      keyword: '',
      status_keaktifan: '',
    },
  }),

  getters: {
    hasData: (state) => state.users.length > 0,
    hasMore: (state) => state.meta?.total !== state.users.length,
    hasFilter: (state) => !!state.filters.keyword || !!state.filters.status_keaktifan,
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

      const api = useMasterWarga()
      this.loading = true

      try {
        const res = await api.getWarga({
          page: params?.page,
          limit: params?.limit,
          ...this.filters,
        })

        this.users = [...this.users, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
      } finally {
        this.loading = false
      }
    },

    setFilter(key: keyof typeof this.filters, value: string) {
      this.filters[key] = value
    },

    resetFilter() {
      this.filters = {
        keyword: '',
        status_keaktifan: '',
      }
    },
  },
})

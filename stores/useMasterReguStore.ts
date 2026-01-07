import { useMasterRegu } from '@/composables/api/useMasterRegu'
import type { CreateReguPayload } from '@/types/api/master-regu'
import type { MasterUser } from '@/types/api/master-users'
import type { PaginationMeta } from '@/types/common'

export const useMasterReguStore = defineStore('master-regu', {
  state: () => ({
    users: [] as MasterUser[],
    meta: null as PaginationMeta | null,
    loading: false,

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
    async createRegu(params: CreateReguPayload) {
      if (this.filters.keyword || this.filters.role) {
        this.users = []
      }

      const api = useMasterRegu()
      this.loading = true

      try {
        const res = await api.createRegu(params)

        return res
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
        role: '',
      }
    },
  },
})

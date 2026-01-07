import { useMasterUsers } from '@/composables/api/useMasterUsers'
import type { MasterUser } from '@/types/api/master-users'
import type { PaginationMeta } from '@/types/common'

export const useMasterUsersStore = defineStore('master-users', {
  state: () => ({
    users: [] as MasterUser[],
    meta: null as PaginationMeta | null,
    loading: false,
    loadingDownload: false,
    reload: false,

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

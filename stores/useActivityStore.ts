import { useActivity } from '@/composables/api/useActivity'
import type { ActivityLog } from '@/types/api/activity'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as ActivityLog[],
    meta: null as PaginationMeta | null,
    loading: false,
    reload: false,
    page: 0,

    filters: {
      action: '',
      user: '',
      start_date: '',
      end_date: '',
    },
  }),

  getters: {
    hasData: (state) => state.activities.length > 0,
    hasMore: (state) => state.meta?.total !== state.activities.length,
    hasFilter: (state) =>
      !!state.filters.action ||
      !!state.filters.user ||
      !!state.filters.start_date ||
      !!state.filters.end_date,
  },

  actions: {
    async fetchActivities(params?: { page?: number; limit?: number }) {
      if (this.reload) {
        this.activities = []
        this.reload = false
      }

      const api = useActivity()
      this.loading = true

      try {
        const newFilter: Record<string, any> = {}

        Object.entries(this.filters).forEach(([key, value]) => {
          if (value) newFilter[key] = value
        })

        const res = await api.getActivityLogs({
          page: params?.page,
          limit: params?.limit,
          ...newFilter,
        })

        this.activities = [...this.activities, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta

        this.page = params?.page as number
      } finally {
        this.loading = false
      }
    },

    setFilter(
      key: keyof typeof this.filters,
      value: string
    ) {
      this.filters[key] = value
    },

    resetFilter() {
      this.filters = {
        action: '',
        user: '',
        start_date: '',
        end_date: '',
      }
    },
  },
})

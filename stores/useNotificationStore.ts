import { useNotification } from '@/composables/api/useNotification'
import type { Notification } from '@/types/api/notification'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    meta: null as PaginationMeta | null,
    unreadCount: 0,

    loading: false,
    reload: false,

    filters: {
      type: '',
    },
  }),

  getters: {
    hasData: (state) => state.notifications.length > 0,

    hasMore: (state) =>
      state.meta ? state.notifications.length < state.meta.total : false,

    hasFilter: (state) =>
      !!state.filters.type,
  },

  actions: {
    async fetchNotifications(params?: { page?: number; per_page?: number }) {
      if (this.reload) {
        this.notifications = []
        this.reload = false
      }

      const api = useNotification()
      this.loading = true

      try {
        const newFilter: Record<string, any> = {}

        Object.entries(this.filters).forEach(([key, value]) => {
          if (value) newFilter[key] = value
        })

        const res = await api.getNotifications({
          page: params?.page,
          per_page: params?.per_page,
          ...newFilter,
        })

        this.notifications = [...this.notifications, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      const api = useNotification()

      const res = await api.getUnreadCount()

      this.unreadCount = res.data.unread_count
    },

    async markAsRead(id: number) {
      const api = useNotification()

      await api.markAsRead(id)

      const notif = this.notifications.find(n => n.id === id)

      if (notif) notif.is_read = true

      if (this.unreadCount > 0) this.unreadCount--
    },

    async markAllAsRead() {
      const api = useNotification()

      await api.markAllAsRead()

      this.notifications = this.notifications.map(n => ({
        ...n,
        is_read: true,
      }))

      this.unreadCount = 0
    },

    setFilter(
      key: keyof typeof this.filters,
      value: string
    ) {
      this.filters[key] = value
    },

    resetFilter() {
      this.filters = {
        type: '',
      }
    },

    resetState() {
      this.notifications = []
      this.meta = null
      this.reload = true
    },
  },
})

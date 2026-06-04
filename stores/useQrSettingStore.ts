import { useQrSetting, type QrSetting } from '@/composables/api/useQrSetting'
import { defineStore } from 'pinia'

export const useQrSettingStore = defineStore('qrSetting', {
  state: () => ({
    qrSettings: [] as QrSetting[],

    loading: false,
    loadingAction: false,

    filters: {
      keyword: '',
      status: '',
    },
  }),

  getters: {
    hasData: (state) => state.qrSettings.length > 0,

    hasFilter: (state) =>
      !!(state.filters.keyword || state.filters.status),

    // List yang sudah difilter di sisi client
    filteredQrSettings: (state) => {
      return state.qrSettings.filter(item => {
        const matchKeyword =
          !state.filters.keyword ||
          item.nama_rekening?.toLowerCase().includes(state.filters.keyword.toLowerCase()) ||
          item.nomor_rekening?.toLowerCase().includes(state.filters.keyword.toLowerCase()) ||
          item.keterangan?.toLowerCase().includes(state.filters.keyword.toLowerCase())

        const matchStatus =
          !state.filters.status ||
          (state.filters.status === 'aktif' ? item.is_active : !item.is_active)

        return matchKeyword && matchStatus
      })
    },
  },

  actions: {
    async fetchQrSettings() {
      const api = useQrSetting()
      this.loading = true

      try {
        const res = await api.getQrSettings()
        this.qrSettings = res.data
      } finally {
        this.loading = false
      }
    },

    async storeQrSetting(payload: FormData) {
      const api = useQrSetting()
      this.loadingAction = true

      try {
        const res = await api.storeQrSetting(payload)

        // Backend otomatis set semua jadi tidak aktif lalu yang baru jadi aktif
        // Jadi reset semua is_active dulu, lalu push data baru
        this.qrSettings = this.qrSettings.map(q => ({ ...q, is_active: false }))
        this.qrSettings.unshift(res.data)

        return res
      } finally {
        this.loadingAction = false
      }
    },

    async setActive(id: number) {
      const api = useQrSetting()
      this.loadingAction = true

      try {
        await api.setActive(id)

        // Update state lokal: nonaktifkan semua, aktifkan yang dipilih
        this.qrSettings = this.qrSettings
          .map(q => ({ ...q, is_active: q.id === id }))
          .sort((a, b) => Number(b.is_active) - Number(a.is_active))
      } finally {
        this.loadingAction = false
      }
    },

    async destroyQrSetting(id: number) {
      const api = useQrSetting()
      this.loadingAction = true

      try {
        await api.destroyQrSetting(id)
        this.qrSettings = this.qrSettings.filter(q => q.id !== id)
      } finally {
        this.loadingAction = false
      }
    },

    setFilter(key: keyof typeof this.filters, value: string) {
      this.filters[key] = value
    },

    resetFilter() {
      this.filters = {
        keyword: '',
        status: '',
      }
    },

    resetState() {
      this.qrSettings = []
      this.filters = {
        keyword: '',
        status: '',
      }
    },
  },
})

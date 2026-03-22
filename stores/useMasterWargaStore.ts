import { useMasterWarga } from '@/composables/api/useMasterWarga'
import type { AddWargaPayload, MasterWarga } from '@/types/api/master-warga'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const useMasterWargaStore = defineStore('master-warga', {
  state: () => ({
    warga: [] as MasterWarga[],
    meta: null as PaginationMeta | null,
    detailWarga: null as MasterWarga | null,
    loading: false,
    reload: false,
    page: 0,

    filters: {
      keyword: '',
      status_keaktifan: '',
    },
  }),

  getters: {
    hasData: (state) => state.warga.length > 0,
    hasMore: (state) => state.meta?.total !== state.warga.length,
    hasFilter: (state) => !!state.filters.keyword || !!state.filters.status_keaktifan,
  },

  actions: {
    async fetchWarga(params?: {
      page?: number
      limit?: number
    }) {
      if (this.reload) {
        this.warga = []
        this.reload = false
      }

      const api = useMasterWarga()
      this.loading = true

      try {
        const newFilter: Record<string, string> = {}

        Object.entries(this.filters).forEach(([key, value]) => {

          if (value) {
            newFilter[key] = value
          }
        })

        const res = await api.getWarga({
          page: params?.page,
          limit: params?.limit,
          ...newFilter,
        })

        this.warga = [...this.warga, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta

        this.page = params?.page as number
      } finally {
        this.loading = false
      }
    },

    setFilter(key: keyof typeof this.filters, value: string) {
      this.filters[key] = value
    },

    async fetchAddWarga(params: AddWargaPayload) {

      const api = useMasterWarga()
      this.loading = true

      try {
        const res = await api.addWarga(params)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchImportAddWarga(file: File) {

      const api = useMasterWarga()
      this.loading = true

      try {
        const res = await api.importAddDataWarga(file)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchUpdateStatus(params: { nik: string, status_keaktifan: 'aktif' | 'tidak_aktif' }) {

      const api = useMasterWarga()
      this.loading = true

      try {
        const res = await api.updateStatusWarga(params)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchUpdateWarga(params: AddWargaPayload, nik: string) {

      const api = useMasterWarga()
      this.loading = true

      try {
        const res = await api.updateWarga(params, nik)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchDeleteWarga(nik: string) {

      const api = useMasterWarga()
      this.loading = true

      try {
        const res = await api.deleteWarga(nik)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchDetailWarga(nik: string) {

      const api = useMasterWarga()
      this.loading = true

      try {
        const res = await api.detailWarga(nik)

        this.detailWarga = res.data

        return res
      } finally {
        this.loading = false
      }
    },

    resetFilter() {
      this.filters = {
        keyword: '',
        status_keaktifan: '',
      }
    },
  },
})

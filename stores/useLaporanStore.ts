import { useLaporan } from '@/composables/api/useLaporan'
import type {
  Pembayaran
} from '@/types/api/pembayaran'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const useLaporanStore = defineStore('laporan', {
  state: () => ({
    laporan: [] as Pembayaran[],
    meta: null as PaginationMeta | null,
    loading: false,
    loadingExport: false,
    reload: false,

    filters: {
      jenis_iuran: '',
      metode_bayar: '',
      status_bayar: '',
      regu: '',
      informasi_iuran: '',
      start_date: '',
      end_date: '',
    },
  }),

  getters: {
    hasData: (state) => state.laporan.length > 0,
    hasMore: (state) => state.meta?.total !== state.laporan.length,
    hasFilter: (state) =>
      !!state.filters.jenis_iuran ||
      !!state.filters.metode_bayar ||
      !!state.filters.status_bayar ||
      !!state.filters.regu ||
      !!state.filters.informasi_iuran ||
      !!state.filters.start_date ||
      !!state.filters.end_date,
  },

  actions: {
    async fetchLaporan(params?: { page?: number; limit?: number }) {
      if (this.reload) {
        this.laporan = []
        this.reload = false
      }

      const api = useLaporan()
      this.loading = true

      try {
        const newFilter: Record<string, any> = {}

        Object.entries(this.filters).forEach(([key, value]) => {
          if (value) newFilter[key] = value
        })

        const res = await api.getLaporan({
          page: params?.page,
          limit: params?.limit,
          ...newFilter,
        })

        this.laporan = [...this.laporan, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
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
        jenis_iuran: '',
        metode_bayar: '',
        status_bayar: '',
        regu: '',
        informasi_iuran: '',
        start_date: '',
        end_date: '',
      }
    },

    async fetchExportExcelLaporan() {
      const api = useLaporan()
      this.loadingExport = true

      try {
        const params: Record<string, any> = {}

        if (this.filters.start_date && this.filters.end_date) {
          params.start_date = this.filters.start_date
          params.end_date = this.filters.end_date
        }

        if (this.filters.metode_bayar) params.metode_bayar = this.filters.metode_bayar
        if (this.filters.status_bayar) params.status = this.filters.status_bayar
        if (this.filters.jenis_iuran) params.jenis_iuran = this.filters.jenis_iuran
        if (this.filters.regu) params.regu = this.filters.regu
        if (this.filters.informasi_iuran) params.informasi_iuran = this.filters.informasi_iuran

        const blob = await api.exportExcelLaporan(params)

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `laporan-pembayaran-${Date.now()}.xlsx`
        link.click()

        window.URL.revokeObjectURL(url)
      } finally {
        this.loadingExport = false
      }
    }
  },
})

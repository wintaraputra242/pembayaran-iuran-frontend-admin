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
    page: 0,

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
        jenis_iuran: '',
        metode_bayar: '',
        status_bayar: '',
        regu: '',
        informasi_iuran: '',
        start_date: '',
        end_date: '',
      }
    },

    async fetchExportPdfLaporan(id_informasi_iuran: number) {
      const api = useLaporan()
      this.loadingExport = true

      try {
        const blob = await api.exportPdfLaporan({ id_informasi_iuran })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `laporan-pembayaran-${Date.now()}.pdf`
        link.click()
        window.URL.revokeObjectURL(url)
      } finally {
        this.loadingExport = false
      }
    },
  },
})

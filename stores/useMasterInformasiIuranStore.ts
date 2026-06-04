import { useMasterInformasiIuran } from '@/composables/api/useMasterInformasiIuran'
import type { AddInformasiIuranPayload, MasterInformasiIuran } from '@/types/api/master-informasi-iuran'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const useMasterInformasiIuranStore = defineStore('master-informasi-iuran', {
  state: () => ({
    informasiIuran: [] as MasterInformasiIuran[],
    detailInformasiIuran: {} as MasterInformasiIuran,
    meta: null as PaginationMeta | null,
    loading: false,
    reload: false,
    page: 0,

    filters: {
      keyword: '',
      status_aktif: '',
      jenis_iuran: '',
    },
  }),

  getters: {
    hasData: (state) => state.informasiIuran.length > 0,
    hasMore: (state) => state.meta?.total !== state.informasiIuran.length,
    hasFilter: (state) => !!state.filters.keyword || !!state.filters.status_aktif || !!state.filters.jenis_iuran
  },

  actions: {
    async fetchInformasiIuran(params?: {
      page?: number
      limit?: number
      mode?: string
      jenis_iuran?: string
    }) {
      if (this.reload) {
        this.informasiIuran = []
        this.reload = false
      }

      const api = useMasterInformasiIuran()
      this.loading = true

      try {
        const newFilter: Record<string, string> = {}

        Object.entries(this.filters).forEach(([key, value]) => {

          if (value) {
            newFilter[key] = value
          }
        })

        const res = await api.getInformasiIuran({
          page: params?.page,
          limit: params?.limit,
          mode: params?.mode,
          jenis_iuran: params?.jenis_iuran,
          ...newFilter,
        })

        this.informasiIuran = [...this.informasiIuran, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta

        this.page = params?.page as number
      } finally {
        this.loading = false
      }
    },

    async fetchInformasiIuranActive(params?: {
      page?: number
      limit?: number
      jenis_iuran?: string
      keyword?: string
    }) {
      if (this.reload) {
        this.informasiIuran = []
        this.reload = false
      }

      const api = useMasterInformasiIuran()
      this.loading = true

      try {
        const res = await api.getInformasiIuranActive({
          page: params?.page,
          limit: params?.limit,
          jenis_iuran: params?.jenis_iuran,
          keyword: params?.keyword,
        })

        this.informasiIuran = [...this.informasiIuran, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta

        this.page = params?.page as number
      } finally {
        this.loading = false
      }
    },

    async fetchDetailInformasiIuran(id: number | string) {
      const api = useMasterInformasiIuran()
      this.loading = true

      try {
        const res = await api.getDetailInformasiIuran(id)

        this.detailInformasiIuran = res.data
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
        status_aktif: '',
        jenis_iuran: ''
      }
    },

    async fetchAddInformasiIuran(params: AddInformasiIuranPayload) {
      const api = useMasterInformasiIuran()
      this.loading = true

      let newParams: any = {}

      const changeToNumber = () => {
        if (params.jumlah_iuran && typeof params.jumlah_iuran === 'string') {
          return Number(params.jumlah_iuran.replace(/\./g, ''))
        }

        return params.jumlah_iuran as number
      }

      Object.entries(params).forEach(([key, value]) => {
        if (key === 'periode' && params.jenis_iuran === 'kematian') return
        if ((key === 'nama_warga_meninggal' || key === 'nik_penanggung_jawab') && params.jenis_iuran === 'bulanan') return

        if (key === 'jumlah_iuran') {
          newParams[key] = changeToNumber()
          return
        }

        newParams[key] = value
      })

      try {
        const res = await api.addInformasiIuran(newParams)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchUpdateInformasiIuran(params: AddInformasiIuranPayload, id: number) {
      const api = useMasterInformasiIuran()
      this.loading = true

      let newParams: any = {}

      const changeToNumber = () => {
        if (params.jumlah_iuran && typeof params.jumlah_iuran === 'string') {
          return Number(params.jumlah_iuran.replace(/\./g, ''))
        }

        return params.jumlah_iuran as number
      }

      Object.entries(params).forEach(([key, value]) => {
        if (key === 'periode' && params.jenis_iuran === 'kematian') return
        if ((key === 'nama_warga_meninggal' || key === 'nik_penanggung_jawab') && params.jenis_iuran === 'bulanan') return

        if (key === 'jumlah_iuran') {
          newParams[key] = changeToNumber()
          return
        }

        newParams[key] = value
      })

      try {
        const res = await api.updateInformasiIuran(newParams, id)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchUpdateStatus(params: { id: number, status_aktif: number }) {
      const api = useMasterInformasiIuran()
      this.loading = true

      try {
        const res = await api.updateStatusInformasiIuran(params)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchDeleteInformasiIuran(id: number) {
      const api = useMasterInformasiIuran()
      this.loading = true

      try {
        const res = await api.deleteInformasiIuran(id)

        return res
      } finally {
        this.loading = false
      }
    },

  },
})

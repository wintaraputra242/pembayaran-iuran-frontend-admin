import { defineStore } from 'pinia'
import { useMasterInformasiIuran } from '@/composables/api/useMasterInformasiIuran'
import type { AddInformasiIuranPayload, MasterInformasiIuran } from '@/types/api/master-informasi-iuran'
import type { PaginationMeta } from '@/types/common'

const buildInformasiIuranPayload = (params: AddInformasiIuranPayload) => {
  const newParams: any = {}

  Object.entries(params).forEach(([key, value]) => {
    if (key === 'periode' && params.jenis_iuran === 'kematian')
      return
    if ((key === 'nama_warga_meninggal' || key === 'nik_penanggung_jawab') && params.jenis_iuran === 'bulanan')
      return

    if (key === 'jumlah_iuran' && typeof params.jumlah_iuran === 'string') {
      newParams[key] = params.jumlah_iuran ? Number(params.jumlah_iuran.replace(/\./g, '')) : params.jumlah_iuran

      return
    }

    newParams[key] = value
  })

  return newParams
}

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
    hasData: state => state.informasiIuran.length > 0,
    hasMore: state => state.meta?.total !== state.informasiIuran.length,
    hasFilter: state => !!state.filters.keyword || !!state.filters.status_aktif || !!state.filters.jenis_iuran,
  },

  actions: {
    async fetchInformasiIuran(params?: {
      page?: number
      limit?: number
      mode?: string
      jenis_iuran?: string

      // true = ganti seluruh data dengan hasil fetch ini (dipakai pagination desktop).
      // false/undefined = tambahkan ke data yang sudah ada (dipakai infinite-scroll mobile).
      replace?: boolean
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
          if (value)
            newFilter[key] = value
        })

        const res = await api.getInformasiIuran({
          page: params?.page,
          limit: params?.limit,
          mode: params?.mode,
          jenis_iuran: params?.jenis_iuran,
          ...newFilter,
        })

        this.informasiIuran = params?.replace ? res.data.data : [...this.informasiIuran, ...res.data.data]

        const { data: _, ...meta } = res.data

        this.meta = meta

        this.page = params?.page as number
      }
      finally {
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

        const { data: _, ...meta } = res.data

        this.meta = meta

        this.page = params?.page as number
      }
      finally {
        this.loading = false
      }
    },

    async fetchDetailInformasiIuran(id: number | string) {
      const api = useMasterInformasiIuran()

      this.loading = true

      try {
        const res = await api.getDetailInformasiIuran(id)

        this.detailInformasiIuran = res.data
      }
      finally {
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
        jenis_iuran: '',
      }
    },

    async fetchAddInformasiIuran(params: AddInformasiIuranPayload) {
      const api = useMasterInformasiIuran()

      this.loading = true

      const newParams = buildInformasiIuranPayload(params)

      try {
        return await api.addInformasiIuran(newParams)
      }
      finally {
        this.loading = false
      }
    },

    async fetchUpdateInformasiIuran(params: AddInformasiIuranPayload, id: number) {
      const api = useMasterInformasiIuran()

      this.loading = true

      const newParams = buildInformasiIuranPayload(params)

      try {
        return await api.updateInformasiIuran(newParams, id)
      }
      finally {
        this.loading = false
      }
    },

    async fetchUpdateStatus(params: { id: number; status_aktif: number }) {
      const api = useMasterInformasiIuran()

      this.loading = true

      try {
        return await api.updateStatusInformasiIuran(params)
      }
      finally {
        this.loading = false
      }
    },

    async fetchDeleteInformasiIuran(id: number) {
      const api = useMasterInformasiIuran()

      this.loading = true

      try {
        return await api.deleteInformasiIuran(id)
      }
      finally {
        this.loading = false
      }
    },

  },
})

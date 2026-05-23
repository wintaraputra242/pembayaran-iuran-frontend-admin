import { usePembayaran } from '@/composables/api/usePembayaran'
import type {
  AddPembayaranPayload,
  NotifyResidentPayload,
  NotifyUnpaidPayload,
  Pembayaran,
  PembayaranByRegu,
  UnpaidWarga,
} from '@/types/api/pembayaran'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const usePembayaranStore = defineStore('pembayaran', {
  state: () => ({
    pembayaran: [] as Pembayaran[],
    meta: null as PaginationMeta | null,
    metaHistoryPaid: null as PaginationMeta | null,
    metaHistoryUnpaid: null as PaginationMeta | null,
    unpaidWarga: [] as any[],
    loadingSendNotif: false,
    loadingSendNotifToAll: false,
    loadingGetPaidMonthWarga: false,
    loading: false,
    loadingDetail: false,
    reload: false,
    isReloadDataUnpaidWarga: false,
    isReloadDataHistoryUnpaid: false,
    isReloadDataPembayaranByRegu: false,
    page: 0,

    filters: {
      nama_warga: '',
      regu: '',
      jenis_iuran: '',
      metode_bayar: '',
      status: '',
      start_date: '',
      end_date: '',
    },

    idInformasiIuran: 0,
    bulan: 0,
    namaWarga: '',

    itemSelected: null as Pembayaran | null,

    nikWarga: '',
    historyPaid: [] as Pembayaran[],
    historyUnpaid: [] as UnpaidWarga[],
    monthPaidPaymentWarga: [] as number[] | string[],
    pembayaranByRegu: [] as PembayaranByRegu[],
    loadingByRegu: false,
    metaByRegu: {} as Record<string, any>,
  }),

  getters: {
    hasData: (state) => state.pembayaran.length > 0,
    hasMore: (state) => state.meta?.total !== state.pembayaran.length,
    hasFilter: (state) =>
      !!state.filters.nama_warga ||
      !!state.filters.regu ||
      !!state.filters.jenis_iuran ||
      !!state.filters.metode_bayar ||
      !!state.filters.status ||
      !!state.filters.start_date ||
      !!state.filters.end_date,

    hasNikFilter: (state) =>
      !!state.nikWarga,

    hasMoreUnpaidWarga: (state) => state.meta?.total !== state.unpaidWarga.length,

    hasMoreHistoryPaid: (state) => state.meta?.total !== state.historyPaid.length,
    hasMoreHistoryUnpaid: (state) => state.meta?.total !== state.historyUnpaid.length,
    hasMoreByRegu: (state) => state.metaByRegu?.total !== state.pembayaranByRegu.length,
  },

  actions: {
    async fetchPembayaran(params?: { page?: number; limit?: number }) {
      if (this.reload) {
        this.pembayaran = []
        this.reload = false
      }

      const api = usePembayaran()
      this.loading = true

      try {
        const newFilter: Record<string, string> = {}

        Object.entries(this.filters).forEach(([key, value]) => {
          if (value) newFilter[key] = value
        })

        const res = await api.getPembayaran({
          page: params?.page,
          limit: params?.limit,
          ...newFilter,
        })

        this.pembayaran = [...this.pembayaran, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta

        this.page = params?.page as number
      } finally {
        this.loading = false
      }
    },

    setFilter(
      key: keyof typeof this.filters | 'idInformasiIuran' | 'bulan' | 'namaWarga' | 'nikWarga',
      value: string | number
    ) {
      if (key in this.filters) {
        this.filters[key as keyof typeof this.filters] = String(value)
      } else {
        this[key as 'idInformasiIuran' | 'bulan'] = Number(value)
        this[key as 'namaWarga' | 'nikWarga'] = value as string
      }
    },

    resetFilter() {
      this.filters = {
        nama_warga: '',
        regu: '',
        jenis_iuran: '',
        metode_bayar: '',
        status: '',
        start_date: '',
        end_date: '',
      }
    },

    async fetchDetailPembayaran(nik: string) {
      const api = usePembayaran()
      this.loadingDetail = true

      try {
        const res = await api.getDetailPembayaran(nik)

        this.itemSelected = res.data

        return res
      } finally {
        this.loadingDetail = false
      }
    },

    async fetchAddPembayaran(params: AddPembayaranPayload) {
      const api = usePembayaran()
      this.loading = true

      const formData = new FormData()

      // total bayar normalize
      let totalBayar = params.total_bayar
      if (typeof totalBayar === 'string') {
        totalBayar = Number(totalBayar.replace(/\./g, ''))
      }

      formData.append('nik', params.nik)
      formData.append('id_informasi_iuran', String(params.id_informasi_iuran))
      formData.append('tanggal_bayar', params.tanggal_bayar)
      formData.append('total_bayar', String(totalBayar))
      formData.append('metode_bayar', params.metode_bayar)

      // bulan (array)
      if (params.bulan && Array.isArray(params.bulan)) {
        params.bulan.forEach((item: any, index) => {
          // console.log(item)
          formData.append(`bulan[${index}]`, String(item))
        })
      }

      // bukti pembayaran (file only)
      if (params.bukti_pembayaran instanceof File) {
        formData.append('bukti_pembayaran', params.bukti_pembayaran)
      }

      try {
        const res = await api.addPembayaran(formData)
        return res
      } finally {
        this.loading = false
      }
    },

    async fetchUnpaidPembayaran(params?: { page?: number; limit?: number }) {
      if (this.isReloadDataUnpaidWarga) {
        this.unpaidWarga = []
        this.isReloadDataUnpaidWarga = false
      }

      if (!this.idInformasiIuran) {
        return
      }

      const api = usePembayaran()
      this.loading = true

      try {
        const res = await api.getUnpaidPembayaran({
          id_informasi_iuran: this.idInformasiIuran,
          bulan: this.bulan ?? undefined,
          nama_warga: this.namaWarga || undefined,
          page: params?.page,
          per_page: params?.limit,
        })

        this.unpaidWarga = [...this.unpaidWarga, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
      } finally {
        this.loading = false
      }
    },

    async fetchNotifyUnpaid(body: NotifyUnpaidPayload) {
      const api = usePembayaran()
      this.loadingSendNotifToAll = true

      try {
        const res = await api.notifyUnpaidResidents(body)
        return res
      } finally {
        this.loadingSendNotifToAll = false
      }
    },

    async fetchNotifyResidentAllUnpaid(nik: string) {
      const api = usePembayaran()
      this.loadingSendNotifToAll = true

      try {
        const res = await api.notifyResidentAllUnpaid({ nik })
        return res
      } finally {
        this.loadingSendNotifToAll = false
      }
    },

    async fetchNotifyResident(body: NotifyResidentPayload) {
      const api = usePembayaran()
      this.loadingSendNotif = true

      try {
        const res = await api.notifyResident(body)
        return res
      } finally {
        this.loadingSendNotif = false
      }
    },

    async fetchHistoryPaid(params?: { page?: number; limit?: number }) {
      if (!this.nikWarga) return

      const api = usePembayaran()
      this.loading = true

      try {
        const res = await api.getHistoryAlreadyPaid({
          nik: this.nikWarga,
          page: params?.page,
          per_page: params?.limit,
        })

        this.historyPaid = [...this.historyPaid, ...res.data.data]

        const { data, ...meta } = res.data
        this.metaHistoryPaid = meta
      } finally {
        this.loading = false
      }
    },

    async fetchPaidMonthWarga(params: { id_informasi_iuran: number, nik: string }) {
      const api = usePembayaran()
      this.loadingGetPaidMonthWarga = true

      this.monthPaidPaymentWarga = []

      try {
        const res = await api.getMonthPaidPembayaran(params)

        this.monthPaidPaymentWarga = res.data

        // console.log(this.monthPaidPaymentWarga)
      } finally {
        this.loadingGetPaidMonthWarga = false
      }
    },

    async fetchUnpaidPembayaranKetuaRegu(params?: { page?: number; limit?: number }) {
      if (this.isReloadDataUnpaidWarga) {
        this.unpaidWarga = []
        this.isReloadDataUnpaidWarga = false
      }

      const api = usePembayaran()
      this.loading = true

      try {
        const res = await api.getUnpaidPembayaranKetuaRegu({
          nama_warga: this.namaWarga || undefined,
          page: params?.page,
          per_page: params?.limit,
        })

        this.unpaidWarga = [...this.unpaidWarga, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
      } finally {
        this.loading = false
      }
    },

    async fetchHistoryUnpaid(params?: { page?: number; limit?: number }) {
      if (!this.nikWarga) return

      if (this.isReloadDataHistoryUnpaid) {
        this.historyUnpaid = []
        this.isReloadDataHistoryUnpaid = false
      }

      const api = usePembayaran()
      this.loading = true

      try {
        const res = await api.getHistoryNotYetPaid({
          nik: this.nikWarga,
          page: params?.page,
          per_page: params?.limit,
        })

        this.historyUnpaid = [...this.historyUnpaid, ...res.data.data]

        const { data, ...meta } = res.data
        this.metaHistoryUnpaid = meta
      } finally {
        this.loading = false
      }
    },

    async fetchPembayaranByRegu(params?: {
      id_informasi_iuran?: number
      id_regu?: number
      status_bayar?: string
      nama_warga?: string
      page?: number
      per_page?: number
    }) {
      if (this.isReloadDataPembayaranByRegu) {
        this.pembayaranByRegu = []
        this.isReloadDataPembayaranByRegu = false
      }

      const api = usePembayaran()
      this.loadingByRegu = true

      try {
        const res = await api.getPembayaranByRegu({
          per_page: 10,
          ...params,
        })

        this.pembayaranByRegu = [...this.pembayaranByRegu, ...res.data.data]
        const { data, ...meta } = res.data
        this.metaByRegu = meta
      } finally {
        this.loadingByRegu = false
      }
    },

  },
})

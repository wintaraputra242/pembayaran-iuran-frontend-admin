import { usePembayaran } from '@/composables/api/usePembayaran'
import type {
  AddPembayaranPayload,
  NotifyResidentPayload,
  NotifyUnpaidPayload,
  Pembayaran,
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
    reload: false,
    isReloadDataUnpaidWarga: false,

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
    monthPaidPaymentWarga: [] as number[] | string[]
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
        
    hasMoreUnpaidWarga: (state) => state.meta?.total !== state.unpaidWarga.length,
    
    hasMoreHistoryPaid: (state) => state.meta?.total !== state.historyPaid.length,
    hasMoreHistoryUnpaid: (state) => state.meta?.total !== state.historyUnpaid.length,
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

        console.log(this.filters)

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

    async fetchDetailPembayaran(id: number) {
      const api = usePembayaran()
      this.loading = true

      try {
        const res = await api.getDetailPembayaran(id)
        return res
      } finally {
        this.loading = false
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
          console.log(item)
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
        console.log(this.idInformasiIuran);
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

    async fetchHistoryUnpaid(params?: { page?: number; limit?: number }) {
      if (!this.nikWarga) return

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

    async fetchPaidMonthWarga(params: { id_informasi_iuran: number, nik: string }) {
      const api = usePembayaran()
      this.loadingGetPaidMonthWarga = true

      this.monthPaidPaymentWarga = []

      try {
        const res = await api.getMonthPaidPembayaran(params)

        this.monthPaidPaymentWarga = res.data

        console.log(this.monthPaidPaymentWarga)
      } finally {
        this.loadingGetPaidMonthWarga = false
      }
    },
  },
})

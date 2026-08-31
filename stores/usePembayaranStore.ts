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
    loadingQris: false,
    loadingDetail: false,
    loadingAction: false,
    reload: false,
    needsReload: false,
    isReloadDataUnpaidWarga: false,
    isReloadDataHistoryUnpaid: false,
    isReloadDataPembayaranByRegu: false,
    page: 0,

    filters: {
      nama_warga: '',
      regu: '',
      jenis_iuran: '',
      metode_bayar: '',
      status_bayar: '',
      start_date: '',
      end_date: '',
      pembayaran_id: ''
    },

    idInformasiIuran: 0,
    bulan: 0,
    idRegu: '',

    itemSelected: null as Pembayaran | null,

    nikWarga: '',
    historyPaid: [] as Pembayaran[],
    historyUnpaid: [] as UnpaidWarga[],
    monthPaidPaymentWarga: [] as number[] | string[],
    pembayaranByRegu: [] as PembayaranByRegu[],
    loadingByRegu: false,
    metaByRegu: {} as Record<string, any>,
    pendingPembayaran: [] as Pembayaran[],

    qrisData: null as { image: string; nama_rekening: string; nomor_rekening: string; keterangan: string } | null,

    cancelDialog: false,
    cancelReason: '',
    isLoadingCancel: false,
    itemToCancel: null as Pembayaran | null,
    unpaidWargaList: [] as any[],
    loadingUnpaid: false,
    metaUnpaidWarga: {} as Record<string, any>,
    riwayatKetuaRegu: [] as any[],
    loadingRiwayatKetua: false,
    metaRiwayatKetua: {} as Record<string, any>,
    detailPembayaranById: null as any,
    loadingDetailPembayaranById: false,
  }),

  getters: {
    hasData: (state) => state.pembayaran.length > 0,
    hasMore: (state) => state.meta?.total !== state.pembayaran.length,
    hasFilter: (state) =>
      !!state.filters.nama_warga ||
      !!state.filters.regu ||
      !!state.filters.jenis_iuran ||
      !!state.filters.metode_bayar ||
      !!state.filters.status_bayar ||
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
    async fetchDetailPembayaranById(id: number) {
      const api = usePembayaran()
      this.loadingDetailPembayaranById = true

      try {
        const res = await api.getDetailPembayaranById(id)

        this.detailPembayaranById = res.data

        return res
      } finally {
        this.loadingDetailPembayaranById = false
      }
    },

    async fetchPembayaran(params?: {
      page?: number
      limit?: number
      // true = ganti seluruh data dengan hasil fetch ini (dipakai pagination desktop).
      // false/undefined = tambahkan ke data yang sudah ada (dipakai infinite-scroll mobile).
      replace?: boolean
    }) {
      if (this.reload) {
        this.pembayaran = []
        this.reload = false
      }

      const api = usePembayaran()
      this.loading = true

      try {
        const newFilter: Record<string, string> = {}

        Object.entries(this.filters).forEach(([key, value]) => {
          if (!value) return

          // Backend menerima 'id', bukan 'pembayaran_id' — mapping nama param di sini
          const paramKey = key === 'pembayaran_id' ? 'id' : key
          newFilter[paramKey] = value
        })

        const res = await api.getPembayaran({
          page: params?.page,
          limit: params?.limit,
          ...newFilter,
        })

        this.pembayaran = params?.replace ? res.data.data : [...this.pembayaran, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta

        this.page = params?.page as number
      } finally {
        this.loading = false
      }
    },

    setFilter(
      key: keyof typeof this.filters | 'idInformasiIuran' | 'bulan' | 'idRegu' | 'nikWarga',
      value: string | number | null | undefined
    ) {
      if (key in this.filters) {
        const isEmpty = value === null || value === undefined || value === ''

        this.filters[key as keyof typeof this.filters] = isEmpty ? '' : String(value)
      } else {
        this[key as 'idInformasiIuran' | 'bulan'] = value ? Number(value) : (0 as any)
        this[key as 'idRegu' | 'nikWarga'] = (value ?? '') as string
      }
    },

    resetFilter() {
      this.filters = {
        nama_warga: '',
        regu: '',
        jenis_iuran: '',
        metode_bayar: '',
        status_bayar: '',
        start_date: '',
        end_date: '',
        pembayaran_id: ''
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

    async fetchUnpaidPembayaran(params?: { page?: number; limit?: number; replace?: boolean }) {
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
          id_regu: this.idRegu || undefined,
          page: params?.page,
          per_page: params?.limit,
        })

        this.unpaidWarga = params?.replace ? res.data.data : [...this.unpaidWarga, ...res.data.data]

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

    async fetchHistoryPaid(params?: { page?: number; limit?: number; replace?: boolean }) {
      if (!this.nikWarga) return

      const api = usePembayaran()
      this.loading = true

      try {
        const res = await api.getHistoryAlreadyPaid({
          nik: this.nikWarga,
          page: params?.page,
          per_page: params?.limit,
        })

        this.historyPaid = params?.replace ? res.data.data : [...this.historyPaid, ...res.data.data]

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

    async fetchUnpaidPembayaranKetuaRegu(params?: { page?: number; limit?: number; replace?: boolean }) {
      if (this.isReloadDataUnpaidWarga) {
        this.unpaidWarga = []
        this.isReloadDataUnpaidWarga = false
      }

      const api = usePembayaran()
      this.loading = true

      try {
        const res = await api.getUnpaidPembayaranKetuaRegu({
          nama_warga: this.idRegu || undefined,
          page: params?.page,
          per_page: params?.limit,
        })

        this.unpaidWarga = params?.replace ? res.data.data : [...this.unpaidWarga, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
      } finally {
        this.loading = false
      }
    },

    async fetchQris() {
      const composable = usePembayaran()
      this.loadingQris = true

      try {
        const res = await composable.getQris()
        this.qrisData = res?.data
      } finally {
        this.loadingQris = false
      }
    },

    async fetchHistoryUnpaid(params?: { page?: number; limit?: number; replace?: boolean }) {
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

        this.historyUnpaid = params?.replace ? res.data.data : [...this.historyUnpaid, ...res.data.data]

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
      replace?: boolean
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

        this.pembayaranByRegu = params?.replace ? res.data.data : [...this.pembayaranByRegu, ...res.data.data]
        const { data, ...meta } = res.data
        this.metaByRegu = meta
      } finally {
        this.loadingByRegu = false
      }
    },

    async fetchPendingPembayaran(params?: { page?: number; per_page?: number; replace?: boolean }) {
      if (this.reload) {
        this.pendingPembayaran = []
        this.reload = false
      }

      const composable = usePembayaran()
      this.loading = true

      try {
        const res = await composable.getPendingPembayaran({
          page: params?.page,
          per_page: params?.per_page ?? 10,
        })

        this.pendingPembayaran = (params?.replace || !(params?.page && params.page > 1))
          ? res.data.data
          : [...this.pendingPembayaran, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
        this.page = params?.page ?? 1
      } finally {
        this.loading = false
      }
    },

    async fetchApprovePembayaran(id: number) {
      const api = usePembayaran()
      this.loadingAction = true

      try {
        const res = await api.approvePembayaran(id)
        return res
      } finally {
        this.loadingAction = false
      }
    },

    async fetchRejectPembayaran(id: number, rejection_reason: string) {
      const api = usePembayaran()
      this.loadingAction = true

      try {
        const res = await api.rejectPembayaran(id, rejection_reason)
        return res
      } finally {
        this.loadingAction = false
      }
    },

    openCancelDialog(item: Pembayaran) {
      this.itemToCancel = item
      this.cancelReason = ''
      this.cancelDialog = true
    },

    closeCancelDialog() {
      this.itemToCancel = null
      this.cancelReason = ''
      this.cancelDialog = false
    },

    async submitCancel(from?: string) {
      if (!this.itemToCancel || !this.cancelReason.trim()) return

      const api = usePembayaran()
      this.isLoadingCancel = true

      try {
        await api.cancelPembayaran(this.itemToCancel.id, this.cancelReason)
        this.closeCancelDialog()

        // Reload data
        this.reload = true
        this.pembayaran = []

        if (from === 'dashboard') {
          await useDashboardStore().fetchDashboard('pembayaran')

          return
        }
        await this.fetchPembayaran({ limit: 10, page: 1 })
      } catch (e) {
        // error sudah dihandle useApi
      } finally {
        this.isLoadingCancel = false
      }
    },

    async fetchUnpaidWarga(params?: {
      id_regu?: number
      id_informasi_iuran?: number
      bulan?: number
      nama_warga?: string
      page?: number
      per_page?: number
    }) {
      const api = usePembayaran()
      this.loadingUnpaid = true

      try {
        const res = await api.getUnpaidWarga(params)

        if (params?.page && params.page > 1) {
          this.unpaidWargaList = [...this.unpaidWargaList, ...res.data.data]
        } else {
          this.unpaidWargaList = res.data.data
        }

        const { data, ...meta } = res.data
        this.metaUnpaidWarga = meta
      } finally {
        this.loadingUnpaid = false
      }
    },

    async fetchRiwayatKetuaRegu(params?: {
      start_date?: string
      end_date?: string
      status_bayar?: string
      nama_warga?: string
      per_page?: number
      page?: number
    }) {
      const api = usePembayaran()
      this.loadingRiwayatKetua = true

      try {
        const res = await api.getRiwayatKetuaRegu(params)

        // Reset kalau page 1 atau tidak ada page
        if (!params?.page || params.page === 1) {
          this.riwayatKetuaRegu = res.data.data
        } else {
          this.riwayatKetuaRegu = [...this.riwayatKetuaRegu, ...res.data.data]
        }

        const { data, ...meta } = res.data
        this.metaRiwayatKetua = meta
      } finally {
        this.loadingRiwayatKetua = false
      }
    },

  },
})

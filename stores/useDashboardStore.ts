import { useDashboard } from '@/composables/api/useDashboard'
import type { ActivityLog } from '@/types/api/activity'
import type { MasterWarga } from '@/types/api/master-warga'
import type { Notification } from '@/types/api/notification'
import type { Pembayaran } from '@/types/api/pembayaran'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    totalWarga: 0,
    totalPembayaranHariIni: 0,
    sudahBayarBulanIni: 0,
    belumBayarBulanIni: 0,
    iuranKematianAktif: 0,
    pembayaranMenunggu: 0,
    namaBulan: '',
    tahun: '',

    notifications: [] as Notification[],
    payments: [] as Pembayaran[],
    unpaidResidents: [] as MasterWarga[],
    activityLogs: [] as ActivityLog[],

    loading: false,
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    hasPayments: (state) => state.payments.length > 0,
    hasUnpaidResidents: (state) => state.unpaidResidents.length > 0,
    hasActivityLogs: (state) => state.activityLogs.length > 0,
  },

  actions: {
    async fetchDashboard(type: 'notifikasi' | 'pembayaran' | 'warga_belum_bayar' | 'activity_log') {
      const api = useDashboard()
      this.loading = true

      try {
        const res = await api.getDashboard({ type })

        this.totalWarga = res.data.total_warga
        this.totalPembayaranHariIni = res.data.total_pembayaran_hari_ini
        this.sudahBayarBulanIni = res.data.sudah_bayar_bulan_ini
        this.belumBayarBulanIni = res.data.belum_bayar_bulan_ini
        this.iuranKematianAktif = res.data.iuran_kematian_aktif
        this.pembayaranMenunggu = res.data.pembayaran_menunggu
        this.namaBulan = res.data.nama_bulan
        this.tahun = res.data.tahun

        switch (type) {
          case 'notifikasi':
            this.notifications = res.data.data as Notification[]
            break
          case 'pembayaran':
            this.payments = res.data.data as Pembayaran[]
            break
          case 'warga_belum_bayar':
            this.unpaidResidents = res.data.data as MasterWarga[]
            break
          case 'activity_log':
            this.activityLogs = res.data.data as ActivityLog[]
            break
        }
      } finally {
        this.loading = false
      }
    },
  },
})

import { useMasterRegu } from '@/composables/api/useMasterRegu'
import type { AddAnggotaPayload, AnggotaRegu, CreateReguPayload, MasterRegu } from '@/types/api/master-regu'
import type { PaginationMeta } from '@/types/common'
import { defineStore } from 'pinia'

export const useMasterReguStore = defineStore('master-regu', {
  state: () => ({
    regu: [] as MasterRegu[],
    anggotaRegu: [] as AnggotaRegu[],
    meta: null as PaginationMeta | null,
    loading: false,
    loadingAnggota: false,
    reload: false,
    leaderAvailable: false,

    filters: {
      nama_regu: '',
      status_keaktifan: '',
    },
  }),

  getters: {
    hasData: (state) => state.regu.length > 0,
    hasMore: (state) => state.meta?.total !== state.regu.length,
    hasFilter: (state) => !!state.filters.nama_regu || !!state.filters.status_keaktifan
  },

  actions: {
    async fetchRegu(params?: {
      page?: number
      limit?: number
    }) {
      if (this.reload) {
        this.regu = []
        this.reload = false
      }

      const api = useMasterRegu()
      this.loading = true

      try {
        const newFilter: Record<string, string> = {}

        Object.entries(this.filters).forEach(([key, value]) => {

          if (value) {
            newFilter[key] = value
          }
        })

        const res = await api.getRegu({
          page: params?.page,
          limit: params?.limit,
          ...newFilter,
        })

        this.regu = [...this.regu, ...res.data.data]

        const { data, ...meta } = res.data
        this.meta = meta
      } finally {
        this.loading = false
      }
    },

    async createRegu(params: CreateReguPayload) {
      if (this.filters.nama_regu) {
        this.regu = []
      }

      const api = useMasterRegu()
      this.loading = true

      try {
        const res = await api.createRegu(params)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchUpdateRegu(params: CreateReguPayload, id: number) {
      const api = useMasterRegu()
      this.loading = true

      try {
        const res = await api.updateRegu(params, id)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchDeleteRegu(id: number) {
    
      const api = useMasterRegu()
      this.loading = true

      try {
        const res = await api.deleteRegu(id)

        return res
      } finally {
        this.loading = false
      }
    },

    async fetchUpdateStatus(params: { id: number, status_keaktifan: 'aktif' | 'tidak_aktif' }) {
    
      const api = useMasterRegu()
      this.loading = true

      try {
        const res = await api.updateStatusRegu(params)

        return res
      } finally {
        this.loading = false
      }
    },

    setFilter(key: keyof typeof this.filters, value: string) {
      this.filters[key] = value
    },

    resetFilter() {
      this.filters = {
        nama_regu: '',
        status_keaktifan: ''
      }
    },

    // Anggota Regu
    async fetchAnggotaRegu(id_regu: number) {

      const api = useMasterRegu()
      this.loadingAnggota = true
      this.anggotaRegu = []

      try {

        const res = await api.getAnggotaRegu({
          id_regu,
        })

        this.anggotaRegu = res.data.data
        this.leaderAvailable = res.data.leader_available

        return res
      } finally {
        this.loadingAnggota = false
      }
    },

    async fetchAddAnggota(params: AddAnggotaPayload) {
      const api = useMasterRegu()
      this.loadingAnggota = true

      try {
        const res = await api.addAnggotaRegu(params)

        return res
      } finally {
        this.loadingAnggota = false
      }
    },

    async fetchResetAnggota(id: number) {
    
      const api = useMasterRegu()
      this.loadingAnggota = true

      try {
        const res = await api.resetAnggota(id)

        return res
      } finally {
        this.loadingAnggota = false
      }
    },

    async fetchResetAnggotaByRegu(id_regu: number) {
    
      const api = useMasterRegu()
      this.loadingAnggota = true

      try {
        const res = await api.resetAnggotaByRegu(id_regu)

        return res
      } finally {
        this.loadingAnggota = false
      }
    },

    async fetchResetAnggotaAll() {
    
      const api = useMasterRegu()
      this.loadingAnggota = true

      try {
        const res = await api.resetAnggotaAll()

        return res
      } finally {
        this.loadingAnggota = false
      }
    },

    async fetchSetLeaderAnggota(params: { id_regu: number, nik: string }) {
      const api = useMasterRegu()
      this.loadingAnggota = true

      try {
        const res = await api.setLeaderAnggota(params)

        return res
      } finally {
        this.loadingAnggota = false
      }
    },

  },
})

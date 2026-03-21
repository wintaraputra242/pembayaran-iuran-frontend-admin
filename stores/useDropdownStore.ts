import { useDropdown } from '@/composables/api/useDropdown'
import type { AnggotaReguForDropdown, InformasiIuranForDropdown, ReguForDropdown, WargaForDropdown, WargaPembayaranForDropdown } from '@/types/api/dropdown'
import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    itemWargaForAddAnggota: [] as WargaForDropdown[],
    itemWargaForDropdown: [] as WargaForDropdown[],
    itemWargaForPembayaran: [] as WargaPembayaranForDropdown[],
    itemInformasiIuranForDropdown: [] as InformasiIuranForDropdown[],
    reguForDropdown: [] as ReguForDropdown[],
    anggotaReguForDropdown: [] as AnggotaReguForDropdown[],
    loading: {
      wargaForAddAnggota: false,
      wargaForDropdown: false,
      wargaForPembayaran: false,
      informasiIuranForDropdown: false,
      reguForDropdown: false,
      anggotaReguForDropdown: false
    }
  }),

  getters: {
    hasDataWargaForAddAnggota: (state) => state.itemWargaForAddAnggota?.length > 0,
    hasDataWargaForDropdown: (state) => state.itemWargaForAddAnggota?.length > 0,
    hasDataInformasiIuranForDropdown: (state) => state.itemInformasiIuranForDropdown?.length > 0,
  },

  actions: {
    async fetchWargaForAddAnggota() {

      const api = useDropdown()
      this.loading.wargaForAddAnggota = true
      this.itemWargaForAddAnggota = []

      try {

        const res = await api.getWargaForDropdownAddAnggota()

        this.itemWargaForAddAnggota = res.data

        return res
      } finally {
        this.loading.wargaForAddAnggota = false
      }
    },

    async fetchWargaForDropdown() {

      const api = useDropdown()
      this.loading.wargaForDropdown = true
      this.itemWargaForDropdown = []

      try {
        const res = await api.getWargaForDropdown()

        this.itemWargaForDropdown = res.data

        console.log(this.itemWargaForDropdown);
        

        return res
      } finally {
        this.loading.wargaForDropdown = false
      }
    },
    
    async fetchWargaForPembayaran(id_informasi_iuran: number, regu_id?: number | string) {

      const api = useDropdown()
      this.loading.wargaForPembayaran = true
      this.itemWargaForPembayaran = []

      try {
        const res = await api.getWargaForDropdownPembayaran({ regu_id, id_informasi_iuran })

        this.itemWargaForPembayaran = res.data

        console.log(this.itemWargaForPembayaran);
        

        return res
      } finally {
        this.loading.wargaForPembayaran = false
      }
    },

    async fetchInformasiIuranForDropdown() {

      const api = useDropdown()
      this.loading.informasiIuranForDropdown = true
      this.itemInformasiIuranForDropdown = []

      try {
        const res = await api.getInformasiIuranForDropdown()

        this.itemInformasiIuranForDropdown = res.data

        return res
      } finally {
        this.loading.informasiIuranForDropdown = false
      }
    },

    async fetchReguForDropdown() {

      const api = useDropdown()
      this.loading.reguForDropdown = true
      this.reguForDropdown = []

      try {
        const res = await api.getReguForDropdown()

        this.reguForDropdown = res.data

        return res
      } finally {
        this.loading.reguForDropdown = false
      }
    },

    async fetchAnggotaReguForDropdown() {

      const api = useDropdown()
      this.loading.anggotaReguForDropdown = true
      this.anggotaReguForDropdown = []

      try {
        const res = await api.getAnggotaReguForDropdown()

        this.anggotaReguForDropdown = res.data

        return res
      } finally {
        this.loading.anggotaReguForDropdown = false
      }
    },
  },
})

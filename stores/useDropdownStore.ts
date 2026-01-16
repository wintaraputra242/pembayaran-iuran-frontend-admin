import { useDropdown } from '@/composables/api/useDropdown'
import type { WargaForDropdownAddAnggota } from '@/types/api/dropdown'
import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    itemWargaForAddAnggota: [] as WargaForDropdownAddAnggota[],
    loading: {
      wargaForAddAnggota: false
    }
  }),

  getters: {
    hasDataWargaForAddAnggota: (state) => state.itemWargaForAddAnggota?.length > 0,
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
  },
})

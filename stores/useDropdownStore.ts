import { useDropdown } from '@/composables/api/useDropdown'
import type { WargaForDropdown } from '@/types/api/dropdown'
import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    itemWargaForAddAnggota: [] as WargaForDropdown[],
    itemWargaForDropdown: [] as WargaForDropdown[],
    loading: {
      wargaForAddAnggota: false,
      wargaForDropdown: false
    }
  }),

  getters: {
    hasDataWargaForAddAnggota: (state) => state.itemWargaForAddAnggota?.length > 0,
    hasDataWargaForDropdown: (state) => state.itemWargaForAddAnggota?.length > 0,
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
  },
})

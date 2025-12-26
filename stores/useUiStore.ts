import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    errorDialog: {
      show: false,
      title: '',
      message: '',
    },
    isLoading: true
  }),

  actions: {
    showError(message: string, title = 'Terjadi Kesalahan') {
      this.errorDialog = {
        show: true,
        title,
        message,
      }
    },

    closeError() {
      this.errorDialog.show = false
    },

    startLoading() {
      this.isLoading = true
    },

    endLoading() {
      this.isLoading = false
    }
  },
})

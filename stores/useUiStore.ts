import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    errorDialog: {
      show: false,
      title: '',
      message: '',
    },
    successDialog: {
      show: false,
      title: '',
      message: '',
    },
    isLoading: true,
    firstLoadWeb: true,
  }),

  actions: {
    showError(message: string, title = 'Gagal') {
      this.errorDialog = {
        show: true,
        title,
        message,
      }
    },

    closeError() {
      this.errorDialog.show = false
    },

    showSuccess(message: string, title = 'Berhasil') {
      this.successDialog = {
        show: true,
        title,
        message,
      }
    },

    closeSuccess() {
      this.successDialog.show = false
    },

    startLoading() {
      this.isLoading = true
    },

    endLoading() {
      this.isLoading = false
    },

    changeStatusFirstLoadWebToFalse() {
      this.firstLoadWeb = false
    }
  },
})

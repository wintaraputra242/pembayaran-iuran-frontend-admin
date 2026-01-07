export type ToastColor =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    message: '',
    color: 'info' as ToastColor,
    timeout: 3000,
  }),

  actions: {
    open(
      message: string,
      options?: {
        color?: ToastColor
        timeout?: number
      }
    ) {
      // 🔁 reset dulu supaya toast lama benar-benar hilang
      this.show = false

      nextTick(() => {
        this.message = message
        this.color = options?.color ?? 'info'
        this.timeout = options?.timeout ?? 3000
        this.show = true
      })
    },

    close() {
      this.show = false
    },
  },
})

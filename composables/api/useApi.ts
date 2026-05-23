export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const authStore = useAuthStore()
  const uiStore = useUiStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      const token = authStore.token
      if (token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${token}`)
        options.headers.set('Accept', 'application/json')
      }
    },

    onRequestError({ error }) {
      if (
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.message?.includes('fetch')
      ) {
        uiStore.showError('Coba cek internet Anda.', 'Tidak Ada Internet')
        return
      }

      uiStore.showError(error.message, 'Terjadi Kesalahan')
    },

    async onResponseError({ response }) {
      const status = response.status
      const data = response._data

      if (status === 401) {
        const isLoginEndpoint = response.url?.includes('/auth/login')

        if (!isLoginEndpoint) {
          authStore.logout()
          router.push('/login')
        }

        throw {
          status,
          message: data?.message || 'Terjadi kesalahan',
          errors: data?.errors || null,
          raw: response,
        }
      }

      uiStore.showError(data?.errors ?? data?.message, 'Gagal')

      throw {
        status,
        message: data?.message || 'Terjadi kesalahan',
        errors: data?.errors || null,
        raw: response,
      }
    },
  })

  return { api }
}

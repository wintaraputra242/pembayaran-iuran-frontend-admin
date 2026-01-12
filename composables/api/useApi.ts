export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const authStore = useAuthStore()
  const uiStore = useUiStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',

    onRequest({ options }) {
      const csrf = useCookie('XSRF-TOKEN').value
      if (csrf) {
        options.headers = new Headers(options.headers)
        options.headers.set('X-XSRF-TOKEN', csrf)
      }
    },

    onRequestError({ error }) {
      // Tidak ada internet / network error
      if (
        (
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError') ||
          error.message?.includes('fetch')
        )
      ) {
        uiStore.showError('Coba cek internet Anda.', 'Tidak Ada Internet')

        return
      }

      // Error lain
      console.error('Request error lainnya:', error)
      uiStore.showError(error.message, 'Terjadi Kesalahan')
    },

    async onResponseError({ response }) {
      const status = response.status
      const data = response._data

      if (status === 419) {
        try {
          await $fetch(
            `${config.public.apiBase}/sanctum/csrf-cookie`,
            { credentials: 'include' }
          )
        } catch {}
      }

      if (status === 401) {
        authStore.logout()
        router.push('/login')
      }

      if (data?.code !== 401) {
        uiStore.showError(data?.errors ?? data?.message, 'Gagal')
      }


      throw {
        status,
        message: data?.message || 'Terjadi kesalahan',
        errors: data?.errors || null,
        raw: response,
      }
    },
  })

  const fetchCsrf = async () => {
    await  $fetch('http://localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include'
    })
  }
  

  return {
    api,
    fetchCsrf
  }
}

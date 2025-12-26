export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const router = useRouter()

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

      throw {
        status,
        message: data?.message || 'Terjadi kesalahan',
        errors: data?.errors || null,
        raw: response,
      }
    },
  })

  return api
}

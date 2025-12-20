export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  if (auth.role !== 'admin') {
    throw createError({
      statusCode: 404,
      // statusMessage: 'Halaman tidak ditemukan'
    })
  }
})

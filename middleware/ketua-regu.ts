export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  if (auth.role !== 'ketua_regu') {
    throw createError({
      statusCode: 404,
      // statusMessage: 'Halaman tidak ditemukan'
    })
  }
})

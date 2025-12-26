export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.role !== 'ketua_regu') {
    throw createError({ statusCode: 404 })
  }
})

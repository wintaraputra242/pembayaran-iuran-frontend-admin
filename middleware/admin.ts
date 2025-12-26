export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.role !== 'admin') {
    throw createError({ statusCode: 404 })
  }
})

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  const allowedRoles = ['admin', 'ketua_regu']

  if (!allowedRoles.includes(authStore.user?.role as string)) {
    throw createError({ statusCode: 404 })
  }
})

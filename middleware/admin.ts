export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  if (auth.role !== 'ketua_regu') {
    return navigateTo('/404', { replace: true })
  }
})

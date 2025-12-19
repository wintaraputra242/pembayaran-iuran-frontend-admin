export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  if (auth.role !== 'admin') {
    return navigateTo('/404', { replace: true })
  }
})

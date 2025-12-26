export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.public) return

  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    return navigateTo('/login')
  }
})

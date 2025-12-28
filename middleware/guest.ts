export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.isLoggedIn) {
    const redirect = useCookie('redirect_after_login')

    if (redirect.value) {
      const path = redirect.value
      // redirect.value = null
      console.log(path);

      return navigateTo(path)
    }

    return navigateTo(authStore.role === 'admin' ? '/' : '/create-pembayaran')
  }
})

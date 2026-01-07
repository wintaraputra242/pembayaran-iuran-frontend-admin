export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const uiStore = useUiStore()

  if (to.meta.public) return

  const ignoredPaths = [
    /^\/\.well-known/,
    /^\/_nuxt/,
    /^\/dev-sw\.js$/,
    /^\/.*\.(json|js|css|map|ico|png|jpg|svg)$/
  ]

  if (ignoredPaths.some((pattern) => pattern.test(to.path))) {
    return
  }

  if (!authStore.isLoggedIn) {
    const redirect = useCookie('redirect_after_login')
    redirect.value = to.path

    return navigateTo('/login')
  }
})

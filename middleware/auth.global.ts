export default defineNuxtRouteMiddleware((to) => {
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

  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    const redirect = useCookie('redirect_after_login')
    redirect.value = to.path

    const test = useCookie('test')
    test.value = to.path

    return navigateTo('/login')
  }
})

import { useAuth } from "@/composables/api/useAuth"

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  const ignoredPaths = [
    /^\/\.well-known/,
    /^\/_nuxt/,
    /^\/dev-sw\.js$/,
    /^\/.*\.(json|js|css|map|ico|png|jpg|svg)$/,
  ]

  if (ignoredPaths.some((pattern) => pattern.test(to.path))) return

  const isLoggedIn = !!authStore.token

  if (isLoggedIn && !authStore.fetched) {
    const { fetchUser } = useAuth()
    await fetchUser()
  }

  if (to.meta.guest) {
    if (!isLoggedIn) return
    return navigateTo(authStore.role === 'admin' ? '/' : '/create-pembayaran')
  }

  if (!isLoggedIn) {
    if (import.meta.client) {
      localStorage.setItem('redirect_after_login', to.path)
    }
    return navigateTo('/login')
  }

  if (to.meta.onlyAdmin && authStore.role !== 'admin') {
    console.log('BLOCKED onlyAdmin — role:', authStore.role)
    return abortNavigation()
  }

  if (to.meta.onlyKetuaRegu && authStore.role !== 'ketua_regu') {
    console.log('BLOCKED onlyKetuaRegu — role:', authStore.role)
    return abortNavigation()
  }

  if (to.meta.adminAndKetuaRegu) {
    const allowed = ['admin', 'ketua_regu']
    if (!allowed.includes(authStore.role as string)) {
      console.log('BLOCKED adminAndKetuaRegu — role:', authStore.role)
      return abortNavigation()
    }
  }
})

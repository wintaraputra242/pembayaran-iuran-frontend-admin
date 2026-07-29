
export default defineNuxtPlugin(async () => {
  // const authStore = useAuthStore()
  const uiStore = useUiStore()

  // if (authStore.fetched) return

  // try {
  //   const { api } = useApi()
  //   const res: MeResponse = await api('/auth/me')

  //   authStore.setUser(res.data)
  // } catch (e) {
  //   authStore.logout()
  // } finally {
    uiStore.endLoading()
  // }
})

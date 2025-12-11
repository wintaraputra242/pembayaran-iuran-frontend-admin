import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useScrollStatus(offset: number = 10) {
  const isScrolled = ref(false)

  const isOverlayActive = ref(false)

  const checkOverlay = () => {
    // Vuetify selalu menambahkan .v-overlay--active ketika ada dialog/overlay terbuka
    const activeOverlay = document.querySelector('.v-overlay--active')
    isOverlayActive.value = !!activeOverlay
  }

  const handleScroll = (): void => {
    if (isOverlayActive.value) return

    isScrolled.value = window.scrollY > offset
  }

  onMounted(() => {
    isScrolled.value = window.scrollY > offset
    checkOverlay()
    const observer = new MutationObserver(checkOverlay)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })
    window.addEventListener('scroll', handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isScrolled
  }
}

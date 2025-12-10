import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useScrollStatus(offset: number = 10) {
  const isScrolled = ref(false)

  const handleScroll = (): void => {
    isScrolled.value = window.scrollY > offset
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isScrolled
  }
}

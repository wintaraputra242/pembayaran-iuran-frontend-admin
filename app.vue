<script setup lang="ts">
import Toast from '@/components/Toast.vue';

const uiStore = useUiStore()
// const authStore = useAuthStore()
// const { fetchUser } = useAuth()

// const authStore = useAuthStore()

// onMounted(() => {
//   if (authStore.token && !authStore.fetched) {
//     authStore.fetched = true
//   }
// })

</script>

<template>
  <VApp>
    <NuxtLayout>
      <NuxtPage />
      <LoadingFirstLoad v-if="uiStore.isLoading" />
    </NuxtLayout>

    <Toast />
  </VApp>
</template>

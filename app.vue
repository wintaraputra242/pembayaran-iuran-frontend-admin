<script setup lang="ts">
import Toast from '@/components/Toast.vue';
import PwaPrompt from './components/PwaPrompt.vue';

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

  <Head>
    <Meta name="theme-color" content="#ffffff" />
    <Meta name="mobile-web-app-capable" content="yes" />
    <Meta name="apple-mobile-web-app-capable" content="yes" />
    <Meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <Meta name="apple-mobile-web-app-title" content="Iuran Trijata" />
    <Link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
  </Head>

  <VApp>
    <NuxtLayout>
      <NuxtPage />
      <LoadingFirstLoad v-if="uiStore.isLoading" />
      <PwaPrompt />
    </NuxtLayout>

    <Toast />
  </VApp>
</template>

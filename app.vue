<script setup lang="ts">
import Toast from '@/components/Toast.vue';



// const { isMobile } = useDevice()
// if (isMobile)
  // configStore.appContentLayoutNav = 'vertical'

const uiStore = useUiStore()
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

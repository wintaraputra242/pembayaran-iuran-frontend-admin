<script setup lang="ts">


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

  </VApp>
</template>

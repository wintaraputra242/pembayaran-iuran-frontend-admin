<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'manifest',
      href: '/manifest.webmanifest'
    }
  ]
})


const { isMobile } = useDevice()
if (isMobile)
  configStore.appContentLayoutNav = 'vertical'
</script>

<template>
  <VApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </VApp>
</template>

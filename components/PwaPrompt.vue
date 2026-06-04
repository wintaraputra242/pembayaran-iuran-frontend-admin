<script setup lang="ts">
const { $pwa } = useNuxtApp()
</script>

<template>
  <VSnackbar v-if="$pwa?.showInstallPrompt" :model-value="true" timeout="-1" location="bottom" color="primary">
    Pasang aplikasi ini di perangkat Anda

    <template #actions>
      <VBtn variant="text" @click="$pwa.cancelInstall()">
        Nanti
      </VBtn>
      <VBtn variant="flat" color="white" @click="$pwa.install()">
        Pasang
      </VBtn>
    </template>
  </VSnackbar>
</template>

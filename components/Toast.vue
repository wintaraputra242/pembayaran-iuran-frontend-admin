<script setup lang="ts">
const toast = useToastStore()
</script>

<template>
  <VSnackbar
    v-model="toast.show"
    :timeout="toast.timeout"
    :color="toast.color"
    location="top right"
    variant="flat"
  >
    {{ toast.message }}

    <template #actions>
      <VBtn
        icon="ri-close-line"
        variant="text"
        @click="toast.close"
      />
    </template>
  </VSnackbar>
</template>

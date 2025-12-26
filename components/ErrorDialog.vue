<script setup lang="ts">
import errorImg from '@images/pages/error.png';
  
const props = withDefaults(defineProps<{
  show: boolean,
  title?: string,
  message?: string,
}>(), {
  show: false,
  title: 'Error',
  message: 'Terjadi Kesalahan.',
})

const emits = defineEmits<{
  (e: 'close'): void;
}>()
</script>

<template>
  <VDialog v-model="props.show" max-width="420">
    <VCard>
      <VCardItem class="text-center">
        <VImg :src="errorImg" class="mx-auto" width="70%" />
        <p class="ma-0 text-h5 mb-1">{{ props.title }}</p>
        <p class="ma-0">{{ props.message }}</p>
      </VCardItem>

      <VCardActions>
        <VBtn block @click="emits('close')">
          OK
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

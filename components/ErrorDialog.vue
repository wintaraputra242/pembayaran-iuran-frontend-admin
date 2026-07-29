<script setup lang="ts">
import error from '@images/pages/error_new.png';
  
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
      <VCardTitle class="text-h6 px-0">
        <div class="d-flex align-center justify-end">
          <div class="px-2">
            <IconBtn variant="text" color="secondary" size="x-small"  @click="emits('close')">
              <VIcon icon="ri-close-line" />
            </IconBtn>
          </div>
        </div>
      </VCardTitle>

      <VCardItem class="text-body-2">
        <VImg :src="error" width="10rem" class="mx-auto" />
      </VCardItem>

      <VCardText>
        <h3 class="text-center mb-3">{{ title }}</h3>
        <p class="text-center text-body-2 ma-0">{{ message }}</p>
      </VCardText>

      <VCardActions class="justify-end gap-2">
        <VBtn
          color="secondary"
          variant="text"
          size="small"
          @click="emits('close')"
        >
          OK
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const modelValueLocal = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => (modelValueLocal.value = val)
)

watch(modelValueLocal, val => emit('update:modelValue', val))

const handleClose = () => {
  modelValueLocal.value = false
}
</script>

<template>
  <VDialog v-model="modelValueLocal" max-width="400" persistent>
    <VCard class="pa-1">
      <!-- Title -->
      <VCardTitle class="text-h6 px-0">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2 px-4">
            <VIcon icon="ri-qr-code-line" color="primary" size="20" />
            <span>Preview QRIS</span>
          </div>
          <div class="px-2">
            <IconBtn variant="text" color="secondary" size="x-small" @click="handleClose">
              <VIcon icon="ri-close-line" />
            </IconBtn>
          </div>
        </div>
      </VCardTitle>

      <VDivider />

      <VCardText class="pt-4">
        <!-- Gambar QRIS -->
        <div class="d-flex justify-center">
          <img v-if="item?.image" :src="item.image"
            style="width: 100%; max-width: 280px; height: auto; border-radius: 12px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));" />
          <div v-else class="d-flex flex-column align-center justify-center gap-2 rounded-lg"
            style="width: 280px; height: 280px; background: rgba(var(--v-theme-surface-variant), 0.5); border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));">
            <VIcon icon="ri-qr-code-line" size="48" color="secondary" style="opacity: 0.4;" />
            <span class="text-body-2 text-medium-emphasis">Gambar tidak tersedia</span>
          </div>
        </div>
      </VCardText>

      <VCardActions class="justify-end gap-2">
        <VBtn color="secondary" variant="text" size="small" @click="handleClose">
          <VIcon icon="ri-close-line" class="me-1" />
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

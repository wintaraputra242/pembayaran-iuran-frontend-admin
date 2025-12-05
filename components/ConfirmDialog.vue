<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Konfirmasi" },
  message: { type: String, default: "Yakin ingin melanjutkan?" },
  confirmText: { type: String, default: "Ya" },
  cancelText: { type: String, default: "Batal" },
  confirmColor: { type: String, default: "error" },
  confirmIcon: { type: String, default: "ri-delete-bin-line" },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(["update:modelValue", "confirm", "cancel"])

// Local state agar dialog tetap bisa dikontrol dari dalam
const modelValueLocal = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => (modelValueLocal.value = val)
)

watch(modelValueLocal, val => emit("update:modelValue", val))

const handleCancel = () => {
  emit("cancel")
  modelValueLocal.value = false
}

const handleConfirm = () => {
  emit("confirm")
}
</script>

<template>
  <VDialog
    v-model="modelValueLocal"
    max-width="420"
    persistent
  >
    <VCard class="pa-1">
      <!-- Title -->
      <VCardTitle class="text-h6 px-0">
        <div class="d-flex align-center justify-space-between">
          <span class="px-4">{{ title }}</span>
          <div class="px-2">
            <IconBtn variant="text" color="secondary" size="x-small"  @click="handleCancel">
              <VIcon icon="ri-close-line" />
            </IconBtn>
          </div>
        </div>
      </VCardTitle>

      <!-- Message -->
      <VCardText class="text-body-2">
        {{ message }}
      </VCardText>

      <!-- Actions -->
      <VCardActions class="justify-end gap-2">
        <VBtn
          color="secondary"
          variant="text"
          :disabled="loading"
          size="small"
          @click="handleCancel"
        >
          <VIcon icon="ri-close-line" class="me-1" />
          {{ cancelText }}
        </VBtn>

        <VBtn
          :color="confirmColor"
          variant="flat"
          :loading="loading"
          size="small"
          @click="handleConfirm"
        >
          <VIcon :icon="confirmIcon" class="me-1" />
          {{ confirmText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

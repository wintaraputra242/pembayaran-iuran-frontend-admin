<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: File | null
  rules?: Array<(value: File | null) => true | string>
  isErrorSubmit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Generate preview jika modelValue dari parent berubah
watch(
  () => props.modelValue,
  newVal => {
    if (!newVal) {
      preview.value = null
      return
    }
    preview.value = URL.createObjectURL(newVal)
  },
  { immediate: true }
)

// Validasi rules
const validate = () => {
  if (!props.rules) return true

  for (const rule of props.rules) {
    const result = rule(props.modelValue)
    if (result !== true) {
      errorMessage.value = result
      return false
    }
  }

  errorMessage.value = null
  return true
}

// Re-validate setiap kali modelValue berubah
watch(() => props.modelValue, () => validate())

// Open camera
const openCamera = () => {
  fileInput.value?.click()
}

// Handle ketika foto diambil
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  preview.value = URL.createObjectURL(file)

  emit('update:modelValue', file)
  validate()
}

// Hapus foto
const removeImage = () => {
  preview.value = null
  emit('update:modelValue', null)

  if (fileInput.value) fileInput.value.value = ''

  validate()
}

watch(() => props.isErrorSubmit, (newVal) => newVal ? validate() : () => {})
</script>

<template>
  <div>
    <!-- Dropzone -->
    <div
      class="d-flex flex-column justify-center align-center rounded-lg border border-dashed py-6 px-4 cursor-pointer"
      :class="{
        'border-grey': !errorMessage,
        'border-error': !!errorMessage
      }"
      style="min-height: 180px;"
      @click="openCamera"
    >
      <template v-if="!preview">
        <VIcon size="48" class="mb-2">ri-camera-line</VIcon>
        <p class="text-body-2 text-center">
          Klik untuk mengambil foto bukti pembayaran
        </p>
      </template>

      <template v-else>
        <img
          :src="preview"
          alt="Preview"
          class="w-100 rounded-lg"
          style="object-fit: cover;"
        />

        <VBtn
          size="small"
          color="error"
          class="mt-3"
          @click.stop="removeImage"
        >
          <VIcon class="me-1">ri-delete-bin-line</VIcon>
          Hapus Foto
        </VBtn>
      </template>
    </div>

    <!-- Pesan Error -->
    <p v-if="errorMessage" class="text-error text-caption mt-1">
      {{ errorMessage }}
    </p>

    <!-- hidden input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="d-none"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.border-error {
  border-color: var(--v-theme-error) !important;
}
</style>

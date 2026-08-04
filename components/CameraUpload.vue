<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: File | null
  rules?: Array<(value: File | null) => true | string>
  isErrorSubmit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
}>()

const cameraInput = ref<HTMLInputElement | null>(null)
const galleryInput = ref<HTMLInputElement | null>(null)
const showPickerMenu = ref(false)
const preview = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const ALLOWED_TYPES = ['image/jpeg', 'image/png']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png']

const isAllowedFile = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext)
}

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

watch(
  () => props.modelValue,
  (newVal) => {
    if (preview.value) {
      URL.revokeObjectURL(preview.value)
    }

    if (!newVal) {
      preview.value = null
      return
    }

    preview.value = URL.createObjectURL(newVal)
    validate()
  },
  { immediate: true }
)

// Buka menu pilihan
const openPicker = () => {
  showPickerMenu.value = true
}

const chooseCamera = () => {
  showPickerMenu.value = false
  cameraInput.value?.click()
}

const chooseGallery = () => {
  showPickerMenu.value = false
  galleryInput.value?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!isAllowedFile(file)) {
    errorMessage.value = 'Format file harus JPG, JPEG, atau PNG.'
    emit('update:modelValue', null)
    target.value = ''
    return
  }

  preview.value = URL.createObjectURL(file)
  emit('update:modelValue', file)
  validate()
}

const removeImage = () => {
  preview.value = null
  emit('update:modelValue', null)

  if (cameraInput.value) cameraInput.value.value = ''
  if (galleryInput.value) galleryInput.value.value = ''

  validate()
}

watch(() => props.isErrorSubmit, (newVal) => {
  if (newVal) validate()
})
</script>

<template>
  <div>
    <!-- Dropzone -->
    <div class="d-flex flex-column justify-center align-center rounded-lg border border-dashed py-6 px-4 cursor-pointer"
      :class="{
        'border-grey': !errorMessage,
        'border-error': !!errorMessage
      }" style="min-height: 180px;" @click="!preview && openPicker()">
      <template v-if="!preview">
        <VIcon size="48" class="mb-2">ri-camera-line</VIcon>
        <p class="text-body-2 text-center">
          Klik untuk upload bukti pembayaran
        </p>
        <p class="text-caption text-medium-emphasis text-center mb-0">
          Format: JPG, JPEG, PNG
        </p>
      </template>

      <template v-else>
        <img :src="preview" alt="Preview" class="w-100 rounded-lg" style="object-fit: cover;" />

        <div class="d-flex gap-2 mt-3">
          <VBtn size="small" variant="tonal" @click.stop="openPicker">
            <VIcon class="me-1">ri-refresh-line</VIcon>
            Ganti Foto
          </VBtn>
          <VBtn size="small" color="error" @click.stop="removeImage">
            <VIcon class="me-1">ri-delete-bin-line</VIcon>
            Hapus
          </VBtn>
        </div>
      </template>
    </div>

    <!-- Pesan Error -->
    <p v-if="errorMessage" class="text-error text-caption mt-1">
      {{ errorMessage }}
    </p>

    <!-- Dialog pilihan sumber gambar -->
    <VDialog v-model="showPickerMenu" max-width="320">
      <VCard>
        <VCardText class="pa-2">
          <VListItem prepend-icon="ri-camera-line" title="Ambil Foto" @click="chooseCamera" />
          <VListItem prepend-icon="ri-image-line" title="Upload dari Galeri" @click="chooseGallery" />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- hidden input: kamera -->
    <input ref="cameraInput" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" capture="environment"
      class="d-none" @change="handleFileChange" />

    <!-- hidden input: galeri (tanpa atribut capture) -->
    <input ref="galleryInput" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" class="d-none"
      @change="handleFileChange" />
  </div>
</template>

<style scoped>
.border-error {
  border-color: var(--v-theme-error) !important;
}
</style>

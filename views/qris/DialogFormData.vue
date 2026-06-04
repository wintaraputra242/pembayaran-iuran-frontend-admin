<script lang="ts" setup>
import type { QrSetting } from '@/composables/api/useQrSetting'

export interface QrisPayload {
  nama_rekening: string
  nomor_rekening: string
  keterangan?: string
  gambar?: File | null
}

const emit = defineEmits<{
  (e: 'submit', params: QrisPayload): void
  (e: 'close'): void
}>()

const props = withDefaults(defineProps<{
  isShow: boolean
  isEdit: boolean
  isFetchSuccess: boolean
  loading: boolean
  item?: QrSetting | null
}>(), {
  isShow: false,
  isEdit: false,
  item: null,
})

const form = ref()
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)

const defaultParams: QrisPayload = {
  nama_rekening: '',
  nomor_rekening: '',
  keterangan: '',
  gambar: null,
}
const params = reactive({ ...defaultParams })

const rules = {
  nama_rekening: (v: string) => {
    if (!v) return 'Nama rekening wajib diisi'
    if (v.length < 3) return 'Nama minimal 3 karakter'
    return true
  },
  nomor_rekening: (v: string) => {
    if (!v) return 'Nomor rekening wajib diisi'
    return true
  },
  gambar: (v: File | null) => {
    if (!props.isEdit && !v) return 'Gambar QRIS wajib diupload'
    return true
  },
}

// Isi form saat mode edit
watch(
  () => props.isEdit,
  (newVal) => {
    if (!newVal || !props.item) return
    params.nama_rekening = props.item.nama_rekening ?? ''
    params.nomor_rekening = props.item.nomor_rekening ?? ''
    params.keterangan = props.item.keterangan ?? ''
    params.gambar = null
    previewUrl.value = props.item.image ?? null
  }
)

// Tutup dialog setelah sukses
watch(
  () => props.isFetchSuccess,
  (newVal) => {
    if (newVal) handleClose()
  },
  { immediate: true }
)

const handleClose = () => {
  form.value?.reset()
  params.nama_rekening = ''
  params.nomor_rekening = ''
  params.keterangan = ''
  params.gambar = null
  previewUrl.value = null
  emit('close')
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  params.gambar = file
  previewUrl.value = URL.createObjectURL(file)
}

const handleRemoveImage = () => {
  params.gambar = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleSubmit = async () => {
  const { valid } = await form.value?.validate()
  if (valid) {
    emit('submit', { ...params })
  }
}
</script>

<template>
  <VDialog :model-value="props.isShow" max-width="520" persistent @update:model-value="!$event && handleClose()">
    <VCard>
      <VCardTitle class="pt-4 px-5">
        <div class="d-flex align-center justify-space-between">
          <h3>{{ props.isEdit ? 'Edit QRIS' : 'Tambah QRIS' }}</h3>
          <IconBtn variant="text" :disabled="props.loading" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>

      <VCardItem>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow class="pt-1">

            <!-- Nama Rekening -->
            <VCol cols="12">
              <VTextField v-model="params.nama_rekening" label="Nama Rekening" placeholder="Contoh: Kas RT 01"
                :rules="[rules.nama_rekening]" />
            </VCol>

            <!-- Nomor Rekening -->
            <VCol cols="12">
              <VTextField v-model="params.nomor_rekening" label="Nomor Rekening" placeholder="Contoh: 1234567890"
                :rules="[rules.nomor_rekening]" />
            </VCol>

            <!-- Keterangan -->
            <VCol cols="12">
              <VTextField v-model="params.keterangan" label="Keterangan (opsional)"
                placeholder="Tambahkan keterangan singkat..." />
            </VCol>

            <!-- Upload Gambar QRIS -->
            <VCol cols="12">
              <div class="text-body-2 mb-2 font-weight-medium">
                Gambar QRIS <span v-if="!props.isEdit" class="text-error">*</span>
              </div>

              <!-- Preview gambar -->
              <div v-if="previewUrl" class="d-flex flex-column align-center gap-2 mb-3">
                <img :src="previewUrl"
                  style="width: 180px; height: 180px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(0,0,0,0.12);" />
                <VBtn variant="text" color="error" size="x-small" prepend-icon="ri-delete-bin-line"
                  @click="handleRemoveImage">
                  Hapus Gambar
                </VBtn>
              </div>

              <!-- Dropzone -->
              <div v-else class="dropzone d-flex flex-column align-center justify-center ga-2 cursor-pointer"
                @click="fileInput?.click()">
                <VIcon icon="ri-upload-cloud-2-line" size="36" color="primary" />
                <span class="text-body-2 text-medium-emphasis">Klik untuk upload gambar QRIS</span>
                <span class="text-caption text-disabled">Format: JPG, PNG, WEBP (maks. 2MB)</span>
              </div>

              <!-- Hidden file input -->
              <input ref="fileInput" type="file" accept="image/jpg,image/jpeg,image/png,image/webp" class="d-none"
                @change="handleFileChange" />
            </VCol>

            <!-- Tombol aksi -->
            <VCol cols="12">
              <div class="d-flex justify-end flex-wrap gap-2">
                <VBtn variant="text" :disabled="props.loading" color="secondary" size="small" @click="handleClose">
                  <VIcon icon="ri-close-line" class="me-1" />
                  Batal
                </VBtn>
                <VBtn variant="flat" :loading="props.loading" :color="props.isEdit ? 'info' : 'success'" size="small"
                  type="submit">
                  <VIcon :icon="props.isEdit ? 'ri-save-2-line' : 'ri-add-line'" class="me-1" />
                  {{ props.isEdit ? 'Simpan' : 'Tambah' }}
                </VBtn>
              </div>
            </VCol>

          </VRow>
        </VForm>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

<style scoped>
.dropzone {
  width: 100%;
  padding: 30px;
  border: 2px dashed rgba(var(--v-theme-primary), 0.4);
  border-radius: 10px;
  text-align: center;
  transition: border-color 0.2s;
  cursor: pointer;
}

.dropzone:hover {
  border-color: rgba(var(--v-theme-primary), 0.8);
}
</style>

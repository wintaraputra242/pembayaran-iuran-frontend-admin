<script lang="ts" setup>
const props = withDefaults(defineProps<{
  isShow: boolean
}>(), {
  isShow: false,
})

const emit = defineEmits<{
  (e: 'submit', file: File): void
  (e: 'reload'): void
  (e: 'close'): void
}>()

const form = ref(null)

const handleClose = () => {
  buktiPembayaran.value = null

  emit('close')
}

const buktiPembayaran = ref<File | null>(null)

const isErrorSubmit = ref(false)

const handleSubmit = () => {
  if (!buktiPembayaran.value) {
    isErrorSubmit.value = true

    return
  }

  emit('submit', buktiPembayaran.value)
  handleClose()
}
</script>

<template>
  <VDialog
    :model-value="props.isShow"
    persistent
    @update:model-value="emit('close')"
  >
    <VCard>
      <VCardTitle class="pt-3">
        <div class="d-flex align-center justify-space-between">
          <h3>Foto Bukti Pembayaran</h3>
        </div>
      </VCardTitle>
      <VCardItem>
        <VForm
          ref="form"
          @submit.prevent="handleSubmit"
        >
          <VRow
            align="center"
            class="pt-1"
          >
            <VCol cols="12">
              <CameraUpload
                v-model="buktiPembayaran"
                :is-error-submit="isErrorSubmit"
                :rules="[
                  v => !!v || 'Foto Bukti Pembayaran wajib diupload',
                ]"
              />
            </VCol>
            <VCol cols="12">
              <div class="d-flex justify-end flex-wrap gap-2">
                <VBtn
                  variant="flat"
                  block
                  color="success"
                  type="submit"
                >
                  Unggah Bukti
                </VBtn>
                <VBtn
                  variant="flat"
                  block
                  color="secondary"
                  @click="handleClose"
                >
                  Batal
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

<style>
.dropzone {
  width: 100%;
  padding: 30px;
  border: 2px dashed #888;
  border-radius: 10px;
  text-align: center;
}
</style>

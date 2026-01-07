<script lang="ts" setup>
const toastStore = useToastStore()

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  item?: object | null
}>(), {
  isShow: false,
})

const handleClose = () => {
  emit('close')
}

const credential = {
  username: 'regu_a',
  password: 'password',
}

const handleCopyUsernamePass = async () => {
  const text = `Username: ${credential.username}\nPassword: ${credential.password}`

  try {
    await navigator.clipboard.writeText(text)
    toastStore.open('Username dan Password berhasil disalin', {
      color: 'success',
      timeout: 2000,
    })
  } catch (err) {
    toastStore.open('Gagal menyalin, silakan salin manual', {
      color: 'error',
      timeout: 2000,
    })
  }
}
const handlePrint = () => {
}
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard class="position-relative">
      <VCardTitle class="pt-3 position-sticky top-0" style="background-color: #fff !important; z-index: 10;">
        <div class="d-flex align-center justify-space-between">
          <h4>Lihat Username & Password</h4>
          <IconBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardItem>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Role</td>
                <td>: Admin</td>
              </tr>
              <tr>
                <td>Regu</td>
                <td>: Regu A</td>
              </tr>
              <tr>
                <td class="font-weight-bold">Username</td>
                <td class="font-weight-bold">: {{ credential.username }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">Password</td>
                <td class="font-weight-bold">: {{ credential.password }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-end flex-wrap gap-2">
          <VBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" class="me-1" />
            Batal
          </VBtn>
          <VBtn color="success" size="small" @click="handleCopyUsernamePass">
            <VIcon icon="ri-file-copy-2-line" class="me-1" />
            Salin Username & Password
          </VBtn>
          <VBtn color="primary" size="small" @click="handlePrint">
            <VIcon icon="ri-printer-line" class="me-1" />
            Cetak
          </VBtn>
        </div>
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

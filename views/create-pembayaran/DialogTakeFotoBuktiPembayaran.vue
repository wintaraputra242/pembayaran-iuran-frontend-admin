<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'submit', file: File): void;
  (e: 'reload'): void;
  (e: 'close'): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
}>(), {
  isShow: false,
})

const form = ref(null)

const defaultParams = {
  judul: '',
  jenis_iuran: null,
  periode: null,
  keterangan: '',
  status_aktif: '',
}
const params = reactive({...defaultParams})

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  judul: (v: string) => {
    if (!v) return "Judul wajib diisi"
    if (v.length > 100) return "Judul maksimal 100 karakter"
    return true
  },

  jenis_iuran: (v: string) => {
    if (!v) return "Jenis iuran wajib dipilih"
    if (!['bulanan', 'kematian'].includes(v)) return "Jenis iuran tidak valid"
    return true
  },

  periode: (v: string) => {
    if (!v) return "Periode wajib diisi"
    if (!/^\d{4}$/.test(v)) return "Periode harus berupa tahun, 4 digit"
    if (Number(v) < 2000) return "Periode minimal tahun 2000"
    return true
  },

  keterangan: (v: string) => {
    if (!v) return "Keterangan wajib diisi"
    if (v.length > 255) return "Keterangan maksimal 255 karakter"
    return true
  },
}

const handleClose = () => {
  buktiPembayaran.value = null

  emit('close')
}

const currentYear = new Date().getFullYear()

const years = Array.from({ length: 31 }, (_, i) => (currentYear + i).toString())

const buktiPembayaran = ref<File | null>(null)

watch(() => buktiPembayaran.value, (newVal) => {
  console.log(newVal)
})

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
  <VDialog v-model="props.isShow" persistent>
    <VCard>
      <VCardTitle class="pt-3">
        <div class="d-flex align-center justify-space-between">
          <h3>Foto Bukti Pembayaran</h3>
        </div>
      </VCardTitle>
      <VCardItem>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow align="center" class="pt-1">
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
                <VBtn variant="flat" block color="success" type="submit">
                  Unggah Bukti
                </VBtn>
                <VBtn variant="flat" block color="secondary" @click="handleClose">
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

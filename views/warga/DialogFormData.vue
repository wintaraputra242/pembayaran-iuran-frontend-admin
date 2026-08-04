<script lang="ts" setup>
import type { MasterWarga } from '@/types/api/master-warga';
import { format } from 'date-fns';

const emit = defineEmits<{
  (e: 'submit', params: {
    nik: string
    nama_warga: string
    alamat: string
    no_hp: string
    tanggal_bergabung: any
  }): void;
  (e: 'import', file: File): void;
  (e: 'close'): void;
  (e: 'submitRegu', params: { nik: string; id_regu: number }): void
}>()

const props = withDefaults(defineProps<{
  isShow: boolean
  isEdit: boolean
  loading: boolean
  isFetchSuccess: boolean
  item?: MasterWarga | null
  reguOptions?: { id: number; nama_regu: string }[]
  loadingReguOptions?: boolean
}>(), {
  isShow: false,
  isEdit: false,
  reguOptions: () => [],
  loadingReguOptions: false,
})

const masterWargaStore = useMasterWargaStore()
const form = ref()

const defaultParams = {
  nik: '',
  nama_warga: '',
  alamat: '',
  no_hp: '',
  tanggal_bergabung: '',
}
const params = reactive({ ...defaultParams })

// Step: 'form' | 'regu' | 'import'
const step = ref<'form' | 'regu' | 'import'>('form')
const tab = ref('form')
const nikBaru = ref('') // simpan NIK warga yang baru ditambahkan
const selectedRegu = ref<number | null>(null)
const loadingRegu = ref(false)

const uploaderRef = ref()
const selectedFile = ref<File | null>(null)

const optionsUploader = {
  url: 'javascript:void(0)',
  autoProcessQueue: false,
  maxFiles: 1,
  maxFilesize: 5,
  addRemoveLinks: true,
  clickable: true,
  dictDefaultMessage: 'Tarik file Excel / klik untuk pilih',
  acceptedFiles: '.xlsx,.xls,.csv',
}

const dropzoneEvents = {
  addedFile: (file: File) => {
    selectedFile.value = file
  },
  removedFile: () => {
    selectedFile.value = null
  },
}

const rules = {
  required: (v: any) => !!v || 'Field wajib diisi',
  nik: (v: string) => {
    if (!v) return 'NIK wajib diisi'
    if (!/^\d+$/.test(v)) return 'NIK hanya boleh angka'
    if (v.length !== 16) return 'NIK harus 16 digit'
    return true
  },
  nama: (v: string) => {
    if (!v) return 'Nama wajib diisi'
    if (v.length < 3) return 'Nama minimal 3 karakter'
    if (!/^[A-Za-z\s'.-]+$/.test(v)) return 'Nama hanya boleh huruf, spasi, titik, dan tanda petik'
    return true
  },
  alamat: (v: string) => {
    if (!v) return 'Alamat wajib diisi'
    if (v.length < 5) return 'Alamat terlalu pendek'
    return true
  },
  phone: (v: string) => {
    if (!v) return 'No. HP wajib diisi'
    if (v.length > 13) return 'No. HP maksimal 13 digit angka'
    const cleaned = v.replace(/\D/g, '')
    if (!/^08\d{8,11}$/.test(cleaned)) return 'No. HP harus format Indonesia (contoh: 081234567890)'
    return true
  },
  file: (v: File) => {
    if (!v) return 'File wajib diupload'
    if (v.size > 5_000_000) return 'Maksimal 5 MB'
    if (!['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(v.type))
      return 'Hanya file Excel'
    return true
  },
  tanggal_bergabung: (v: string) => {
    if (!v) return true // nullable, boleh dikosongkan
    return true
  },
}

// TIDAK ADA lagi watch yang mengubah params.nama_warga saat mengetik.
// Uppercase cuma ditampilkan secara visual lewat CSS (class "uppercase-input"),
// supaya tidak mengganggu proses composition keyboard mobile.
// Value asli baru dikonversi ke uppercase saat submit (lihat handleSubmit).

const handleClose = () => {
  form.value?.reset()
  step.value = 'form'
  tab.value = 'form'
  nikBaru.value = ''
  selectedRegu.value = null
  if (selectedFile.value) {
    uploaderRef.value?.reset()
    selectedFile.value = null
  }
  emit('close')
}

watch(() => props.isEdit, newVal => {
  if (!newVal) return
  params.nik = props.item?.nik as string
  params.nama_warga = props.item?.nama_warga as string
  params.alamat = props.item?.alamat as string
  params.no_hp = props.item?.no_hp as string
  params.tanggal_bergabung = props.item?.tanggal_bergabung as string
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  // Konversi ke uppercase di sini saja, sekali, sebelum dikirim —
  // bukan tiap keystroke, supaya tidak mengganggu keyboard mobile.
  emit('submit', {
    ...params,
    nama_warga: params.nama_warga.toUpperCase(),
    tanggal_bergabung: params.tanggal_bergabung
      ? format(new Date(params.tanggal_bergabung), 'yyyy-MM-dd')
      : null,
  })
}

// Dipanggil dari parent saat store warga berhasil
// Parent set isFetchSuccess = true → kita pindah ke step regu
watch(() => props.isFetchSuccess, newVal => {
  if (newVal && !props.isEdit) {
    nikBaru.value = params.nik
    step.value = 'regu'
    form.value?.reset()
    if (selectedFile.value) uploaderRef.value?.reset()
  }
})

const handleSkipRegu = () => {
  step.value = 'form'
  nikBaru.value = ''
  selectedRegu.value = null
  emit('close')
}

const handleSubmitRegu = async () => {
  if (!selectedRegu.value) {
    handleSkipRegu()
    return
  }

  emit('submitRegu', {
    nik: nikBaru.value,
    id_regu: selectedRegu.value,
  })

  step.value = 'form'
  nikBaru.value = ''
  selectedRegu.value = null
  emit('close')
}

const handleImport = async () => {
  const validate = await uploaderRef.value.validate()
  if (!validate) return
  emit('import', selectedFile.value as File)
}

watch(() => tab.value, newVal => {
  if (newVal === 'form') {
    if (selectedFile.value) uploaderRef.value?.reset()
  } else {
    form.value?.reset()
  }
})

watch(() => props.isShow, newVal => {
  if (newVal) {
    step.value = 'form'
    tab.value = 'form'
  }
})

const handleDownloadTemplate = async () => {
  await masterWargaStore.downloadTemplateImport()
}
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard position="relative">

      <!-- STEP 1: Form Tambah/Edit Warga -->
      <template v-if="step === 'form'">
        <VCardTitle class="pt-3" :class="{ 'position-fixed top-0 left-0 w-100': !isEdit }"
          style="background-color: #fff !important; z-index: 10;">
          <div class="d-flex align-center justify-space-between">
            <h3>{{ props.isEdit ? 'Edit' : 'Tambah' }} Warga</h3>
            <IconBtn :disabled="props.loading" variant="text" color="secondary" size="small" @click="handleClose">
              <VIcon icon="ri-close-line" />
            </IconBtn>
          </div>
        </VCardTitle>

        <VCardText v-if="!props.isEdit" class="pb-0 py-1 mt-14">
          <div class="d-flex justify-end flex-wrap gap-2">
            <VBtn :disabled="props.loading" variant="flat" :color="tab === 'form' ? 'primary' : 'secondary'"
              @click="tab === 'form' ? (tab = 'import') : (tab = 'form')">
              <VIcon :icon="tab === 'form' ? 'ri-download-2-line' : 'ri-close-line'" class="me-2" />
              {{ tab === 'form' ? 'Import' : 'Batal' }}
            </VBtn>
            <VBtn v-if="tab === 'import'" :loading="masterWargaStore.loadingDownloadTemplate" :disabled="props.loading"
              variant="flat" color="info" @click="handleDownloadTemplate">
              <VIcon icon="ri-file-excel-line" class="me-1" />
              Download Template
            </VBtn>
          </div>
        </VCardText>

        <VCardItem>
          <VTabsWindow v-model="tab">
            <VTabsWindowItem value="form">
              <VForm ref="form" @submit.prevent="handleSubmit">
                <VRow align="center" class="pt-1">
                  <VCol cols="12">
                    <VTextField v-model="params.nik" label="NIK" placeholder="Masukkan nik warga"
                      :rules="props.isEdit ? [] : [rules.nik]" :disabled="props.isEdit" />
                  </VCol>
                  <VCol cols="12">
                    <VTextField v-model="params.nama_warga" label="Nama" placeholder="Masukkan nama warga"
                      :rules="[rules.nama]" class="uppercase-input" />
                  </VCol>
                  <VCol cols="12">
                    <VTextarea v-model="params.alamat" label="Alamat" placeholder="Masukkan alamat warga"
                      :rules="[rules.alamat]" auto-grow />
                  </VCol>
                  <VCol cols="12">
                    <VTextField v-model="params.no_hp" label="No. Handphone" placeholder="Masukkan no. handphone warga"
                      :rules="[rules.phone]" />
                  </VCol>
                  <VCol cols="12">
                    <DatePicker v-model="params.tanggal_bergabung" label="Tanggal Bergabung"
                      placeholder="Pilih tanggal bergabung" format="dd/MM/yyyy" :rules="[rules.tanggal_bergabung]"
                      clearable />
                    <p class="text-caption text-medium-emphasis mt-1 mb-0">
                      Tanggal warga mulai menjadi bagian banjar / mulai wajib iuran (bukan tanggal input data ke sistem)
                    </p>
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex justify-end flex-wrap gap-2">
                      <VBtn :disabled="props.loading" variant="text" color="secondary" size="small"
                        @click="handleClose">
                        <VIcon icon="ri-close-line" class="me-1" />
                        Batal
                      </VBtn>
                      <VBtn :loading="props.loading" variant="flat" :color="props.isEdit ? 'info' : 'success'"
                        size="small" type="submit">
                        <VIcon :icon="props.isEdit ? 'ri-save-2-line' : 'ri-add-line'" class="me-1" />
                        {{ props.isEdit ? 'Simpan' : 'Tambah' }}
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VTabsWindowItem>

            <VTabsWindowItem value="import">
              <VForm ref="formImport" @submit.prevent="handleImport">
                <VRow align="center" class="pt-1">
                  <VCol cols="12">
                    <FileUploader v-model="selectedFile" ref="uploaderRef" :options="optionsUploader"
                      :on-events="dropzoneEvents" :rules="[rules.file]" />
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex justify-end flex-wrap gap-2">
                      <VBtn :disabled="props.loading" variant="text" color="secondary" size="small"
                        @click="tab = 'form'">
                        <VIcon icon="ri-close-line" class="me-1" />
                        Batal
                      </VBtn>
                      <VBtn :loading="props.loading" variant="flat" color="success" size="small" type="submit">
                        <VIcon icon="ri-upload-2-line" class="me-1" />
                        Unggah
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VTabsWindowItem>
          </VTabsWindow>
        </VCardItem>
      </template>

      <!-- STEP 2: Pilih Regu (hanya saat tambah baru) -->
      <template v-else-if="step === 'regu'">
        <VCardTitle class="pt-3" style="background-color: #fff !important; z-index: 10;">
          <div class="d-flex align-center gap-2">
            <VAvatar color="success" size="32" variant="tonal">
              <VIcon icon="ri-check-line" size="18" />
            </VAvatar>
            <div>
              <h4>Warga Berhasil Ditambahkan</h4>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Masukkan warga ke regu? (opsional)
              </p>
            </div>
          </div>
        </VCardTitle>

        <VCardItem>
          <VRow class="pt-1">
            <VCol cols="12">
              <p class="text-body-2 mb-3">
                Pilih regu untuk warga <strong>{{ params.nama_warga || nikBaru }}</strong>,
                atau lewati jika ingin mengatur regu nanti.
              </p>
              <VAutocomplete v-model="selectedRegu" label="Pilih Regu" placeholder="Cari nama regu..."
                :items="props.reguOptions" item-title="nama_regu" item-value="id" :loading="props.loadingReguOptions"
                clearable />
            </VCol>
            <VCol cols="12">
              <div class="d-flex justify-end flex-wrap gap-2">
                <VBtn variant="text" color="secondary" size="small" @click="handleSkipRegu">
                  <VIcon icon="ri-skip-right-line" class="me-1" />
                  Lewati
                </VBtn>
                <VBtn variant="flat" color="primary" size="small" :disabled="!selectedRegu" @click="handleSubmitRegu">
                  <VIcon icon="ri-group-line" class="me-1" />
                  Masukkan ke Regu
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VCardItem>
      </template>

    </VCard>
  </VDialog>
</template>

<style scoped>
.uppercase-input :deep(input) {
  text-transform: uppercase;
}
</style>

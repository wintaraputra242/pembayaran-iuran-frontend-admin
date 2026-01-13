<script lang="ts" setup>
import type { MasterWarga } from '@/types/api/master-warga';

const emit = defineEmits<{
  (e: 'submit', params: {
    nik: string
    nama_warga: string
    alamat: string
    no_hp: string
  }): void;
  (e: 'import', file: File): void;
  (e: 'close'): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  isEdit: boolean
  loading: boolean
  isFetchSuccess: boolean
  item?: MasterWarga | null
}>(), {
  isShow: false,
  isEdit: false,
})

const form = ref()

const defaultParams = {
  nik: '',
  nama_warga: '',
  alamat: '',
  no_hp: '',
}
const params = reactive({...defaultParams})

const tab = ref('form')

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
  acceptedFiles: ".xlsx,.xls,.csv",
}

const dropzoneEvents = {
  addedFile: (file: File) => {
    if (file instanceof File) {
      errorMessageFile.value = 'Yang dikirim, harus berformatkan File'
      
      return
    }

    errorMessageFile.value = ''
    selectedFile.value = file
  },

  removedFile: () => {
    selectedFile.value = null
    errorMessageFile.value = 'File wajib diisi'
  },

  success: (file: File, response: any) => {
    console.log("Success:", response)
  },

  error: (file: File, message: any) => {
    console.error("Error:", message)
  }
}

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  nik: (v: string) => {
    if (!v) return "NIK wajib diisi"
    if (!/^\d+$/.test(v)) return "NIK hanya boleh angka"
    if (v.length !== 16) return "NIK harus 16 digit"
    return true
  },

  nama: (v: string) => {
    if (!v) return "Nama wajib diisi"
    if (v.length < 3) return "Nama minimal 3 karakter"
    if (!/^[A-Za-z\s'.-]+$/.test(v))
      return "Nama hanya boleh huruf, spasi, titik, dan tanda petik"
    return true
  },

  alamat: (v: string) => {
    if (!v) return "Alamat wajib diisi"
    if (v.length < 5) return "Alamat terlalu pendek"
    return true
  },

  phone: (v: string) => {
    if (!v) return "No. HP wajib diisi"

    if (v.length > 13)
      return "No. HP maksimal 13 digit angka"

    // format nomor telepon Indonesia
    const cleaned = v.replace(/\D/g, "") // hapus semua non-digit

    if (!/^08\d{8,11}$/.test(cleaned))
      return "No. HP harus format Indonesia (contoh: 081234567890)"

    return true
  },

  file: (v: File) => {
    if (!v) return "File wajib diupload"
    if (v.size > 5_000_000) return "Maksimal 5 MB"
    if (!['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(v.type)) return "Hanya file Excel"
    return true
  },
}

watch(
  () => params.nama_warga,
  newVal => {
    if (!newVal) return
    params.nama_warga = newVal.toUpperCase()
  }
)

const handleClose = () => {
  
  form.value?.reset()
  
  if (selectedFile.value) {
    uploaderRef.value?.reset()
    selectedFile.value = null
  }
  
  emit('close')
}

watch(
  () => props.isEdit,
  newVal => {
    if (!newVal) return

    params.nik = props.item?.nik as string
    params.nama_warga = props.item?.nama_warga as string
    params.alamat = props.item?.alamat as string
    params.no_hp = props.item?.no_hp as string
  }
)

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  emit('submit', params)
}

const errorMessageFile = ref('') 
const formImport = ref()

const handleImport = async () => {

  const validate = await uploaderRef.value.validate()

  if (!validate) return

  emit('import', selectedFile.value as File)
}

watch(
  () => props.isFetchSuccess,
  newVal => {
    console.log(newVal);
    

    if (newVal) {
      form.value.reset()
      
      if (selectedFile.value) {
        uploaderRef.value?.reset()
      }
    }
  }
)

watch(
  () => tab.value,
  newVal => {
    if (newVal === 'form') {
      if (selectedFile.value) {
        uploaderRef.value?.reset()
      }
    } else {
      form.value.reset()
    }
  }
)

watch(
  () => props.isShow,
  newVal => {
    if (newVal) {
      tab.value = 'form'
    }
  }
)
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard position="relative">
      <VCardTitle class="pt-3" :class="{ 'position-fixed top-0 left-0 w-100': !isEdit }" style="background-color: #fff !important; z-index: 10;">
        <div class="d-flex align-center justify-space-between">
          <h3>{{ props.isEdit ? 'Edit' : 'Tambah' }}</h3>
          <IconBtn :disabled="props.loading" variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardText v-if="!props.isEdit" class="pb-0 py-1 mt-14">
        <div class="d-flex justify-end">
          <VBtn :disabled="props.loading" variant="flat" :color="tab === 'form' ? 'primary' : 'secondary'" @click="tab === 'form' ? (tab = 'import') : (tab = 'form')">
            <VIcon :icon="tab === 'form' ? 'ri-download-2-line' : 'ri-close-line'" class="me-2" />
            {{ tab === 'form' ? 'Import' : 'Batal' }}
          </VBtn>
        </div>
      </VCardText>
      <VCardItem>
        <VTabsWindow v-model="tab">
          <VTabsWindowItem value="form">
            <VForm ref="form" @submit.prevent="handleSubmit">
              <VRow align="center" class="pt-1">
                <VCol cols="12">
                  <VTextField
                    v-model="params.nik"
                    label="NIK"
                    placeholder="Masukkan nik warga"
                    :rules="[rules.nik]"
                    maxlength="16"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="params.nama_warga"
                    label="Nama"
                    placeholder="Masukkan nama warga"
                    :rules="[rules.nama]"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    v-model="params.alamat"
                    label="Alamat"
                    placeholder="Masukkan alamat warga"
                    :rules="[rules.alamat]"
                    auto-grow
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="params.no_hp"
                    label="No. Handphone"
                    placeholder="Masukkan no. handphone warga"
                    :rules="[rules.phone]"
                  />
                </VCol>
                <VCol cols="12">
                  <div class="d-flex justify-end flex-wrap gap-2">
                    <VBtn :disabled="props.loading" variant="text" color="secondary" size="small" @click="handleClose">
                      <VIcon icon="ri-close-line" class="me-1" />
                      Batal
                    </VBtn>
                    <VBtn :loading="props.loading" variant="flat" :color="props.isEdit ? 'info' : 'success'" size="small" type="submit">
                      <VIcon :icon="props.isEdit ? 'ri-save-2-line' : 'ri-add-line'" class="me-1" />
                      {{ props.isEdit ? 'Simpan' : 'Tambah'}}
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VForm>
          </VTabsWindowItem>
          <!-- <VExpandTransition>
            <p v-if="errorMessageFile" class="text-error">{{ errorMessageFile }}</p>
          </VExpandTransition> -->
          <VTabsWindowItem value="import">
            <VForm ref="formImport" @submit.prevent="handleImport">
              <VRow align="center" class="pt-1">
                <VCol cols="12">
                  <FileUploader
                    v-model="selectedFile"
                    ref="uploaderRef" 
                    :options="optionsUploader"
                    :on-events="dropzoneEvents" 
                    :rules="[rules.file]" 
                  />
                </VCol>
                <VCol cols="12">
                  <div class="d-flex justify-end flex-wrap gap-2">
                    <VBtn :disabled="props.loading" variant="text" color="secondary" size="small" @click="tab = 'form'">
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

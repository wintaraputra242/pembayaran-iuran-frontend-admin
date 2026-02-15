<script lang="ts" setup>
import type { WargaForDropdown } from '@/types/api/dropdown';
import type { AddInformasiIuranPayload, MasterInformasiIuran } from '@/types/api/master-informasi-iuran';

const emit = defineEmits<{
  (e: 'submit', params: AddInformasiIuranPayload): void;
  (e: 'close'): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  isEdit: boolean
  loading: boolean
  isFetchSuccess: boolean
  item?: MasterInformasiIuran | null
  itemDropdownWarga?: WargaForDropdown[]
  loadingDropdownWarga?: boolean
}>(), {
  isShow: false,
  isEdit: false,
})

const form = ref()

const defaultParams = {
  judul_iuran: '',
  jenis_iuran: null,
  periode: null,
  jumlah_iuran: '',
  keterangan: '',
  nama_warga_meninggal: '',
  nik_penanggung_jawab: null
}
const params = reactive<AddInformasiIuranPayload>({...defaultParams})

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  judul: (v: string) => {
    if (!v) return "Judul wajib diisi"
    if (v.length < 3) return "Nama minimal 3 karakter"
    if (v.length > 100) return "Judul maksimal 100 karakter"
    return true
  },

  jenis_iuran: (v: string) => {
    if (!v) return "Jenis Iuran wajib dipilih"
    if (!['bulanan', 'kematian'].includes(v)) return "Jenis iuran tidak valid"
    return true
  },

  periode: (v: string) => {
    if (!v) return "Periode wajib diisi"
    if (!/^\d{4}$/.test(v)) return "Periode harus berupa tahun, 4 digit"
    if (Number(v) < 2000) return "Periode minimal tahun 2000"
    return true
  },

  jumlah_iuran: (v: string) => {
    if (!v) return "Jumlah Iuran wajib diisi"
    return true
  },

  keterangan: (v: string) => {
    if (!v) return "Keterangan wajib diisi"
    if (v.length > 255) return "Keterangan maksimal 255 karakter"
    return true
  },

  nama_warga_meninggal: (v: string) => {
    if (!v) return "Nama Warga yang Meninggal wajib diisi"
    return true
  },
  
  nik_penanggung_jawab: (v: string) => {
    if (!v) return "Warga Penanggung Jawab wajib diisi"
    return true
  },
}

const handleClose = () => {
  form.value?.reset()
  
  emit('close')
}

watch(
  () => props.isEdit,
  newVal => {
    if (!newVal) return

    params.judul_iuran = props.item?.judul_iuran as string
    params.jenis_iuran = props.item?.jenis_iuran as string
    params.periode = props.item?.periode as number | null
    params.jumlah_iuran = formatRupiah(props.item?.jumlah_iuran as number, true)
    params.keterangan = props.item?.keterangan as string
    params.nama_warga_meninggal = props.item?.nama_warga_meninggal as string
    params.nik_penanggung_jawab = props.item?.nik_penanggung_jawab as string
  }
)

const currentYear = new Date().getFullYear()

const years = Array.from({ length: 31 }, (_, i) => (currentYear + i))

const onInputJumlahIuran = (value: string) => {
  if (!/\d/g.test(value)) {
    params.jumlah_iuran = ''
    return
  }

  const numeric = value.replace(/\D/g, '')

  params.jumlah_iuran = new Intl.NumberFormat('id-ID')
    .format(Number(numeric))
}

watch(
  () => props.isFetchSuccess,
  newVal => {

    if (newVal) {
      form.value.reset() 
    }
  }
)

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  emit('submit', params)
}
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard position="relative">
      <VCardTitle class="pt-3 position-fixed top-0 left-0 w-100" style="background-color: #fff !important; z-index: 10;">
        <div class="d-flex align-center justify-space-between">
          <h3>{{ props.isEdit ? 'Edit' : 'Tambah' }}</h3>
          <IconBtn :disabled="props.loading" variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardItem class="mt-14">
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow align="center" class="pt-1">
            <VCol cols="12">
              <VSelect
                v-model="params.jenis_iuran"
                label="Jenis Iuran"
                placeholder="Masukkan jenis iuran"
                item-title="label"
                item-value="value"
                :items="[
                  {label: 'Bulanan', value: 'bulanan'},
                  {label: 'Kematian', value: 'kematian'},
                ]"
                :rules="[rules.jenis_iuran]"
              />
            </VCol>
            <template v-if="params.jenis_iuran">
              <VCol cols="12">
                <VTextField
                  v-model="params.judul_iuran"
                  label="Judul Iuran"
                  placeholder="Masukkan judul iuran"
                  :rules="[rules.judul]"
                />
              </VCol>
              <VCol v-if="params.jenis_iuran === 'bulanan'" cols="12">
                <VSelect
                  v-model="params.periode"
                  label="Periode"
                  placeholder="Masukkan periode iuran"
                  :items="years"
                  :rules="[rules.periode]"
                />
              </VCol>
              <VCol v-if="params.jenis_iuran === 'kematian'" cols="12">
                <VTextField
                  v-model="params.nama_warga_meninggal"
                  label="Nama Warga yang Meninggal"
                  placeholder="Masukkan nama warga yang meninggal"
                  :rules="[rules.nama_warga_meninggal]"
                  @update:model-value="(e) => { params.nama_warga_meninggal = e.toUpperCase()}"
                />
              </VCol>
              <VCol v-if="params.jenis_iuran === 'kematian'" cols="12">
                <VSelect
                  v-model="params.nik_penanggung_jawab"
                  label="Warga yang Bertanggung Jawab"
                  placeholder="Masukkan warga yang bertanggung jawab"
                  item-value="nik"
                  item-title="nama_warga"
                  :items="props.itemDropdownWarga"
                  :loading="props.loadingDropdownWarga"
                  :rules="[rules.nik_penanggung_jawab]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="params.jumlah_iuran"
                  label="Jumlah Iuran"
                  placeholder="Masukkan jumlah iuran"
                  :rules="[rules.jumlah_iuran]"
                  @update:model-value="onInputJumlahIuran"
                >
                  <template #prepend-inner>
                    <span>Rp. </span>
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="params.keterangan"
                  label="Keterangan"
                  placeholder="Masukkan keterangan iuran"
                  :rules="[rules.keterangan]"
                />
              </VCol>
            </template>
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

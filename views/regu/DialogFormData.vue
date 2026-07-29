<script lang="ts" setup>
import type { CreateReguPayload, MasterRegu } from '@/types/api/master-regu';

const emit = defineEmits<{
  (e: 'submit', params: CreateReguPayload): void;
  (e: 'close'): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  isEdit: boolean
  isFetchSuccess: boolean
  loading: boolean
  item?: MasterRegu | null
}>(), {
  isShow: false,
  isEdit: false,
})

const form = ref()

const defaultParams = {
  nama_regu: '',
}
const params = reactive({ ...defaultParams })

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  nama: (v: string) => {
    if (!v) return "Nama Regu wajib diisi"
    if (v.length < 3) return "Nama minimal 3 karakter"
    return true
  },
}

watch(
  () => params.nama_regu,
  newVal => {
    if (!newVal) return
    params.nama_regu = newVal.toUpperCase()
  }
)

const handleClose = () => {
  form.value?.reset()

  emit('close')
}

watch(() => props.isEdit, newVal => {
  if (!newVal) return
  form.value?.reset()
  nextTick(() => {
    params.nama_regu = props.item?.nama_regu as string
  })
})

const handleSubmit = async () => {
  const { valid } = await form.value?.validate()

  if (valid) {
    emit('submit', params)
  }

}

watch(() => props.isFetchSuccess, (newVal) => {
  if (newVal) {
    handleClose()
  }
}, { immediate: true })
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard>
      <VCardTitle class="pt-3">
        <div class="d-flex align-center justify-space-between">
          <h3>{{ props.isEdit ? 'Edit' : 'Tambah' }}</h3>
          <IconBtn variant="text" :disabled="props.loading" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardItem>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow align="center" class="pt-1">
            <VCol cols="12">
              <VTextField v-model="params.nama_regu" label="Nama Regu" placeholder="Masukkan nama regu"
                :rules="[rules.nama]" />
            </VCol>
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

<style>
.dropzone {
  width: 100%;
  padding: 30px;
  border: 2px dashed #888;
  border-radius: 10px;
  text-align: center;
}
</style>

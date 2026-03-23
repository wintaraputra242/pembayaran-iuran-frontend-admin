<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { keyword: string, status_aktif: null | number, jenis_iuran: string | null }): void;
  (e: 'reload'): void;
  (e: 'showFormData'): void;
}>();

const filters = reactive({
  keyword: '',
  status_aktif: null,
  jenis_iuran: null,
})

const handleReload = () => {
  filters.keyword = ''
  filters.status_aktif = null
  filters.jenis_iuran = null

  emit('reload')
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="emit('filter', filters)">
        <VRow align="center">
          <VCol cols="12">
            <VTextField
              v-model="filters.keyword"
              placeholder="Masukkan pencaharian"
              prepend-inner-icon="ri-search-line"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filters.status_aktif"
              placeholder="Pilih status keaktifan"
              item-title="label"
              item-value="value"
              clearable
              :items="[
                {label: 'Aktif', value: 1},
                {label: 'Tidak Aktif', value: 0},
              ]"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filters.jenis_iuran"
              placeholder="Pilih jenis iuran"
              item-title="label"
              item-value="value"
              clearable
              :items="[
                {label: 'Kematian', value: 'kematian'},
                {label: 'Bulanan', value: 'bulanan'},
              ]"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn type="submit" variant="flat" color="primary">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>
              <IconBtn variant="flat" color="primary" @click="handleReload">
                <VIcon icon="ri-restart-line" />
              </IconBtn>
              <VBtn variant="flat" color="success" @click="emit('showFormData')">
                <VIcon icon="ri-add-large-line" class="me-2" />
                Tambah Data
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
</template>

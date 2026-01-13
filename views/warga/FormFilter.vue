<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { keyword: string, status_keaktifan: null | string }): void;
  (e: 'reload'): void;
  (e: 'showFormData'): void;
}>();

const filters = reactive({
  keyword: '',
  status_keaktifan: null,
})

const handleReload = () => {
  filters.keyword = ''
  filters.status_keaktifan = null

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
              placeholder="Cari warga"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filters.status_keaktifan"
              placeholder="Pilih status keaktifan"
              item-title="label"
              item-value="value"
              clearable
              :items="[
                {label: 'Aktif', value: 'aktif'},
                {label: 'Tidak Aktif', value: 'tidak_aktif'},
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

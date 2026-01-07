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
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="() => {}">
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
              :items="[
                {label: 'Aktif', value: 'aktif'},
                {label: 'Tidak Aktif', value: 'tidak aktif'},
              ]"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn variant="flat" color="primary">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>
              <IconBtn variant="flat" color="primary" @click="emit('reload')">
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

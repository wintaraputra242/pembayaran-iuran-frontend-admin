<script setup lang="ts">
const emit = defineEmits<{
  (e: 'showFormData'): void
  (e: 'filter', params: { keyword: string; status: string | null }): void
  (e: 'reload'): void
}>()

const props = withDefaults(defineProps<{
  initialKeyword?: string
  initialStatus?: string | null
}>(), {
  initialKeyword: '',
  initialStatus: null,
})

const filters = reactive({
  keyword: props.initialKeyword ?? '',
  status: props.initialStatus ?? null,
})

watch(() => props.initialKeyword, (val) => { filters.keyword = val ?? '' })
watch(() => props.initialStatus, (val) => { filters.status = val ?? null })

watch(() => filters.keyword, useDebounceFn(() => {
  emit('filter', { ...filters })
}, 400))

watch(() => filters.status, () => emit('filter', { ...filters }))

const handleReload = () => {
  filters.keyword = ''
  filters.status = null
  emit('reload')
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VRow align="center">
        <VCol cols="12" sm="6">
          <VTextField v-model="filters.keyword" placeholder="Cari Nama Rekening" prepend-inner-icon="ri-search-2-line"
            hide-details clearable />
        </VCol>
        <VCol cols="12" sm="4">
          <VSelect v-model="filters.status" placeholder="Semua Status" item-title="label" item-value="value"
            hide-details clearable :items="[
              { label: 'Aktif', value: 'aktif' },
              { label: 'Tidak Aktif', value: 'tidak_aktif' },
            ]" />
        </VCol>
        <VCol cols="12">
          <div class="d-flex flex-wrap gap-2">
            <IconBtn variant="flat" color="primary" @click="handleReload">
              <VIcon icon="ri-restart-line" />
              <VTooltip activator="parent">Reset Filter</VTooltip>
            </IconBtn>
            <VBtn variant="flat" color="success" prepend-icon="ri-add-large-line" @click="emit('showFormData')">
              Tambah QRIS
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

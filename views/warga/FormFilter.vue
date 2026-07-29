<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { keyword: string; status_keaktifan: null | string }): void
  (e: 'reload'): void
  (e: 'showFormData'): void
}>()

const props = withDefaults(defineProps<{
  initialKeyword?: string
  initialStatusKeaktifan?: string | null
}>(), {
  initialKeyword: '',
  initialStatusKeaktifan: null,
})

const filters = reactive({
  keyword: props.initialKeyword ?? '',
  status_keaktifan: props.initialStatusKeaktifan ?? null,
})

watch(() => props.initialKeyword, (val) => { filters.keyword = val ?? '' })
watch(() => props.initialStatusKeaktifan, (val) => {
  console.log(val);
  filters.status_keaktifan = val ?? null
})

// Auto-submit dengan debounce
watch(() => filters.keyword, useDebounceFn(() => {
  emit('filter', { ...filters })
}, 400))

watch(() => filters.status_keaktifan, () => {
  emit('filter', { ...filters })
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
      <VRow align="center">
        <VCol cols="12" sm="5">
          <VTextField v-model="filters.keyword" placeholder="Cari warga" prepend-inner-icon="ri-search-2-line"
            hide-details clearable />
        </VCol>
        <VCol cols="12" sm="4">
          <VSelect v-model="filters.status_keaktifan" placeholder="Semua Status" item-title="label" item-value="value"
            hide-details clearable :items="[
              { label: 'Aktif', value: 'aktif' },
              { label: 'Tidak Aktif', value: 'tidak_aktif' },
            ]" />
        </VCol>
        <VCol cols="12" sm="3">
          <div class="d-flex gap-2 align-center">
            <IconBtn variant="flat" color="primary" @click="handleReload">
              <VIcon icon="ri-restart-line" />
              <VTooltip activator="parent">Reset Filter</VTooltip>
            </IconBtn>
            <VBtn variant="flat" color="success" prepend-icon="ri-add-large-line" @click="emit('showFormData')">
              Tambah Data
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

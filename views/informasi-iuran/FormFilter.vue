<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { keyword: string; status_aktif: null | number; jenis_iuran: string | null }): void
  (e: 'reload'): void
  (e: 'showFormData'): void
}>()

const props = withDefaults(defineProps<{
  initialKeyword?: string
  initialStatusAktif?: number | null
  initialJenisIuran?: string | null
}>(), {
  initialKeyword: '',
  initialStatusAktif: null,
  initialJenisIuran: null,
})

const filters = reactive({
  keyword: props.initialKeyword ?? '',
  status_aktif: props.initialStatusAktif ?? null,
  jenis_iuran: props.initialJenisIuran ?? null,
})

watch(() => props.initialKeyword, (val) => { filters.keyword = val ?? '' })
watch(() => props.initialStatusAktif, (val) => { filters.status_aktif = val ?? null })
watch(() => props.initialJenisIuran, (val) => { filters.jenis_iuran = val ?? null })

// Auto-submit
watch(() => filters.keyword, useDebounceFn(() => {
  emit('filter', { ...filters })
}, 400))

watch(() => filters.status_aktif, () => emit('filter', { ...filters }))
watch(() => filters.jenis_iuran, () => emit('filter', { ...filters }))

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
      <VRow align="center">
        <VCol cols="12" sm="6">
          <VTextField v-model="filters.keyword" placeholder="Cari informasi iuran" prepend-inner-icon="ri-search-2-line"
            hide-details clearable />
        </VCol>
        <VCol cols="12" sm="3">
          <VSelect v-model="filters.status_aktif" placeholder="Semua Status" item-title="label" item-value="value"
            hide-details clearable :items="[
              { label: 'Aktif', value: '1' },
              { label: 'Tidak Aktif', value: '0' },
            ]" />
        </VCol>
        <VCol cols="12" sm="3">
          <VSelect v-model="filters.jenis_iuran" placeholder="Semua Jenis" item-title="label" item-value="value"
            hide-details clearable :items="[
              { label: 'Kematian', value: 'kematian' },
              { label: 'Bulanan', value: 'bulanan' },
            ]" />
        </VCol>
        <VCol cols="12">
          <div class="d-flex flex-wrap gap-2">
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

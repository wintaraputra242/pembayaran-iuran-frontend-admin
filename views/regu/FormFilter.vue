<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { nama_regu: string; status_keaktifan: 'aktif' | 'tidak_aktif' | null }): void
  (e: 'reload'): void
  (e: 'showFormData'): void
  (e: 'resetAllAnggota'): void
}>()

const props = withDefaults(defineProps<{
  initialNamaRegu?: string
  initialStatusKeaktifan?: string | null
}>(), {
  initialNamaRegu: '',
  initialStatusKeaktifan: null,
})

const filters = reactive({
  nama_regu: props.initialNamaRegu ?? '',
  status_keaktifan: props.initialStatusKeaktifan ?? null,
})

watch(() => props.initialNamaRegu, (val) => { filters.nama_regu = val ?? '' })
watch(() => props.initialStatusKeaktifan, (val) => { filters.status_keaktifan = val ?? null })

// Auto-submit
watch(() => filters.nama_regu, useDebounceFn(() => {
  emit('filter', { ...filters } as any)
}, 400))

watch(() => filters.status_keaktifan, () => {
  emit('filter', { ...filters } as any)
})

const handleReload = () => {
  filters.nama_regu = ''
  filters.status_keaktifan = null
  emit('reload')
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VRow align="center">
        <VCol cols="12" sm="5">
          <VTextField v-model="filters.nama_regu" placeholder="Cari nama regu" prepend-inner-icon="ri-search-2-line"
            hide-details clearable />
        </VCol>
        <VCol cols="12" sm="4">
          <VSelect v-model="filters.status_keaktifan" placeholder="Semua Status" item-title="label" item-value="value"
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
              Tambah Regu
            </VBtn>
            <VBtn variant="flat" color="error" prepend-icon="ri-user-community-line" @click="emit('resetAllAnggota')">
              Reset Semua Anggota
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

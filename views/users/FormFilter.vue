<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { keyword: string; role: null | string }): void
  (e: 'reload'): void
  (e: 'downloadCredentials'): void
}>()

const props = withDefaults(defineProps<{
  loadingDownload: boolean
  initialKeyword?: string  // ← tambah
  initialRole?: string | null  // ← tambah
}>(), {
  initialKeyword: '',
  initialRole: null,
})

const filters = reactive({
  keyword: props.initialKeyword ?? '',
  role: props.initialRole ?? null,
})

// Sync saat props berubah (misalnya setelah reload)
watch(() => props.initialKeyword, (val) => { filters.keyword = val ?? '' })
watch(() => props.initialRole, (val) => { filters.role = val ?? null })

// Auto-submit saat keyword berubah
watch(() => filters.keyword, useDebounceFn(() => {
  emit('filter', { ...filters })
}, 400))

// Auto-submit saat role berubah
watch(() => filters.role, () => {
  emit('filter', { ...filters })
})

const handleReload = () => {
  filters.keyword = ''
  filters.role = null
  emit('reload')
}

const handleJumpFromUsers = () => {
  localStorage.setItem('from', 'create-user')
  navigateTo('/master-data/regu')
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VRow align="center">
        <VCol cols="12" sm="5">
          <VTextField v-model="filters.keyword" placeholder="Cari pengguna" prepend-inner-icon="ri-search-2-line"
            hide-details clearable />
        </VCol>
        <VCol cols="12" sm="4">
          <VSelect v-model="filters.role" placeholder="Semua Role" item-title="label" item-value="value" hide-details
            clearable :items="[
              { label: 'Admin', value: 'admin' },
              { label: 'Ketua Regu', value: 'ketua_regu' },
            ]" />
        </VCol>
        <VCol cols="12">
          <div class="d-flex flex-wrap gap-2">
            <IconBtn variant="flat" color="primary" @click="handleReload">
              <VIcon icon="ri-restart-line" />
              <VTooltip activator="parent">Reset Filter</VTooltip>
            </IconBtn>
            <VBtn variant="flat" color="info" :loading="props.loadingDownload" prepend-icon="ri-printer-line"
              @click="emit('downloadCredentials')">
              Cetak Akun Regu
            </VBtn>
            <VBtn variant="flat" color="success" prepend-icon="ri-add-large-line" @click="handleJumpFromUsers">
              Tambah Akun Ketua Regu
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

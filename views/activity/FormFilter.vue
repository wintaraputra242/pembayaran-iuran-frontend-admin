<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { action: string | null; user: string; date: string | string[] }): void
  (e: 'reload'): void
}>()

const props = withDefaults(defineProps<{
  initialAction?: string | null
  initialUser?: string
  initialDate?: string | string[]
}>(), {
  initialAction: null,
  initialUser: '',
  initialDate: '',
})

const filters = reactive({
  action: props.initialAction ?? null,
  user: props.initialUser ?? '',
  date: props.initialDate ?? '',
})

watch(() => props.initialAction, (val) => { filters.action = val ?? null })
watch(() => props.initialUser, (val) => { filters.user = val ?? '' })
watch(() => props.initialDate, (val) => { filters.date = val ?? '' })

// Auto-submit
watch(() => filters.user, useDebounceFn(() => {
  emit('filter', { ...filters })
}, 400))

watch(() => filters.action, () => emit('filter', { ...filters }))

watch(() => filters.date, (val) => {
  if (Array.isArray(val) && val.length === 2 || !val || val === '') {
    emit('filter', { ...filters })
  }
}, { deep: true })

const handleReload = () => {
  filters.action = null
  filters.user = ''
  filters.date = ''
  emit('reload')
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VRow align="center">
        <VCol cols="12" sm="4">
          <VTextField v-model="filters.user" placeholder="Cari nama user" prepend-inner-icon="ri-user-line" hide-details
            clearable />
        </VCol>

        <VCol cols="12" sm="4">
          <VSelect v-model="filters.action" placeholder="Semua Aksi" item-title="label" item-value="value" hide-details
            clearable :items="[
              { label: 'Tambah', value: 'create' },
              { label: 'Ubah', value: 'update' },
              { label: 'Hapus', value: 'delete' },
              { label: 'Login', value: 'login' },
              { label: 'Logout', value: 'logout' },
              { label: 'Export', value: 'export' },
              { label: 'Kirim Notifikasi', value: 'send_notification' },
            ]" />
        </VCol>

        <VCol cols="12" sm="3">
          <DatePicker v-model="filters.date" placeholder="Rentang tanggal" range :enable-time="false" clearable />
        </VCol>

        <VCol cols="12" sm="1">
          <IconBtn variant="flat" color="primary" @click="handleReload">
            <VIcon icon="ri-restart-line" />
            <VTooltip activator="parent">Reset Filter</VTooltip>
          </IconBtn>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

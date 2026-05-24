<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: {
    action: string | null
    user: string
    date: string | string[]
  }): void
  (e: 'reload'): void
}>()

const filters = reactive({
  action: null as string | null,
  user: '',
  date: '' as string | string[],
})

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
      <VForm @submit.prevent="emit('filter', filters)">
        <VRow align="center">
          <VCol cols="12" sm="6">
            <VTextField v-model="filters.user" placeholder="Masukkan nama user" prepend-inner-icon="ri-user-line"
              clearable />
          </VCol>

          <VCol cols="12" sm="6">
            <VSelect v-model="filters.action" placeholder="Pilih aksi" item-title="label" item-value="value" clearable
              :items="[
                { label: 'Tambah', value: 'create' },
                { label: 'Ubah', value: 'update' },
                { label: 'Hapus', value: 'delete' },
                { label: 'Login', value: 'login' },
                { label: 'Logout', value: 'logout' },
                { label: 'Export', value: 'export' },
                { label: 'Kirim Notifikasi', value: 'send_notification' },
              ]" />
          </VCol>

          <VCol cols="12" sm="6">
            <DatePicker v-model="filters.date" placeholder="Pilih rentang tanggal" range :enable-time="false" />
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
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'filter', item: { keyword: string, role: null | string }): void;
  (e: 'reload'): void;
  (e: 'downloadCredentials'): void;
}>();

const props = withDefaults(defineProps<{
  loadingDownload: boolean
}>(), {})


const filters = reactive({
  keyword: '',
  role: null,
})

const handleJumpFromUsers = () => {
  localStorage.setItem('from', 'create-user')
  navigateTo('/master-data/regu')
}

const handleReload = () => {
  filters.keyword = ''
  filters.role = null

  emit('reload')
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="emit('filter', filters)">
        <VRow align="center">
          <VCol cols="12" sm="6">
            <VTextField v-model="filters.keyword" placeholder="Cari pengguna" />
          </VCol>
          <VCol cols="12" sm="6">
            <VSelect v-model="filters.role" placeholder="Pilih role" item-title="label" item-value="value" :items="[
              { label: 'Admin', value: 'admin' },
              { label: 'Ketua Regu', value: 'ketua_regu' },
            ]" />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn variant="flat" color="primary" type="submit">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>
              <IconBtn variant="flat" color="primary" @click="handleReload">
                <VIcon icon="ri-restart-line" />
              </IconBtn>
              <VBtn variant="flat" :loading="props.loadingDownload" color="info" @click="emit('downloadCredentials')">
                <VIcon icon="ri-printer-line" class="me-2" />
                Cetak Username & Password
              </VBtn>
              <VBtn variant="flat" color="success" @click="handleJumpFromUsers">
                <VIcon icon="ri-add-large-line" class="me-2" />
                Tambah Akun Ketua Regu
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
</template>

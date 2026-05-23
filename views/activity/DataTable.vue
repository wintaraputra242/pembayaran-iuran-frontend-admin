<script setup lang="ts">
import type { PaginationMeta } from '@/types/common';

const emit = defineEmits<{
  (e: 'loadMore'): void
}>()

const props = withDefaults(defineProps<{
  data: any[]
  meta: null | PaginationMeta
  loading: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {})

const authStore = useAuthStore()

const baseHeaders = [
  { key: 'no', label: 'No.', width: '70px' },
  { key: 'petugas', label: 'Petugas', width: '180px' },
  { key: 'created_at', label: 'Waktu', width: '180px' },
  { key: 'action', label: 'Aksi', width: '160px' },
  { key: 'description', label: 'Deskripsi Aktivitas', width: '400px' },
]

const headers = computed(() => {
  if (authStore.user?.role === 'ketua_regu') {
    return baseHeaders.filter(h => h.key !== 'petugas')
  }

  return baseHeaders
})

const actionColor: Record<string, string> = {
  create: 'success',
  update: 'info',
  delete: 'error',
  login: 'primary',
  logout: 'secondary',
  export: 'warning',
  import: 'info',
  send_notification: 'primary',
  download: 'success',
}

const actionLabel: Record<string, string> = {
  create: 'Tambah',
  update: 'Ubah',
  delete: 'Hapus',
  login: 'Login',
  logout: 'Logout',
  export: 'Export',
  import: 'Import',
  send_notification: 'Kirim Notifikasi',
  download: 'Download',
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @loadMore="emit('loadMore')">

    <!-- waktu -->
    <template #cell-petugas="{ item }">
      {{ item?.user?.name }}
    </template>

    <!-- waktu -->
    <template #cell-created_at="{ item }">
      {{ formatDateID(item.created_at) }}
    </template>

    <!-- action -->
    <template #cell-action="{ item }">
      <VChip size="small" class="text-capitalize" :color="actionColor[item.action] || 'secondary'">
        {{ actionLabel[item.action] || item.action }}
      </VChip>
    </template>

    <!-- description -->
    <template #cell-description="{ item }">
      <span class="text-body-2">
        {{ item.description }}
      </span>
    </template>

    <!-- ip -->
    <template #cell-ip_address="{ item }">
      <span class="text-medium-emphasis">
        {{ item.ip_address }}
      </span>
    </template>

    <!-- user agent -->
    <template #cell-user_agent="{ item }">
      <span class="text-medium-emphasis text-truncate d-inline-block" style="max-width: 280px;">
        {{ item.user_agent }}
      </span>
    </template>

  </AppDataTable>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  /* tinggi container */
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>

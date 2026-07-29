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
  { key: 'no', label: 'No.', width: '60px' },
  { key: 'petugas', label: 'Petugas', width: '180px' },
  { key: 'action', label: 'Aksi', width: '130px' },
  { key: 'description', label: 'Deskripsi', width: '350px' },
  { key: 'created_at', label: 'Waktu', width: '160px' },
]

const headers = computed(() => {
  if (authStore.user?.role === 'ketua_regu') {
    return baseHeaders.filter(h => h.key !== 'petugas')
  }
  return baseHeaders
})

const actionColor: Record<string, string> = {
  create: 'success', update: 'info', delete: 'error',
  login: 'primary', logout: 'secondary', export: 'warning',
  import: 'info', send_notification: 'primary', download: 'success',
}

const actionLabel: Record<string, string> = {
  create: 'Tambah', update: 'Ubah', delete: 'Hapus',
  login: 'Login', logout: 'Logout', export: 'Export',
  import: 'Import', send_notification: 'Kirim Notifikasi', download: 'Download',
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @load-more="emit('loadMore')">
    <!-- Petugas -->
    <template #cell-petugas="{ item }">
      <span class="font-weight-medium">{{ item?.user?.name ?? '-' }}</span>
    </template>

    <!-- Waktu -->
    <template #cell-created_at="{ item }">
      <span class="text-body-2">{{ formatDateID(item.created_at) }}</span>
    </template>

    <!-- Aksi -->
    <template #cell-action="{ item }">
      <VChip size="small" class="text-capitalize" :color="actionColor[item.action] || 'secondary'" variant="tonal">
        {{ actionLabel[item.action] || item.action }}
      </VChip>
    </template>

    <!-- Deskripsi -->
    <template #cell-description="{ item }">
      <span class="text-body-2">{{ item.description }}</span>
    </template>
  </AppDataTable>
</template>

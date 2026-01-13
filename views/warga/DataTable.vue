<script setup lang="ts">
import type { MasterWarga } from '@/types/api/master-warga';
import type { PaginationMeta } from '@/types/common';


const emit = defineEmits<{
  (e: 'updateStatus', item: MasterWarga): void;
  (e: 'edit', item: MasterWarga): void;
  (e: 'delete', item: MasterWarga): void;
  (e: 'loadMore'): void;
}>();

const props = withDefaults(defineProps<{
  data: any[]
  meta: null | PaginationMeta
  loading: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {})

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'nik', label: 'NIK', width: '400px' },
  { key: 'nama_warga', label: 'Nama', width: '200px' },
  { key: 'alamat', label: 'Alamat', align: 'center' },
  { key: 'no_hp', label: 'No. HP', align: 'center' },
  { key: 'status_keaktifan', label: 'Status Keaktifan', align: 'center' },
  { key: 'is_deleted' },
  { key: 'actions' },
]

</script>

<template>
  <AppDataTable
    :headers="headers"
    :items="props.data"
    :loading="props.loading"
    :has-more="props.hasMore"
    :has-filter="props.hasFilter"
    @loadMore="emit('loadMore')"
  >
    <template #cell-status_keaktifan="{ item }">
      <VChip size="small" :color="item.status_keaktifan === 'aktif' ? 'success' : 'error'">
        {{ item.status_keaktifan === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <template #cell-actions="{ item }">
      <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('updateStatus', item)">
        <VIcon :icon="item.status_keaktifan === 'aktif' ? 'ri-eye-off-line' : 'ri-eye-line'" />
      </IconBtn>
      <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('edit', item)">
        <VIcon icon="ri-edit-line" />
      </IconBtn>
      <IconBtn v-if="!item.is_deleted" variant="outlined" class="rounded-lg" size="small" color="error" @click="emit('delete', item)">
        <VIcon icon="ri-delete-bin-line" />
      </IconBtn>
    </template>
  </AppDataTable>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;   /* tinggi container */
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>

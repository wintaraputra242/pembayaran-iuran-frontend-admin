<script setup lang="ts">
import type { MasterRegu } from '@/types/api/master-regu';
import type { PaginationMeta } from '@/types/common';


const emit = defineEmits<{
  (e: 'showAnggota', item: MasterRegu): void;
  (e: 'updateStatus', item: MasterRegu): void;
  (e: 'edit', item: MasterRegu): void;
  (e: 'delete', item: MasterRegu): void;
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
  { key: 'nama_regu', label: 'Nama Regu' },
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
      <IconBtn v-if="item.status_keaktifan === 'aktif'" variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('showAnggota', item)">
        <VIcon icon="ri-team-line" />
      </IconBtn>
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

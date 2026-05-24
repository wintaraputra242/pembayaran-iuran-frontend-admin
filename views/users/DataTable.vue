<script setup lang="ts">
import type { MasterUser } from '@/types/api/master-users';
import type { PaginationMeta } from '@/types/common';

const props = withDefaults(defineProps<{
  data: MasterUser[]
  meta: null | PaginationMeta
  loading: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {})

const emit = defineEmits<{
  (e: 'getPassword', item: MasterUser): void;
  (e: 'loadMore'): void;
}>();

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'name', label: 'Nama', width: '400px' },
  { key: 'username', label: 'Username', width: '200px' },
  { key: 'role', label: 'Role', align: 'center' },
  { key: 'actions' },
]
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @loadMore="emit('loadMore')">
    <template #cell-role="{ item }">
      <VChip size="small" :color="item.role === 'admin' ? 'success' : 'info'">
        {{ item.role === 'admin' ? 'Admin' : 'Ketua Regu' }}
      </VChip>
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

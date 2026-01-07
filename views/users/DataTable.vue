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

// Dummy data simulasi API
// const allDummyData = Array.from({ length: 100 }, (_, i) => ({
//   id: i + 1,
//   nama: `Warga #${i + 1}`,
//   info: i % 2 === 0 ? 'Notifikasi belum dibaca' : 'Pembayaran berhasil',
//   created_at: `2025-01-${String((i % 28) + 1).padStart(2, '0')}`,
// }))
  
// State
// const items = ref<any[]>([])
// const isLoading = ref(false)
// const hasMore = ref(true)

// const loadData = async () => {
//   if (props.loading.value || !hasMore.value) return

//   props.loading.value = true
//   await new Promise(resolve => setTimeout(resolve, 500))

//   const start = (page.value - 1) * perPage
//   const end = page.value * perPage
//   const newData = allDummyData.slice(start, end)

//   items.value.push(...newData)
//   page.value++

//   if (end >= allDummyData.length) {
//     hasMore.value = false
//   }

//   props.loading.value = false
// }

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'name', label: 'Nama', width: '400px' },
  { key: 'username', label: 'Username', width: '200px' },
  { key: 'role', label: 'Role', align: 'center' },
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
    <template #cell-role="{ item }">
      <VChip size="small" :color="item.role === 'admin' ? 'success' : 'info'">
        {{ item.role === 'admin' ? 'Admin' : 'Ketua Regu' }}
      </VChip>
    </template>

    <template #cell-actions="{ item }">
      <IconBtn
        size="small"
        variant="outlined"
        color="secondary"
        @click="emit('getPassword', item)"
      >
        <VIcon icon="ri-lock-2-line" />
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

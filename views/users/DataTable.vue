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
  (e: 'getPassword', item: MasterUser): void
  (e: 'delete', item: MasterUser): void
  (e: 'loadMore'): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'name', label: 'Nama', width: '250px' },
  { key: 'username', label: 'Username', width: '200px' },
  { key: 'role', label: 'Role', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions' },
]
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :meta="props.meta" :loading="props.loading"
    :has-more="props.hasMore" :has-filter="props.hasFilter" @load-more="emit('loadMore')"
    @change-page="emit('changePage', $event)" @change-limit="emit('changeLimit', $event)">
    <!-- Nama -->
    <template #cell-name="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.name }}</span>
        <span class="text-caption text-medium-emphasis">{{ item.username }}</span>
      </div>
    </template>

    <!-- Username — hide di mobile karena sudah di nama -->
    <template #cell-username="{ item }">
      <span class="text-body-2">{{ item.username }}</span>
    </template>

    <!-- Role -->
    <template #cell-role="{ item }">
      <VChip size="small" :color="item.role === 'admin' ? 'success' : 'info'" variant="tonal">
        {{ item.role === 'admin' ? 'Admin' : 'Ketua Regu' }}
      </VChip>
    </template>

    <!-- Status -->
    <template #cell-status="{ item }">
      <VChip size="small" :color="item.is_active ? 'success' : 'error'" variant="tonal">
        {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
      </VChip>
    </template>

    <!-- Aksi -->
    <template #cell-actions="{ item }">
      <div class="d-flex gap-1">
        <!-- <VTooltip text="Lihat Akun">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" size="small" color="primary" class="rounded-lg"
              @click="emit('getPassword', item)">
              <VIcon icon="ri-key-line" />
            </IconBtn>
          </template>
</VTooltip> -->

        <!-- <VTooltip text="Hapus">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" size="small" color="error" class="rounded-lg"
              @click="emit('delete', item)">
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </template>
        </VTooltip> -->
      </div>
    </template>
  </AppDataTable>
</template>

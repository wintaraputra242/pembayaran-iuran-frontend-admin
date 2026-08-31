<script setup lang="ts">
import type { MasterRegu } from '@/types/api/master-regu';
import type { PaginationMeta } from '@/types/common';

const emit = defineEmits<{
  (e: 'showAnggota', item: MasterRegu): void
  (e: 'updateStatus', item: MasterRegu): void
  (e: 'edit', item: MasterRegu): void
  (e: 'delete', item: MasterRegu): void
  (e: 'loadMore'): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

const props = withDefaults(defineProps<{
  data: any[]
  meta: null | PaginationMeta
  loading: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {})

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'nama_regu', label: 'Nama Regu', width: '250px' },
  { key: 'status_keaktifan', label: 'Status', align: 'center', width: '130px' },
  { key: 'actions' },
]
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :meta="props.meta" :loading="props.loading"
    :has-more="props.hasMore" :has-filter="props.hasFilter" @load-more="emit('loadMore')"
    @change-page="emit('changePage', $event)" @change-limit="emit('changeLimit', $event)">
    <!-- Nama Regu -->
    <template #cell-nama_regu="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.nama_regu }}</span>
        <span v-if="item.deleted_at" class="text-caption text-error">
          <VIcon size="11" icon="ri-delete-bin-line" class="me-1" />
          Dihapus
        </span>
      </div>
    </template>

    <!-- Status -->
    <template #cell-status_keaktifan="{ item }">
      <VChip size="small" :color="item.status_keaktifan === 'aktif' ? 'success' : 'error'" variant="tonal">
        {{ item.status_keaktifan === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <!-- Aksi -->
    <template #cell-actions="{ item }">
      <div class="d-flex gap-1">
        <!-- Lihat Anggota -->
        <VTooltip v-if="item.status_keaktifan === 'aktif'" text="Lihat Anggota">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small" color="primary"
              @click="emit('showAnggota', item)">
              <VIcon icon="ri-team-line" />
            </IconBtn>
          </template>
        </VTooltip>

        <!-- Toggle Status -->
        <VTooltip :text="item.status_keaktifan === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small"
              :color="item.status_keaktifan === 'aktif' ? 'warning' : 'success'" @click="emit('updateStatus', item)">
              <VIcon :icon="item.status_keaktifan === 'aktif' ? 'ri-eye-off-line' : 'ri-eye-line'" />
            </IconBtn>
          </template>
        </VTooltip>

        <!-- Edit -->
        <VTooltip v-if="!item.deleted_at" text="Edit">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small" color="info"
              @click="emit('edit', item)">
              <VIcon icon="ri-edit-line" />
            </IconBtn>
          </template>
        </VTooltip>

        <!-- Hapus -->
        <VTooltip v-if="!item.deleted_at" text="Hapus">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small" color="error"
              @click="emit('delete', item)">
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </template>
        </VTooltip>
      </div>
    </template>
  </AppDataTable>
</template>

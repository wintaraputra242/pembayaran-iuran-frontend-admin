<script setup lang="ts">
import type { MasterWarga } from '@/types/api/master-warga';
import type { PaginationMeta } from '@/types/common';

const emit = defineEmits<{
  (e: 'updateStatus', item: MasterWarga): void
  (e: 'edit', item: MasterWarga): void
  (e: 'delete', item: MasterWarga): void
  (e: 'loadMore'): void
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
  { key: 'nama_warga', label: 'Nama', width: '220px' },
  { key: 'nik', label: 'NIK', width: '180px' },
  { key: 'no_hp', label: 'No. HP', width: '160px' },
  { key: 'status_keaktifan', label: 'Status', align: 'center', width: '120px' },
  { key: 'actions' },
]
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @load-more="emit('loadMore')">
    <!-- Nama + NIK -->
    <template #cell-nama_warga="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.nama_warga }}</span>
        <span v-if="item.deleted_at" class="text-caption text-error">
          <VIcon size="11" icon="ri-delete-bin-line" class="me-1" />
          Dihapus
        </span>
      </div>
    </template>

    <!-- NIK -->
    <template #cell-nik="{ item }">
      <span class="text-body-2 font-mono">{{ item.nik }}</span>
    </template>

    <!-- No HP -->
    <template #cell-no_hp="{ item }">
      <a v-if="item?.no_hp" :href="`https://wa.me/${item.no_hp.replace(/\D/g, '').replace(/^0/, '62')}`" target="_blank"
        rel="noopener noreferrer" class="text-decoration-none d-inline-flex align-center gap-1 px-2 py-1 rounded-lg"
        style="background: rgba(37, 211, 102, 0.1); border: 1px solid rgba(37, 211, 102, 0.3);">
        <VIcon icon="ri-whatsapp-line" size="13" color="success" />
        <p class="ma-0 text-caption font-weight-medium" style="color: #25d366;">{{ item.no_hp }}</p>
        <VIcon icon="ri-external-link-line" size="11" style="color: #25d366; opacity: 0.7;" />
      </a>
      <span v-else class="text-medium-emphasis">-</span>
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
        <!-- Toggle status -->
        <VTooltip :text="item.status_keaktifan === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small"
              :color="item.status_keaktifan === 'aktif' ? 'warning' : 'success'" @click="emit('updateStatus', item)">
              <VIcon :icon="item.status_keaktifan === 'aktif' ? 'ri-eye-off-line' : 'ri-eye-line'" />
            </IconBtn>
          </template>
        </VTooltip>

        <!-- Edit — hanya kalau belum dihapus -->
        <VTooltip v-if="!item.deleted_at" text="Edit">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small" color="info"
              @click="emit('edit', item)">
              <VIcon icon="ri-edit-line" />
            </IconBtn>
          </template>
        </VTooltip>

        <!-- Hapus — hanya kalau belum dihapus -->
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

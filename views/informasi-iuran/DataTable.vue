<script setup lang="ts">
import type { PaginationMeta } from '@/types/common';

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'delete', item: any): void
  (e: 'updateStatus', item: any): void
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
  { key: 'judul_iuran', label: 'Judul Iuran', width: '220px' },
  { key: 'jenis_iuran', label: 'Jenis', width: '120px', align: 'center' },
  { key: 'periode', label: 'Periode', width: '100px', align: 'center' },
  { key: 'jumlah_iuran', label: 'Nominal', width: '150px' },
  { key: 'status_aktif', label: 'Status', width: '110px', align: 'center' },
  { key: 'actions' },
]
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @load-more="emit('loadMore')">
    <!-- Judul -->
    <template #cell-judul_iuran="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.judul_iuran }}</span>
        <span v-if="item.nama_warga_meninggal" class="text-caption text-medium-emphasis">
          Alm. {{ item.nama_warga_meninggal }}
        </span>
      </div>
    </template>

    <!-- Jenis -->
    <template #cell-jenis_iuran="{ item }">
      <VChip size="small" :color="item.jenis_iuran === 'kematian' ? 'error' : 'info'" variant="tonal">
        {{ item.jenis_iuran === 'kematian' ? 'Kematian' : 'Bulanan' }}
      </VChip>
    </template>

    <!-- Periode -->
    <template #cell-periode="{ item }">
      <span class="text-body-2">{{ item.periode ?? '-' }}</span>
    </template>

    <!-- Nominal -->
    <template #cell-jumlah_iuran="{ item }">
      <span class="font-weight-medium">{{ formatRupiah(item.jumlah_iuran) }}</span>
    </template>

    <!-- Status -->
    <template #cell-status_aktif="{ item }">
      <VChip size="small" :color="item.status_aktif ? 'success' : 'error'" variant="tonal">
        {{ item.status_aktif ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <!-- Aksi -->
    <template #cell-actions="{ item }">
      <div class="d-flex gap-1">
        <VTooltip :text="item.status_aktif ? 'Nonaktifkan' : 'Aktifkan'">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small"
              :color="item.status_aktif ? 'warning' : 'success'" @click="emit('updateStatus', item)">
              <VIcon :icon="item.status_aktif ? 'ri-eye-off-line' : 'ri-eye-line'" />
            </IconBtn>
          </template>
        </VTooltip>

        <VTooltip text="Edit">
          <template #activator="{ props: tp }">
            <IconBtn v-bind="tp" variant="outlined" class="rounded-lg" size="small" color="info"
              @click="emit('edit', item)">
              <VIcon icon="ri-edit-line" />
            </IconBtn>
          </template>
        </VTooltip>

        <VTooltip text="Hapus">
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

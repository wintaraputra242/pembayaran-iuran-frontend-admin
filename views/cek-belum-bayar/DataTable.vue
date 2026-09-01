<script setup lang="ts">
// import qris from '@images/pages/qris.png'
import type { UnpaidWarga } from '@/types/api/pembayaran';
import type { PaginationMeta } from '@/types/common';

const props = withDefaults(defineProps<{
  data: UnpaidWarga[]
  meta?: null | PaginationMeta
  loading: boolean
  loadingSendNotif: boolean
  hasMore: boolean
  hasFilter: boolean
  jmlIuran?: number | string | null
  nikNotifSended?: string | null
}>(), {})

const emit = defineEmits<{
  (e: 'loadMore'): void
  (e: 'sendNotif', item: UnpaidWarga): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'Nama Warga', key: 'nama_warga', width: '250px' },
  { label: 'No. HP', key: 'no_hp', width: '250px' },
  { label: 'Alamat', key: 'alamat', width: '250px' },
  { label: 'Regu', key: 'regu', width: '200px' },
  { label: 'Jumlah Iuran yang Harus Dibayar', key: 'jumlah_iuran', width: '220px' },
  { label: 'Aksi', key: 'aksi', width: '160px', align: 'center', sortable: false },
]

type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired' | 'cancelled'

const statusChipsColor: Record<PaymentStatus, string> = {
  pending: 'info',
  success: 'success',
  failed: 'error',
  expired: 'secondary',
  cancelled: 'secondary',
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :meta="props.meta" :loading="props.loading"
    :has-more="props.hasMore"
    :no-data-text="!hasFilter ? 'Tolong lakukan pencaharian informasi iuran terlebih dahulu' : 'Tidak ada data'"
    @load-more="emit('loadMore')" @change-page="emit('changePage', $event)" @change-limit="emit('changeLimit', $event)">

    <!-- Nama Warga -->
    <template #cell-nama_warga="{ item }">
      {{ item.nama_warga }}
    </template>

    <!-- Regu -->
    <template #cell-regu="{ item }">
      {{ item.anggota_regu[0]?.regu?.nama_regu || '-' }}
    </template>

    <!-- Jumlah Iuran -->
    <template #cell-jumlah_iuran="{ item }">
      <span class="font-weight-bold text-error">
        {{ formatRupiah(jmlIuran as number) }}
      </span>
    </template>

    <!-- Aksi -->
    <template #cell-aksi="{ item }">
      <div class="d-flex gap-1 justify-center">
        <VBtn size="small" variant="flat" color="secondary"
          :loading="loadingSendNotif && (item.nik === nikNotifSended)" @click="emit('sendNotif', item)">
          <VIcon icon="ri-bell-line" class="me-1" />
          Kirim Notif
        </VBtn>
      </div>
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

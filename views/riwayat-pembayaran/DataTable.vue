<script setup lang="ts">
// import qris from '@images/pages/qris.png'
import type { Pembayaran, UnpaidWarga } from '@/types/api/pembayaran';
import type { PaginationMeta } from '@/types/common';
import qris from '@images/pages/qris.png';


const props = withDefaults(defineProps<{
  data: Pembayaran[]
  meta?: null | PaginationMeta
  loading: boolean
  hasMore: boolean
}>(), {})

const emit = defineEmits<{
  (e: 'loadMore'): void
  (e: 'showBuktiBayar', item: Pembayaran): void;
  (e: 'sendNotif', item: UnpaidWarga): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

const config = useRuntimeConfig()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'Tanggal Bayar', key: 'tanggal_bayar', width: '180px' },
  { label: 'Judul Iuran', key: 'judul_iuran', width: '220px' },
  { label: 'Metode Bayar', key: 'metode_bayar', width: '160px' },
  { label: 'Nominal', key: 'nominal', width: '160px' },
  { label: 'Petugas/Admin', key: 'petugas', width: '200px' },
  { label: 'Status', key: 'status', width: '150px', align: 'center' },
  { label: 'Bukti', key: 'bukti', width: '200px', align: 'center' },
]

const statusChipsColor: Record<
  'pending' |
  'waiting_payment' |
  'paid' |
  'failed' |
  'expired' |
  'canceled' |
  'manual' |
  'approved' |
  'rejected',
  string
> = {
  pending: 'info',
  waiting_payment: 'warning',
  paid: 'success',
  failed: 'error',
  expired: 'secondary',
  canceled: 'secondary',
  manual: 'success',
  approved: 'success',
  rejected: 'error',
}

const statusText: Record<
  'pending' |
  'waiting_payment' |
  'paid' |
  'failed' |
  'expired' |
  'canceled' |
  'manual' |
  'approved' |
  'rejected',
  string
> = {
  pending: 'Menunggu',
  waiting_payment: 'Menunggu Pembayaran',
  paid: 'Lunas',
  failed: 'Gagal',
  expired: 'Kedaluwarsa',
  canceled: 'Dibatalkan',
  manual: 'Lunas',
  approved: 'Diterima',
  rejected: 'Ditolak',
}
</script>

<template>
  <AppDataTable :headers="headers" :items="data" :meta="meta" :loading="loading" :has-more="hasMore"
    no-data-text="Belum ada transaksi pembayaran yang telah berhasil dilakukan" @load-more="emit('loadMore')"
    @change-page="emit('changePage', $event)" @change-limit="emit('changeLimit', $event)">

    <!-- ID Transaksi -->
    <template #cell-transaksi_id="{ item }">
      {{ item.transaksi_id }}
    </template>

    <!-- Tanggal Bayar -->
    <template #cell-tanggal_bayar="{ item }">
      {{ formatDateID(item.tanggal_bayar) }}
    </template>

    <!-- Judul Iuran -->
    <template #cell-judul_iuran="{ item }">
      {{ item.informasi_iuran?.judul_iuran }}
    </template>

    <!-- Metode Bayar -->
    <template #cell-metode_bayar="{ item }">
      <div class="d-flex align-center gap-1">
        <VIcon v-if="item.metode_bayar !== 'QRIS'"
          :icon="item.metode_bayar === 'Transfer' ? 'ri-exchange-line' : 'ri-cash-line'" size="20" />
        <VImg v-if="item.metode_bayar === 'QRIS'" :src="qris" max-width="20" />
        {{ item.metode_bayar }}
      </div>
    </template>

    <!-- Nominal -->
    <template #cell-nominal="{ item }">
      {{ formatRupiah(item.total_bayar) }}
    </template>

    <!-- Petugas -->
    <template #cell-petugas="{ item }">
      {{ item.processed_by ?? '-' }}
    </template>

    <!-- Status -->
    <template #cell-status="{ item }">
      <div class="text-capitalize">
        <VChip size="small" :color="statusChipsColor[item.status_bayar as keyof typeof statusChipsColor]">
          {{ statusText[item.status_bayar as keyof typeof statusText] }}
        </VChip>
      </div>
    </template>

    <!-- Bukti -->
    <template #cell-bukti="{ item }">
      <div v-if="item.bukti_pembayaran" v-ripple class="cursor-pointer d-inline-flex flex-column align-center gap-1"
        style="max-width: 70px;" @click="emit('showBuktiBayar', item)">
        <div style="position: relative; width: 54px; height: 54px;">
          <img :src="config.public.backendUrl + '/storage/' + item.bukti_pembayaran"
            style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(var(--v-theme-primary), 0.3);" />
          <!-- overlay icon zoom -->
          <div style="
        position: absolute; inset: 0;
        background: rgba(var(--v-theme-primary), 0.15);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
      ">
            <VIcon size="18" color="primary">ri-zoom-in-line</VIcon>
          </div>
        </div>
        <span style="font-size: 10px; color: rgb(var(--v-theme-primary)); white-space: nowrap;">
          Lihat Bukti
        </span>
      </div>
      <span v-else class="text-medium-emphasis">-</span>
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

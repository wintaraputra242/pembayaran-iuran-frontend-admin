<script setup lang="ts">
import type { PembayaranByRegu } from '@/types/api/pembayaran';
import type { PaginationMeta } from '@/types/common';
import qris from '@images/pages/qris.png'; // sesuaikan path


const props = defineProps<{
  data: PembayaranByRegu[]
  meta?: null | PaginationMeta
  loading?: boolean
  hasMore?: boolean
  hasFilter?: boolean
}>()

const emit = defineEmits<{
  (e: 'loadMore'): void
  (e: 'showBuktiBayar', item: any): void
  (e: 'approve', item: any): void
  (e: 'reject', item: any): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

const config = useRuntimeConfig()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'Nama Warga', key: 'nama_warga' },
  { label: 'Informasi Iuran', key: 'judul_iuran' },
  { label: 'Jenis Iuran', key: 'jenis_iuran' },
  { label: 'Bulan', key: 'bulan' },
  { label: 'Metode Bayar', key: 'metode_bayar' },
  { label: 'Nominal', key: 'nominal' },
  { label: 'Tgl Bayar', key: 'tanggal_bayar' },
  { label: 'Status', key: 'status' },
  { label: 'Petugas', key: 'petugas' },
  { label: 'Bukti', key: 'bukti_bayar' },
  { label: 'Aksi', key: 'aksi', width: '200px', align: 'center', sortable: false },
]

const bulanLabel: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
  5: 'Mei', 6: 'Jun', 7: 'Jul', 8: 'Ags',
  9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Des',
}

const statusChipsColor: Record<string, string> = {
  approved: 'success',
  rejected: 'error',
  cancelled: 'secondary',
  pending: 'info',
}

const statusText: Record<string, string> = {
  approved: 'Disetujui',
  rejected: 'Ditolak',
  cancelled: 'Dibatalkan',
  pending: 'Menunggu',
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :meta="props.meta" :loading="props.loading"
    :has-more="props.hasMore" :has-filter="props.hasFilter" @load-more="emit('loadMore')"
    @change-page="emit('changePage', $event)" @change-limit="emit('changeLimit', $event)">
    <!-- Nama Warga -->
    <template #cell-nama_warga="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.nama_warga }}</span>
        <span class="text-xs text-disabled">{{ item.nik }}</span>
      </div>
    </template>

    <!-- Judul Iuran -->
    <template #cell-judul_iuran="{ item }">
      <span>{{ item.informasi_iuran?.nama ?? '-' }}</span>
    </template>

    <!-- Jenis Iuran -->
    <template #cell-jenis_iuran="{ item }">
      <div class="text-capitalize">
        <VChip size="small" :color="item.informasi_iuran?.jenis_iuran === 'bulanan' ? 'info' : 'error'">
          {{ item.informasi_iuran?.jenis_iuran ?? '-' }}
        </VChip>
      </div>
    </template>

    <!-- Bulan -->
    <template #cell-bulan="{ item }">
      <div v-if="item.bulan?.length" class="d-flex flex-wrap gap-1">
        <VChip v-for="b in item.bulan" :key="b" size="x-small" variant="tonal" color="primary">
          {{ bulanLabel[b] ?? b }}
        </VChip>
      </div>
      <span v-else class="text-disabled">-</span>
    </template>

    <!-- Metode Bayar -->
    <template #cell-metode_bayar="{ item }">
      <div class="d-flex align-center gap-1 text-capitalize">
        <VIcon v-if="item.metode_bayar !== 'qris'"
          :icon="item.metode_bayar === 'transfer' ? 'ri-exchange-line' : 'ri-cash-line'" size="20" />
        <VImg v-if="item.metode_bayar === 'qris'" :src="qris" max-width="20px" />
        {{ item.metode_bayar ?? '-' }}
      </div>
    </template>

    <!-- Nominal -->
    <template #cell-nominal="{ item }">
      {{ formatRupiah(item.total_bayar) }}
    </template>

    <!-- Tanggal Bayar -->
    <template #cell-tanggal_bayar="{ item }">
      {{ item.tanggal_bayar ? formatDateID(item.tanggal_bayar) : '-' }}
    </template>

    <!-- Status -->
    <template #cell-status="{ item }">
      <VChip size="small" :color="statusChipsColor[item.status_bayar]">
        {{ statusText[item.status_bayar] }}
      </VChip>
    </template>

    <!-- Petugas -->
    <template #cell-petugas="{ item }">
      <span>{{ item.processed_by ?? '-' }}</span>
    </template>

    <!-- Bukti Pembayaran -->
    <template #cell-bukti_bayar="{ item }">
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

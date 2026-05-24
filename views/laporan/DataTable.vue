<script setup lang="ts">
import type { PaginationMeta } from '@/types/common';
import eCommerce2 from '@images/eCommerce/2.png';
import qris from '@images/pages/qris.png';

const emit = defineEmits<{
  (e: 'showHistoryPayment', item: any): void
  (e: 'showBuktiBayar', item: any): void
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
  { key: 'no', label: 'No.', width: '70px' },
  { key: 'transaction_id', label: 'ID Transaksi', width: '200px' },
  { key: 'tanggal_bayar', label: 'Tanggal Bayar', width: '180px' },
  { key: 'warga', label: 'Warga', width: '200px' },
  { key: 'regu', label: 'Regu', width: '180px' },
  { key: 'judul_iuran', label: 'Judul Iuran', width: '220px' },
  { key: 'jenis_iuran', label: 'Jenis Iuran', width: '220px' },
  { key: 'bulan_dibayar', label: 'Bulan Dibayar', width: '200px' },
  { key: 'metode_bayar', label: 'Metode Bayar', width: '160px' },
  { key: 'total_bayar', label: 'Nominal', width: '160px' },
  { key: 'petugas', label: 'Petugas/Admin', width: '200px' },
  { key: 'status_bayar', label: 'Status', width: '150px' },
]

const statusChipsColor: Record<string, string> = {
  pending: 'warning',
  waiting_payment: 'info',
  paid: 'success',
  failed: 'error',
  expired: 'secondary',
  canceled: 'secondary',
  manual: 'success',
}

const statusText: Record<string, string> = {
  pending: 'Pending',
  waiting_payment: 'Menunggu Pembayaran',
  paid: 'Lunas',
  failed: 'Gagal',
  expired: 'Kadaluarsa',
  canceled: 'Dibatalkan',
  manual: 'Lunas',
}

const bulanMap: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'Mei',
  6: 'Jun',
  7: 'Jul',
  8: 'Agu',
  9: 'Sep',
  10: 'Okt',
  11: 'Nov',
  12: 'Des',
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @loadMore="emit('loadMore')">

    <template #cell-tanggal_bayar="{ item }">
      {{ formatDateID(item.tanggal_bayar) }}
    </template>

    <template #cell-warga="{ item }">
      <span class="font-weight-bold">
        {{ item.warga }}
      </span>
    </template>

    <template #cell-bulan_dibayar="{ item }">
      <div v-if="item.bulan?.length" class="d-flex flex-wrap gap-1">
        <VChip v-for="b in item.bulan" :key="b" size="x-small" color="primary" variant="tonal">
          {{ bulanMap[b] }}
        </VChip>
      </div>

      <span v-else>-</span>
    </template>

    <template #cell-metode_bayar="{ item }">
      <div class="d-flex align-center gap-1 text-capitalize">
        <VIcon v-if="item.metode_bayar !== 'qris'"
          :icon="item.metode_bayar === 'transfer' ? 'ri-exchange-line' : 'ri-cash-line'" size="20" />
        <VImg v-if="item.metode_bayar === 'qris'" :src="qris" max-width="20" />
        {{ item.metode_bayar }}
      </div>
    </template>

    <template #cell-total_bayar="{ item }">
      {{ formatRupiah(item.total_bayar) }}
    </template>

    <!-- Jenis -->
    <template #cell-jenis_iuran="{ item }">
      <div class="text-capitalize">
        <VChip size="small" :color="item.jenis_iuran === 'bulanan' ? 'info' : 'error'">
          {{ item.jenis_iuran }}
        </VChip>
      </div>
    </template>

    <template #cell-status_bayar="{ item }">
      <VChip size="small" :color="statusChipsColor[item.status_bayar] || 'secondary'">
        {{ statusText[item.status_bayar] || item.status_bayar }}
      </VChip>
    </template>

    <template #cell-bukti="{ item }">
      <div class="d-flex justify-center">
        <div v-ripple class="pa-2 rounded-lg cursor-pointer" @click="emit('showBuktiBayar', item)">
          <VImg :src="item.bukti_pembayaran || eCommerce2" width="50" />
        </div>
      </div>
    </template>

  </AppDataTable>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>

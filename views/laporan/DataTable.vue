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
  { key: 'transaksi_id', label: 'ID Transaksi', width: '200px' },
  { key: 'tanggal_bayar', label: 'Tanggal Bayar', width: '180px' },
  { key: 'warga', label: 'Warga', width: '200px' },
  { key: 'regu', label: 'Regu', width: '180px' },
  { key: 'judul_iuran', label: 'Judul Iuran', width: '220px' },
  { key: 'bulan_dibayar', label: 'Bulan Dibayar', width: '200px' },
  { key: 'metode_bayar', label: 'Metode Bayar', width: '160px' },
  { key: 'nominal', label: 'Nominal', width: '160px' },
  { key: 'petugas', label: 'Petugas/Admin', width: '200px' },
  { key: 'status', label: 'Status', width: '150px' },
]

const statusChipsColor: any = {
  pending: 'info',
  success: 'success',
  failed: 'error',
  expired: 'secondary',
  cancelled: 'secondary',
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
  <AppDataTable
    :headers="headers"
    :items="props.data"
    :loading="props.loading"
    :has-more="props.hasMore"
    :has-filter="props.hasFilter"
    @loadMore="emit('loadMore')"
  >

    <template #cell-tanggal_bayar="{ item }">
      {{ formatDateID(item.tanggal_bayar) }}
    </template>

    <template #cell-warga="{ item }">
      <span
        class="text-info hover-text cursor-pointer"
        @click="emit('showHistoryPayment', item)"
      >
        {{ item.warga }}
        <VIcon icon="ri-arrow-right-up-long-line" size="16" />
      </span>
    </template>

    <template #cell-bulan_dibayar="{ item }">
      <div v-if="item.bulan?.length" class="d-flex flex-wrap gap-1">
        <VChip
          v-for="b in item.bulan"
          :key="b"
          size="x-small"
          color="primary"
          variant="tonal"
        >
          {{ bulanMap[b] }}
        </VChip>
      </div>

      <span v-else>-</span>
    </template>

    <template #cell-metode_bayar="{ item }">
      <div class="d-flex align-center gap-1">
        <VIcon
          v-if="item.metode_bayar !== 'QRIS'"
          :icon="item.metode_bayar === 'Transfer' ? 'ri-exchange-line' : 'ri-cash-line'"
          size="20"
        />
        <VImg
          v-if="item.metode_bayar === 'QRIS'"
          :src="qris"
          max-width="20"
        />
        {{ item.metode_bayar }}
      </div>
    </template>

    <template #cell-nominal="{ item }">
      {{ formatRupiah(item.nominal) }}
    </template>

    <template #cell-status="{ item }">
      <VChip
        size="small"
        :color="statusChipsColor[item.status] || 'secondary'"
      >
        {{ item.status }}
      </VChip>
    </template>

    <template #cell-bukti="{ item }">
      <div class="d-flex justify-center">
        <div
          v-ripple
          class="pa-2 rounded-lg cursor-pointer"
          @click="emit('showBuktiBayar', item)"
        >
          <VImg
            :src="item.bukti_pembayaran || eCommerce2"
            width="50"
          />
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

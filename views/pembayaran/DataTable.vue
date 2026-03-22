<script setup lang="ts">
// import qris from '@images/pages/qris.png'
import type { Pembayaran } from '@/types/api/pembayaran';
import type { PaginationMeta } from '@/types/common';
import qris from '@images/pages/qris.png';

const props = withDefaults(defineProps<{
  data: Pembayaran[]
  meta: null | PaginationMeta
  loading: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {})

const emit = defineEmits<{
  (e: 'showHistoryPayment', item: Pembayaran): void;
  (e: 'showBuktiBayar', item: Pembayaran): void;
  (e: 'loadMore'): void;
}>();

const router = useRouter()
const config = useRuntimeConfig()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'ID Transaksi', key: 'transaction_id', width: '200px' },
  { label: 'Warga', key: 'warga', width: '200px' },
  { label: 'Regu', key: 'regu', width: '180px' },
  { label: 'Judul Iuran', key: 'judul_iuran', width: '220px' },
  { label: 'Jenis Iuran', key: 'jenis_iuran', width: '220px' },
  { label: 'Nominal Bayar', key: 'nominal', width: '160px' },
  { label: 'Tanggal Bayar', key: 'tanggal_bayar', width: '180px' },
  { label: 'Metode Bayar', key: 'metode_bayar', width: '160px' },
  { label: 'Petugas/Admin', key: 'petugas', width: '200px' },
  { label: 'Status', key: 'status', width: '150px', align: 'center' },
  { label: 'Bukti Pembayaran', key: 'bukti_bayar', width: '200px', align: 'center', sortable: false },
]

const statusChipsColor: Record<
  'pending' |
  'waiting_payment' |
  'paid' |
  'failed' |
  'expired' |
  'canceled' |
  'manual',
  string
> = {
  pending: 'info',
  waiting_payment: 'warning',
  paid: 'success',
  failed: 'error',
  expired: 'secondary',
  canceled: 'secondary',
  manual: 'primary',
}

const statusText: Record<
  'pending' |
  'waiting_payment' |
  'paid' |
  'failed' |
  'expired' |
  'canceled' |
  'manual',
  string
> = {
  pending: 'Menunggu',
  waiting_payment: 'Menunggu Pembayaran',
  paid: 'Lunas',
  failed: 'Gagal',
  expired: 'Kedaluwarsa',
  canceled: 'Dibatalkan',
  manual: 'Manual',
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
    <!-- Tanggal Bayar -->
    <template #cell-tanggal_bayar="{ item }">
      {{ formatDateID(item.tanggal_bayar) }}
    </template>

    <!-- Warga -->
    <template #cell-warga="{ item }">
      <span
        class="text-info hover-text cursor-pointer"
        @click="router.push('/pembayaran/riwayat/' + item.warga.nik)"
      >
        {{ item.warga.nama_warga }}
        <VIcon icon="ri-arrow-right-up-long-line" size="16" />
      </span>
    </template>

    <template #cell-regu="{ item }">
      <span>
        {{ item.warga.anggota_regu?.regu.nama_regu || '-' }}
      </span>
    </template>

    <template #cell-judul_iuran="{ item }">
      <span>
        {{ item.informasi_iuran.judul_iuran || '-' }}
      </span>
    </template>

    <!-- Jenis -->
    <template #cell-jenis_iuran="{ item }">
      <div class="text-capitalize">
        <VChip
          size="small"
          :color="item.informasi_iuran.jenis_iuran === 'bulanan' ? 'info' : 'error'"
        >
          {{ item.informasi_iuran.jenis_iuran }}
        </VChip>
      </div>
    </template>

    <!-- Metode Bayar -->
    <template #cell-metode_bayar="{ item }">
      <div class="d-flex align-center gap-1 text-capitalize">
        <VIcon
          v-if="item.metode_bayar !== 'qris'"
          :icon="item.metode_bayar === 'transfer' ? 'ri-exchange-line' : 'ri-cash-line'"
          size="20"
        />
        <VImg
          v-if="item.metode_bayar === 'qris'"
          :src="qris"
          max-width="20px"
        />
        {{ item.metode_bayar }}
      </div>
    </template>

    <!-- Nominal -->
    <template #cell-nominal="{ item }">
      {{ formatRupiah(item.total_bayar) }}
    </template>

    <!-- Status -->
    <template #cell-status="{ item }">
      <div class="text-capitalize">
        <VChip
          size="small"
          :color="statusChipsColor[item.status_bayar as keyof typeof statusChipsColor]"
        >
          {{ statusText[item.status_bayar as keyof typeof statusText] }}
        </VChip>
      </div>
    </template>

    <!-- Petugas -->
    <template #cell-petugas="{ item }">
      <span>
        {{ item.processed_by.name }}
      </span>
    </template>

    <!-- Bukti Pembayaran -->
    <template #cell-bukti_bayar="{ item }">
      <div class="d-flex">
        <div
          v-ripple
          class="pa-2 rounded-lg cursor-pointer"
          @click="emit('showBuktiBayar', item)"
        >
          <!-- <VImg :src="item.bukti_pembayaran || eCommerce2" width="50" /> -->
          <VImg v-if="item.bukti_pembayaran" :src="config.public.backendUrl + '/storage/' + item.bukti_pembayaran" width="50" />
          <span v-else>-</span>
        </div>
      </div>
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

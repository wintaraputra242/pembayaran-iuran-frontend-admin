<script setup lang="ts">
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
  (e: 'showRejectionReason', item: Pembayaran): void
  (e: 'showHistoryPayment', item: Pembayaran): void
  (e: 'showBuktiBayar', item: Pembayaran): void
  (e: 'loadMore'): void
  (e: 'approved', item: Pembayaran): void
  (e: 'reject', item: Pembayaran): void
  (e: 'cancel', item: Pembayaran): void  // ← tambah ini
}>()

const config = useRuntimeConfig()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'Warga', key: 'warga', width: '200px' },
  { label: 'Regu', key: 'regu', width: '180px' },
  { label: 'Judul Iuran', key: 'judul_iuran', width: '220px' },
  { label: 'Jenis Iuran', key: 'jenis_iuran', width: '150px' },
  { label: 'Nominal Bayar', key: 'nominal', width: '160px' },
  { label: 'Tanggal Bayar', key: 'tanggal_bayar', width: '180px' },
  { label: 'Metode Bayar', key: 'metode_bayar', width: '160px' },
  { label: 'Petugas/Admin', key: 'petugas', width: '200px' },
  { label: 'Status', key: 'status', width: '150px', align: 'center' },
  { label: 'Bukti Pembayaran', key: 'bukti_bayar', width: '160px', align: 'center', sortable: false },
  { label: 'Aksi', key: 'aksi', width: '120px', align: 'center', sortable: false },
]

// tambah cancelled di status
const statusChipsColor: Record<string, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  cancelled: 'secondary', // ← tambah ini
}

const statusText: Record<string, string> = {
  pending: 'Menunggu Validasi',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  cancelled: 'Dibatalkan', // ← tambah ini
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @loadMore="emit('loadMore')">

    <!-- Tanggal Bayar -->
    <template #cell-tanggal_bayar="{ item }">
      {{ formatDateID(item.tanggal_bayar) }}
    </template>

    <!-- Warga -->
    <template #cell-warga="{ item }">
      <span class="text-info hover-text cursor-pointer" @click="emit('showHistoryPayment', item)">
        {{ item.warga.nama_warga }}
        <VIcon icon="ri-arrow-right-up-long-line" size="16" />
      </span>
    </template>

    <!-- Regu -->
    <template #cell-regu="{ item }">
      {{ item.warga?.anggota_regu[0]?.regu?.nama_regu || '-' }}
    </template>

    <!-- Judul Iuran -->
    <template #cell-judul_iuran="{ item }">
      {{ item.informasi_iuran.judul_iuran || '-' }}
    </template>

    <!-- Jenis Iuran -->
    <template #cell-jenis_iuran="{ item }">
      <VChip size="small" :color="item.informasi_iuran.jenis_iuran === 'bulanan' ? 'info' : 'error'"
        class="text-capitalize">
        {{ item.informasi_iuran.jenis_iuran }}
      </VChip>
    </template>

    <!-- Metode Bayar -->
    <template #cell-metode_bayar="{ item }">
      <div class="d-flex align-center gap-1 text-capitalize">
        <VImg v-if="item.metode_bayar === 'qris'" :src="qris" max-width="20px" />
        <VIcon v-else :icon="item.metode_bayar === 'transfer' ? 'ri-exchange-line' : 'ri-cash-line'" size="20" />
        {{ item.metode_bayar }}
      </div>
    </template>

    <!-- Nominal -->
    <template #cell-nominal="{ item }">
      {{ formatRupiah(item.total_bayar) }}
    </template>

    <!-- Status -->
    <template #cell-status="{ item }">
      <VChip size="small" :color="statusChipsColor[item.status_bayar]">
        {{ statusText[item.status_bayar] }}
      </VChip>
    </template>

    <!-- Petugas -->
    <template #cell-petugas="{ item }">
      {{ item?.processed_by?.name || '-' }}
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

    <!-- Aksi Validasi -->
    <template #cell-aksi="{ item }">
      <div class="d-flex gap-1">

        <!-- Pending: tampilkan approved & reject -->
        <template v-if="item.status_bayar === 'pending'">
          <VBtn size="small" variant="flat" color="success" @click="emit('approved', item)">
            <VIcon icon="ri-check-line" /> &nbsp;
            Terima
          </VBtn>

          <VBtn size="small" variant="flat" color="error" @click="emit('reject', item)">
            <VIcon icon="ri-close-line" /> &nbsp;
            Tolak
          </VBtn>
        </template>

        <!-- Approved -->
        <!-- <template v-else-if="item.status_bayar === 'approved'">
          <VTooltip text="Disetujui">
            <template #activator="{ props: tooltipProps }">
              <VIcon v-bind="tooltipProps" icon="ri-checkbox-circle-line" color="success" size="22" />
            </template>
          </VTooltip>
        </template> -->
        <template v-else-if="item.status_bayar === 'approved'">
          <div class="d-flex align-center gap-2">
            <div class="d-flex align-center gap-1">
              <VIcon icon="ri-checkbox-circle-line" color="success" size="22" />
              <span class="text-success">Diterima</span>
            </div>
            <VBtn size="x-small" variant="flat" color="error" @click="emit('cancel', item)">
              <VIcon icon="ri-close-line" size="14" class="me-1" />
              Batalkan
            </VBtn>
          </div>
        </template>

        <!-- Rejected -->
        <!-- <template v-else-if="item.status_bayar === 'rejected'">
          <VTooltip :text="'Ditolak: ' + (item.rejection_reason || '-')">
            <template #activator="{ props: tooltipProps }">
              <VIcon v-bind="tooltipProps" icon="ri-close-circle-line" color="error" size="22" />
            </template>
          </VTooltip>
        </template> -->
        <template v-else-if="item.status_bayar === 'rejected'">
          <div v-ripple v-tooltip="'Klik untuk lihat alasan penolakan'"
            class="d-inline-flex align-center gap-1 cursor-pointer px-2 py-1 rounded-lg"
            style="border: 1px dashed rgb(var(--v-theme-error)); background: rgba(var(--v-theme-error), 1);"
            @click="emit('showRejectionReason', item)">
            <VIcon icon="ri-close-circle-line" color="white" size="16" />
            <span class="text-white" style="font-size: 12px; white-space: nowrap;">Ditolak</span>
            <VIcon icon="ri-information-line" color="white" size="14" style="opacity: 0.7;" />
          </div>
        </template>

        <template v-else-if="item.status_bayar === 'cancelled'">
          <div class="d-flex align-center gap-1">
            <VIcon icon="ri-forbid-line" color="secondary" size="22" />
            <span class="text-secondary">Dibatalkan</span>
          </div>
        </template>

      </div>
    </template>

  </AppDataTable>
</template>

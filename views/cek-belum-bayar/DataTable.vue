<script setup lang="ts">
// import qris from '@images/pages/qris.png'
import type { UnpaidWarga } from '@/types/api/pembayaran';

const props = withDefaults(defineProps<{
  data: UnpaidWarga[]
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
}>()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'Nama Warga', key: 'nama_warga', width: '250px' },
  { label: 'No. HP', key: 'no_hp', width: '250px' },
  { label: 'Alamat', key: 'alamat', width: '250px' },
  { label: 'Regu', key: 'regu', width: '200px' },
  { label: 'Jumlah Iuran yang Harus Dibayar', key: 'jumlah_iuran', width: '180px' },
  { key: 'actions' },
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
  <AppDataTable
    :headers="headers"
    :items="props.data"
    :loading="props.loading"
    :has-more="props.hasMore"
    :no-data-text="!hasFilter ? 'Tolong lakukan pencaharian informasi iuran terlebih dahulu' : 'Tidak ada data' "
    @loadMore="emit('loadMore')"
  >

    <!-- Nama Warga -->
    <template #cell-nama_warga="{ item }">
      {{ item.nama_warga }}
    </template>

    <!-- Regu -->
    <template #cell-regu="{ item }">
      {{ item.anggota_regu?.regu?.nama_regu || '-' }}
    </template>

    <!-- Jumlah Iuran -->
    <template #cell-jumlah_iuran="{ item }">
      <span class="font-weight-bold text-error">
        {{ formatRupiah(jmlIuran as number) }}
      </span>
    </template>

    <!-- Aksi -->
    <template #cell-actions="{ item }">
      <IconBtn
        variant="outlined"
        class="rounded-lg"
        size="small"
        color="secondary"
        :loading="loadingSendNotif && (item.nik === nikNotifSended)"
        @click="emit('sendNotif', item)"
      >
        <VIcon icon="ri-bell-line" />
      </IconBtn>
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

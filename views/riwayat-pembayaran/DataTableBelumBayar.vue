<script setup lang="ts">
// import qris from '@images/pages/qris.png'
import type { Pembayaran, UnpaidWarga } from '@/types/api/pembayaran';


const props = withDefaults(defineProps<{
  data: UnpaidWarga[]
  loading: boolean
  loadingSendNotif: boolean
  hasMore: boolean
}>(), {})

const emit = defineEmits<{
  (e: 'loadMore'): void
  (e: 'showBuktiBayar', item: Pembayaran): void;
  (e: 'sendNotif', item: UnpaidWarga): void
}>()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'Judul Iuran', key: 'judul_iuran', width: '250px' },
  { label: 'Jenis', key: 'jenis_iuran', width: '150px', align: 'center' },
  { label: 'Tgl. Buat', key: 'tgl_buat', width: '180px' },
  { label: 'Jumlah Iuran yang Harus Dibayar', key: 'jumlah_iuran', width: '180px' },
  { key: 'actions' },
]
</script>

<template>
  <AppDataTable
    :headers="headers"
    :items="data"
    :loading="loading"
    :has-more="false"
    no-data-text="Tidak ada data iuran"
  >

    <!-- Judul Iuran -->
    <template #cell-judul_iuran="{ item }">
      {{ item.judul_iuran }}
    </template>

    <!-- Jenis -->
    <template #cell-jenis_iuran="{ item }">
      <div class="text-capitalize">
        <VChip
          size="small"
          :color="item.jenis_iuran === 'bulanan' ? 'info' : 'error'"
        >
          {{ item.jenis_iuran }}
        </VChip>
      </div>
    </template>

    <!-- Tgl. Buat -->
    <template #cell-tgl_buat="{ item }">
      {{ formatDateID(item.created_at) }}
    </template>

    <!-- Jumlah -->
    <template #cell-jumlah_iuran="{ item }">
      {{ formatRupiah(item.jumlah_iuran) }}
    </template>

    <!-- Aksi -->
    <template #cell-actions="{ item }">
      <div class="d-flex justify-center">
        <IconBtn
          variant="outlined"
          class="rounded-lg"
          size="small"
          color="secondary"
          @click="emit('sendNotif', item)"
        >
          <VIcon icon="ri-bell-line" />
        </IconBtn>
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

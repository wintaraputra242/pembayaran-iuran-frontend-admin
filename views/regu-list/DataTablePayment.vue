<script setup lang="ts">
import type { PembayaranByRegu } from '@/types/api/pembayaran';
import qris from '@images/pages/qris.png'; // sesuaikan path


const props = defineProps<{
  data: PembayaranByRegu[]
  loading?: boolean
  hasMore?: boolean
  hasFilter?: boolean
}>()

const emit = defineEmits(['loadMore', 'showBuktiBayar'])

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
]

const bulanLabel: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
  5: 'Mei', 6: 'Jun', 7: 'Jul', 8: 'Ags',
  9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Des',
}

const statusChipsColor = {
  manual: 'success',
  paid: 'success',
  pending: 'warning',
  failed: 'error',
}

const statusText = {
  manual: 'Lunas',
  paid: 'Lunas',
  pending: 'Menunggu',
  failed: 'Gagal',
}


</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @loadMore="emit('loadMore')">
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
      <div class="text-capitalize">
        <VChip size="small" :color="statusChipsColor[item.status_bayar as keyof typeof statusChipsColor]">
          {{ statusText[item.status_bayar as keyof typeof statusText] }}
        </VChip>
      </div>
    </template>

    <!-- Petugas -->
    <template #cell-petugas="{ item }">
      <span>{{ item.processed_by ?? '-' }}</span>
    </template>

    <!-- Bukti Pembayaran -->
    <template #cell-bukti_bayar="{ item }">
      <div class="d-flex">
        <div v-ripple class="pa-2 rounded-lg cursor-pointer" @click="emit('showBuktiBayar', item)">
          <VImg v-if="item.bukti_pembayaran" :src="config.public.backendUrl + '/storage/' + item.bukti_pembayaran"
            width="50" />
          <span v-else>-</span>
        </div>
      </div>
    </template>
  </AppDataTable>
</template>

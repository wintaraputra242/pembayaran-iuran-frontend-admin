<script setup lang="ts">
const config = useRuntimeConfig()

const props = withDefaults(defineProps<{
  data: any[]
  loading: boolean
  hasMore: boolean
}>(), {
  data: () => [],
  hasMore: false,
})

const emit = defineEmits<{
  (e: 'loadMore'): void
}>()

const headers = [
  { key: 'no', label: 'No.', width: '60px' },
  { key: 'nama_warga', label: 'Nama Warga', width: '200px' },
  { key: 'judul_iuran', label: 'Iuran', width: '200px' },
  { key: 'bulan', label: 'Bulan', width: '150px' },
  { key: 'total_bayar', label: 'Total Bayar', width: '150px' },
  { key: 'metode_bayar', label: 'Metode', width: '120px' },
  { key: 'tanggal_bayar', label: 'Tgl. Bayar', width: '150px' },
  { key: 'status_bayar', label: 'Status', width: '150px' },
  { key: 'bukti_bayar', label: 'Bukti', width: '100px' },
]

const bulanLabel: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
  5: 'Mei', 6: 'Jun', 7: 'Jul', 8: 'Ags',
  9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Des',
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'warning', label: 'Menunggu' },
  approved: { color: 'success', label: 'Diterima' },
  rejected: { color: 'error', label: 'Ditolak' },
  cancelled: { color: 'secondary', label: 'Dibatalkan' },
}

const showProof = ref(false)
const selectedItem = ref<any>(null)

const handleShowBukti = (item: any) => {
  selectedItem.value = item
  showProof.value = true
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    no-data-text="Belum ada riwayat transaksi pembayaran" @load-more="emit('loadMore')">
    <!-- Nama Warga -->
    <template #cell-nama_warga="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.nama_warga }}</span>
        <span class="text-caption text-medium-emphasis">{{ item.no_hp ?? '-' }}</span>
      </div>
    </template>

    <!-- Iuran -->
    <template #cell-judul_iuran="{ item }">
      <div class="">
        <span class="font-weight-medium">{{ item.judul_iuran }}</span><br>
        <VChip size="x-small" :color="item.jenis_iuran === 'bulanan' ? 'info' : 'error'" variant="tonal"
          class="mt-1 w-fit text-capitalize">
          {{ item.jenis_iuran }}
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
      <span v-else class="text-medium-emphasis">-</span>
    </template>

    <!-- Total Bayar -->
    <template #cell-total_bayar="{ item }">
      <span class="font-weight-medium">
        {{ formatRupiah(item.total_bayar) }}
      </span>
    </template>

    <!-- Metode -->
    <template #cell-metode_bayar="{ item }">
      <span class="text-capitalize">{{ item.metode_bayar ?? '-' }}</span>
    </template>

    <!-- Tanggal -->
    <template #cell-tanggal_bayar="{ item }">
      {{ item.tanggal_bayar ? formatDateID(item.tanggal_bayar) : '-' }}
    </template>

    <!-- Status -->
    <template #cell-status_bayar="{ item }">
      <div class="">
        <VChip size="small" :color="statusConfig[item.status_bayar]?.color ?? 'secondary'" variant="tonal">
          {{ statusConfig[item.status_bayar]?.label ?? item.status_bayar }}
        </VChip><br>
        <span v-if="item.rejection_reason && (item.status_bayar === 'rejected' || item.status_bayar === 'cancelled')"
          class="text-caption text-error" style="max-width: 150px;">
          {{ item.rejection_reason }}
        </span>
      </div>
    </template>

    <!-- Bukti -->
    <template #cell-bukti_bayar="{ item }">
      <div v-if="item.bukti_pembayaran" v-ripple class="cursor-pointer d-inline-flex flex-column align-center gap-1"
        style="max-width: 70px;" @click="handleShowBukti(item)">
        <div style="position: relative; width: 54px; height: 54px;">
          <img :src="config.public.backendUrl + '/storage/' + item.bukti_pembayaran"
            style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(var(--v-theme-primary), 0.3);" />
          <div
            style="position: absolute; inset: 0; background: rgba(var(--v-theme-primary), 0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
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

  <!-- Dialog bukti pembayaran -->
  <PaymentProofImageDialog v-model="showProof" :judul-iuran="selectedItem?.judul_iuran"
    :nama-warga="selectedItem?.nama_warga" :src="selectedItem?.bukti_pembayaran
      ? config.public.backendUrl + '/storage/' + selectedItem.bukti_pembayaran
      : ''" :item="selectedItem" />
</template>

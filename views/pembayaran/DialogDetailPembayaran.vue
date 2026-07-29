<script lang="ts" setup>
const props = defineProps<{
  isShow: boolean
  pembayaranId: number | string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const config = useRuntimeConfig()
const pembayaranStore = usePembayaranStore()

const errorMessage = ref<string | null>(null)

const detail = computed(() => pembayaranStore.detailPembayaranById)
const loading = computed(() => pembayaranStore.loadingDetailPembayaranById)

const fetchDetail = async () => {
  if (!props.pembayaranId) return

  errorMessage.value = null
  pembayaranStore.detailPembayaranById = null

  try {
    await pembayaranStore.fetchDetailPembayaranById(Number(props.pembayaranId))
  } catch (e: any) {
    errorMessage.value = e?.errors ?? e?.data?.errors ?? 'Gagal memuat detail pembayaran.'
  }
}

watch(
  () => props.isShow,
  (val) => {
    if (val) fetchDetail()
  }
)

const handleClose = () => {
  pembayaranStore.detailPembayaranById = null
  errorMessage.value = null
  emit('close')
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'warning', label: 'Menunggu Validasi' },
  approved: { color: 'success', label: 'Disetujui' },
  rejected: { color: 'error', label: 'Ditolak' },
  cancelled: { color: 'secondary', label: 'Dibatalkan' },
}

const getStatusConfig = (status: string) =>
  statusConfig[status] ?? { color: 'secondary', label: status }

const monthNames = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const bulanLabel = computed(() => {
  if (!detail.value?.bulan || !Array.isArray(detail.value.bulan)) return null
  return detail.value.bulan.map((b: number) => monthNames[b]).join(', ')
})

const buktiPembayaranUrl = computed(() => {
  if (!detail.value?.bukti_pembayaran) return null
  return config.public.backendUrl + '/storage/' + detail.value.bukti_pembayaran
})
</script>

<template>
  <VDialog :model-value="isShow" max-width="520" @update:model-value="handleClose">
    <VCard rounded="lg">
      <VCardTitle class="pa-4 d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-2">
          <VIcon icon="ri-file-list-3-line" />
          Detail Pembayaran
        </div>
        <IconBtn variant="text" size="small" @click="handleClose">
          <VIcon icon="ri-close-line" />
        </IconBtn>
      </VCardTitle>

      <VDivider />

      <VCardText class="pa-4">
        <div v-if="loading" class="d-flex justify-center py-8">
          <VProgressCircular indeterminate color="primary" />
        </div>

        <VAlert v-else-if="errorMessage" type="error" density="compact">
          {{ errorMessage }}
        </VAlert>

        <div v-else-if="detail">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h3 class="mb-0">{{ detail.nama_warga }}</h3>
              <span class="text-body-2 text-medium-emphasis">NIK: {{ detail.nik }}</span>
            </div>
            <VChip :color="getStatusConfig(detail.status_bayar).color" size="small" label>
              {{ getStatusConfig(detail.status_bayar).label }}
            </VChip>
          </div>

          <VTable density="compact" class="mb-4">
            <tbody>
              <tr>
                <td class="text-medium-emphasis">Regu</td>
                <td class="font-weight-medium">{{ detail.regu }}</td>
              </tr>
              <tr>
                <td class="text-medium-emphasis">No. HP</td>
                <td class="font-weight-medium">{{ detail.no_hp }}</td>
              </tr>
              <tr>
                <td class="text-medium-emphasis">Judul Iuran</td>
                <td class="font-weight-medium">{{ detail.judul_iuran }}</td>
              </tr>
              <tr>
                <td class="text-medium-emphasis">Jenis Iuran</td>
                <td class="font-weight-medium text-capitalize">{{ detail.jenis_iuran }}</td>
              </tr>
              <tr v-if="bulanLabel">
                <td class="text-medium-emphasis">Bulan</td>
                <td class="font-weight-medium">{{ bulanLabel }}</td>
              </tr>
              <tr>
                <td class="text-medium-emphasis">Total Bayar</td>
                <td class="font-weight-medium">
                  Rp {{ Number(detail.total_bayar).toLocaleString('id-ID') }}
                </td>
              </tr>
              <tr>
                <td class="text-medium-emphasis">Metode Bayar</td>
                <td class="font-weight-medium text-uppercase">{{ detail.metode_bayar }}</td>
              </tr>
              <tr>
                <td class="text-medium-emphasis">Tanggal Bayar</td>
                <td class="font-weight-medium">{{ detail.tanggal_bayar }}</td>
              </tr>
              <tr v-if="detail.processed_by">
                <td class="text-medium-emphasis">Diproses Oleh</td>
                <td class="font-weight-medium">{{ detail.processed_by }}</td>
              </tr>
              <tr v-if="detail.rejection_reason">
                <td class="text-medium-emphasis">Alasan Ditolak</td>
                <td class="font-weight-medium text-error">{{ detail.rejection_reason }}</td>
              </tr>
              <tr v-if="detail.note">
                <td class="text-medium-emphasis">Catatan</td>
                <td class="font-weight-medium">{{ detail.note }}</td>
              </tr>
            </tbody>
          </VTable>

          <div v-if="buktiPembayaranUrl">
            <p class="text-body-2 font-weight-medium mb-2">Bukti Pembayaran</p>
            <VImg :src="buktiPembayaranUrl" class="rounded-lg border" max-height="300" style="object-fit: contain;" />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="pa-4 d-flex justify-end">
        <VBtn variant="tonal" color="secondary" @click="handleClose">
          Tutup
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

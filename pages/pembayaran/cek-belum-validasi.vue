<script setup lang="ts">
import type { Pembayaran } from '@/types/api/pembayaran'
import DataTable from '@/views/cek-belum-validasi/DataTable.vue'

const config = useRuntimeConfig()
const pembayaranStore = usePembayaranStore()

// ── State ─────────────────────────────────────────────────────────
const showPaymentProof = ref(false)
const showRejectDialog = ref(false)
const showConfirmation = ref(false)
const showSuccessConfirm = ref(false)
const isLoadingConfirm = ref(false)
const isLoadingValidasi = ref(false)
const rejectReason = ref('')
const successMessage = ref('')
const itemSelected = ref<Pembayaran | null>(null)

const confirmOptions = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Batal',
  confirmColor: 'success',
  confirmIcon: '',
})

// ── Fetch data pending ────────────────────────────────────────────
onMounted(async () => {
  await pembayaranStore.fetchPendingPembayaran()
})

// ── Handler Bukti ─────────────────────────────────────────────────
const handleShowBuktiBayar = (item: Pembayaran) => {
  itemSelected.value = item
  showPaymentProof.value = true
}

// ── Handler Approve ───────────────────────────────────────────────
const handleApprove = (item: Pembayaran) => {
  itemSelected.value = item
  confirmOptions.value = {
    title: 'Setujui Pembayaran',
    message: `Setujui pembayaran iuran dari warga atas nama ${item.warga.nama_warga}?`,
    confirmText: 'Setujui',
    cancelText: 'Batal',
    confirmColor: 'success',
    confirmIcon: 'ri-check-line',
  }
  showConfirmation.value = true
}

const handleConfirmApprove = async () => {
  if (!itemSelected.value) return
  isLoadingConfirm.value = true

  try {
    await pembayaranStore.fetchApprovePembayaran(itemSelected.value.id)
    showConfirmation.value = false
    showSuccessConfirm.value = true
    successMessage.value = `Pembayaran dari ${itemSelected.value.warga.nama_warga} berhasil disetujui.`
    await pembayaranStore.fetchPendingPembayaran()
  } finally {
    isLoadingConfirm.value = false
  }
}

// ── Handler Reject ────────────────────────────────────────────────
const handleReject = (item: Pembayaran) => {
  itemSelected.value = item
  rejectReason.value = ''
  showRejectDialog.value = true
}

const handleConfirmReject = async () => {
  if (!itemSelected.value || !rejectReason.value) return
  isLoadingValidasi.value = true

  try {
    await pembayaranStore.fetchRejectPembayaran(itemSelected.value.id, rejectReason.value)
    showRejectDialog.value = false
    showSuccessConfirm.value = true
    successMessage.value = `Pembayaran dari ${itemSelected.value.warga.nama_warga} berhasil ditolak.`
    await pembayaranStore.fetchPendingPembayaran()
  } finally {
    isLoadingValidasi.value = false
  }
}

// ── Load More ─────────────────────────────────────────────────────
const handleLoadMore = async () => {
  await pembayaranStore.fetchPendingPembayaran({
    page: (pembayaranStore.page ?? 0) + 1,
  })
}

</script>

<template>
  <div>
    <VBtn class="px-0 py-1 mb-3" variant="text" size="large" to="/pembayaran">
      <VIcon icon="ri-arrow-left-s-line" class="me-2" />
      Keluar
    </VBtn>

    <!-- Header -->
    <div class="mb-3">
      <h2>Validasi Pembayaran</h2>
      <span class="text-body-2">
        Daftar pembayaran iuran yang dikirimkan warga dan belum divalidasi.
      </span>
    </div>

    <VRow class="match-height">

      <!-- Badge total pending -->
      <VCol cols="12">
        <VAlert v-if="!pembayaranStore.loading && pembayaranStore.pendingPembayaran.length > 0" type="warning"
          variant="tonal" class="mb-2">
          <template #prepend>
            <VIcon icon="ri-error-warning-line" />
          </template>
          Terdapat <strong>{{ pembayaranStore.meta?.total ?? 0 }}</strong> pembayaran yang menunggu validasi.
        </VAlert>

        <VAlert v-else-if="!pembayaranStore.loading && pembayaranStore.pendingPembayaran.length === 0" type="success"
          variant="tonal">
          <template #prepend>
            <VIcon icon="ri-checkbox-circle-line" />
          </template>
          Semua pembayaran sudah tervalidasi.
        </VAlert>
      </VCol>

      <!-- Table -->
      <VCol cols="12">
        <DataTable :data="pembayaranStore.pendingPembayaran" :meta="pembayaranStore.meta"
          :loading="pembayaranStore.loading" :has-more="pembayaranStore.hasMore"
          @show-bukti-bayar="handleShowBuktiBayar" @approve="handleApprove" @reject="handleReject"
          @load-more="handleLoadMore" />
      </VCol>

    </VRow>

    <!-- Dialog Bukti Bayar -->
    <PaymentProofImageDialog v-model="showPaymentProof" :judul-iuran="itemSelected?.informasi_iuran.judul_iuran"
      :nama-warga="itemSelected?.warga.nama_warga"
      :src="config.public.backendUrl + '/storage/' + itemSelected?.bukti_pembayaran"
      :item="(itemSelected as Pembayaran)" />

    <!-- Dialog Konfirmasi Approve -->
    <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm" @confirm="handleConfirmApprove" />

    <!-- Dialog Reject -->
    <VDialog v-model="showRejectDialog" max-width="450">
      <VCard>
        <VCardItem>
          <VCardTitle class="mb-1">Tolak Pembayaran</VCardTitle>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Pembayaran iuran dari warga atas nama
            <strong>{{ itemSelected?.warga.nama_warga }}</strong>
          </p>

          <VTextarea v-model="rejectReason" label="Alasan Penolakan" placeholder="Masukkan alasan penolakan..." rows="3"
            auto-grow />

          <div class="d-flex gap-2 justify-end mt-4">
            <VBtn variant="text" @click="showRejectDialog = false">
              Batal
            </VBtn>
            <VBtn color="error" variant="flat" :loading="isLoadingValidasi" :disabled="!rejectReason"
              @click="handleConfirmReject">
              <VIcon icon="ri-close-line" class="me-1" />
              Tolak Pembayaran
            </VBtn>
          </div>
        </VCardItem>
      </VCard>
    </VDialog>

    <!-- Success Dialog -->
    <SuccessDialog v-model="showSuccessConfirm" title="Berhasil" :message="successMessage" />

  </div>
</template>

<script setup lang="ts">
import type { AddInformasiIuranPayload } from '@/types/api/master-informasi-iuran';
import type { Pembayaran } from '@/types/api/pembayaran';
import DataTableDashboard from '@/views/dashboard-new/DataTable.vue';
import DialogFormDataInformasiIuran from '@/views/informasi-iuran/DialogFormData.vue';
import DialogShowNote from '@/views/pembayaran/DialogShowNote.vue';

definePageMeta({ onlyAdmin: true })

const config = useRuntimeConfig()

const uiStore = useUiStore()
const dashboardStore = useDashboardStore()
const dropdownStore = useDropdownStore()
const pembayaranStore = usePembayaranStore()
const router = useRouter()
const masterInformasiIuranStore = useMasterInformasiIuranStore()

const selectedType = ref<'notifikasi' | 'pembayaran' | 'warga_belum_bayar' | 'activity_log'>('warga_belum_bayar')

const tableData = computed(() => {
  switch (selectedType.value) {
    case 'notifikasi': return dashboardStore.notifications
    case 'pembayaran': return dashboardStore.payments
    case 'warga_belum_bayar': return dashboardStore.unpaidResidents
    case 'activity_log': return dashboardStore.activityLogs
    default: return []
  }
})

const handleFilter = async (type: typeof selectedType.value) => {
  selectedType.value = type
  await dashboardStore.fetchDashboard(type)
}

const persentaseBayar = computed(() => {
  if (!dashboardStore.totalWarga) return 0
  return Math.round((dashboardStore.sudahBayarBulanIni / dashboardStore.totalWarga) * 100)
})

const showConfirmation = ref(false)
const showRejectDialog = ref(false)
const isLoadingConfirm = ref(false)
const isLoadingValidasi = ref(false)
const rejectReason = ref('')
const itemSelected = ref<Pembayaran | null>(null)

const confirmOptions = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Batal',
  confirmColor: 'success',
  confirmIcon: '',
})

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

const handleReject = (item: Pembayaran) => {
  itemSelected.value = item
  rejectReason.value = ''
  showRejectDialog.value = true
}


const handleConfirmApprove = async () => {
  if (!itemSelected.value) return
  isLoadingConfirm.value = true

  try {
    await pembayaranStore.fetchApprovePembayaran(itemSelected.value.id)
    showConfirmation.value = false
    uiStore.showSuccess(`Pembayaran dari ${itemSelected.value.warga.nama_warga} berhasil disetujui.`)
    await dashboardStore.fetchDashboard('pembayaran')
  } finally {
    isLoadingConfirm.value = false
  }
}

const handleConfirmReject = async () => {
  if (!itemSelected.value || !rejectReason.value) return
  isLoadingValidasi.value = true

  try {
    await pembayaranStore.fetchRejectPembayaran(itemSelected.value.id, rejectReason.value)
    showRejectDialog.value = false
    uiStore.showSuccess(`Pembayaran dari ${itemSelected.value.warga.nama_warga} berhasil ditolak.`)
    await dashboardStore.fetchDashboard('pembayaran')
  } finally {
    isLoadingValidasi.value = false
  }
}

const showFormIuran = ref(false)
const isFetchSuccess = ref(false)

const handleAddIuran = async (params: AddInformasiIuranPayload) => {
  isFetchSuccess.value = false

  const res = await masterInformasiIuranStore.fetchAddInformasiIuran(params)

  if (res.success) {
    showFormIuran.value = false
    isFetchSuccess.value = true
    uiStore.showSuccess(res.message)

    // Refresh stat cards dashboard
    await dashboardStore.fetchDashboard(selectedType.value)
  }
}

const filterOptions = [
  { label: 'Notifikasi', value: 'notifikasi', icon: 'ri-notification-line' },
  { label: 'Pembayaran', value: 'pembayaran', icon: 'ri-cash-line' },
  { label: 'Belum Bayar', value: 'warga_belum_bayar', icon: 'ri-user-unfollow-line' },
  { label: 'Log Aktivitas', value: 'activity_log', icon: 'ri-history-line' },
]

const formatRupiahLocal = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const getFontSizeClass = (value: number) => {
  const length = formatRupiah(value).length
  if (length > 16) return 'text-caption'      // misal Rp 100.000.000 ke atas
  if (length > 12) return 'text-body-2'       // misal Rp 10.000.000 - 99.999.999
  return 'text-body-1'                        // di bawah 10 juta
}

const goToCreatePembayaran = () => {
  sessionStorage.setItem('pembayaran_referrer', '/dashboard')
  router.push({ path: '/create-pembayaran', query: { from: 'dashboard' } }) // sesuaikan path aslinya
}

const goToLaporan = () => {
  sessionStorage.setItem('laporan_referrer', '/dashboard')
  router.push('/laporan')
}

const showPaymentProof = ref(false)

const handleShowBuktiBayar = (item: Pembayaran) => {
  itemSelected.value = item
  showPaymentProof.value = true
}

const showRejectionReason = ref(false)

const handleShowRejectionReason = (item: Pembayaran) => {
  itemSelected.value = item
  showRejectionReason.value = true
}

onMounted(async () => {
  const fromPath = useCookie('from-path')
  if (uiStore.isLoading && fromPath.value === '/login') {
    uiStore.endLoading()
    fromPath.value = null
  }

  // Load dengan default warga belum bayar
  await dashboardStore.fetchDashboard('warga_belum_bayar')
  await dropdownStore.fetchWargaForDropdown()
})
</script>

<template>
  <div>
    <!-- Page Title -->
    <div class="mb-5">
      <h2 class="font-weight-bold">Dashboard</h2>
      <span class="text-body-2 text-medium-emphasis">
        Selamat datang — berikut ringkasan kondisi iuran banjar hari ini.
      </span>
    </div>

    <VRow>
      <!-- STAT CARD: Warga Belum Bayar — paling penting, ukuran besar -->
      <VCol cols="12">
        <VCard color="error" variant="tonal" rounded="lg" class="pa-4 pa-md-5 cursor-pointer"
          @click="handleFilter('warga_belum_bayar')">
          <div class="d-flex flex-column flex-md-row align-md-center ga-4">
            <!-- Kiri: ikon + angka -->
            <div class="d-flex align-center ga-3 flex-shrink-0">
              <VAvatar color="error" size="52" variant="tonal">
                <VIcon icon="ri-user-unfollow-line" size="26" />
              </VAvatar>
              <div>
                <p class="text-caption font-weight-bold text-error mb-1 text-uppercase">
                  Belum Bayar Bulan {{ dashboardStore.namaBulan }}
                </p>
                <p class="text-h4 font-weight-black text-error mb-0">
                  {{ dashboardStore.belumBayarBulanIni }}
                  <span class="text-body-1 font-weight-medium">warga</span>
                </p>
              </div>
            </div>

            <VDivider vertical class="d-none d-md-block" style="min-height: 48px;" />
            <VDivider class="d-md-none" />

            <!-- Kanan: progress bar, mengisi sisa lebar di desktop -->
            <div class="flex-grow-1" style="min-width: 0;">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption text-medium-emphasis">Tingkat kepatuhan</span>
                <span class="text-caption font-weight-bold text-error">{{ persentaseBayar }}%</span>
              </div>
              <VProgressLinear :model-value="persentaseBayar" color="error" bg-color="error" bg-opacity="0.15" rounded
                height="6" />
              <p class="text-caption text-medium-emphasis mt-1 mb-0">
                {{ dashboardStore.sudahBayarBulanIni }} dari {{ dashboardStore.totalWarga }} warga sudah membayar
              </p>
            </div>
          </div>
        </VCard>
      </VCol>

      <!-- STAT CARDS: 2 kolom di mobile, 4 kolom mulai tablet/desktop -->
      <VCol cols="6" md="3">
        <VCard rounded="lg" class="h-100" style="border-top: 3px solid rgb(var(--v-theme-primary));">
          <VCardText class="pa-4">
            <div class="d-flex align-center justify-space-between mb-3">
              <VAvatar color="primary" size="36" variant="tonal">
                <VIcon icon="ri-group-line" size="18" />
              </VAvatar>
              <span class="text-h5 font-weight-black text-primary">
                {{ dashboardStore.totalWarga }}
              </span>
            </div>
            <p class="text-body-2 font-weight-medium mb-0">Total Warga</p>
            <p class="text-caption text-medium-emphasis mb-0">KK terdaftar</p>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="6" md="3">
        <VCard rounded="lg" class="h-100" style="border-top: 3px solid rgb(var(--v-theme-success));">
          <VCardText class="pa-4">
            <div class="d-flex align-center justify-space-between mb-3">
              <VAvatar color="success" size="36" variant="tonal">
                <VIcon icon="ri-money-dollar-circle-line" size="18" />
              </VAvatar>
              <span class="font-weight-black text-success text-end text-truncate"
                :class="getFontSizeClass(dashboardStore.totalPembayaranHariIni)" style="max-width: 75%;">
                {{ formatRupiahLocal(dashboardStore.totalPembayaranHariIni) }}
              </span>
            </div>
            <p class="text-body-2 font-weight-medium mb-0">Bayar Hari Ini</p>
            <p class="text-caption text-medium-emphasis mb-0">total masuk</p>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="6" md="3">
        <VCard rounded="lg" class="h-100 cursor-pointer" style="border-top: 3px solid rgb(var(--v-theme-warning));"
          @click="handleFilter('pembayaran')">
          <VCardText class="pa-4">
            <div class="d-flex align-center justify-space-between mb-3">
              <VAvatar color="warning" size="36" variant="tonal">
                <VIcon icon="ri-time-line" size="18" />
              </VAvatar>
              <span class="text-h5 font-weight-black text-warning">
                {{ dashboardStore.pembayaranMenunggu }}
              </span>
            </div>
            <p class="text-body-2 font-weight-medium mb-0">Menunggu Validasi</p>
            <p class="text-caption text-medium-emphasis mb-0">pembayaran pending</p>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="6" md="3">
        <VCard rounded="lg" class="h-100" style="border-top: 3px solid rgb(var(--v-theme-info));">
          <VCardText class="pa-4">
            <div class="d-flex align-center justify-space-between mb-3">
              <VAvatar color="info" size="36" variant="tonal">
                <VIcon icon="ri-heart-pulse-line" size="18" />
              </VAvatar>
              <span class="text-h5 font-weight-black text-info">
                {{ dashboardStore.iuranKematianAktif }}
              </span>
            </div>
            <p class="text-body-2 font-weight-medium mb-0">Iuran Kematian</p>
            <p class="text-caption text-medium-emphasis mb-0">sedang berjalan</p>
          </VCardText>
        </VCard>
      </VCol>

      <!-- SHORTCUT AKSI CEPAT -->
      <!-- AKSI CEPAT — grid 2x3 rata -->
      <VCol cols="12">
        <p class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-2">
          Aksi Cepat
        </p>
        <VRow dense class="quick-action-row">
          <VCol cols="6" sm="4" md="2">
            <VBtn color="primary" variant="flat" size="small" rounded="lg" prepend-icon="ri-add-circle-line"
              class="quick-action-btn" @click="goToCreatePembayaran">
              Tambah Pembayaran
            </VBtn>
          </VCol>
          <VCol cols="6" sm="4" md="2">
            <VBtn color="error" variant="flat" size="small" rounded="lg" prepend-icon="ri-user-unfollow-line"
              class="quick-action-btn" @click="router.push('/pembayaran/cek-belum-bayar')">
              Siapa Belum Bayar
            </VBtn>
          </VCol>
          <VCol cols="6" sm="4" md="2">
            <VBtn color="warning" variant="flat" size="small" rounded="lg" prepend-icon="ri-time-line"
              class="quick-action-btn" @click="router.push('/pembayaran/cek-belum-validasi')">
              Validasi Pembayaran
            </VBtn>
          </VCol>
          <VCol cols="6" sm="4" md="2">
            <VBtn color="secondary" variant="flat" size="small" rounded="lg" prepend-icon="ri-file-chart-line"
              class="quick-action-btn" @click="goToLaporan">
              Lihat Laporan
            </VBtn>
          </VCol>
          <VCol cols="6" sm="4" md="2">
            <VBtn color="info" variant="flat" size="small" rounded="lg" prepend-icon="ri-file-add-line"
              class="quick-action-btn" @click="showFormIuran = true">
              Tambah Iuran
            </VBtn>
          </VCol>
          <VCol cols="6" sm="4" md="2">
            <VBtn color="primary" variant="flat" size="small" rounded="lg" prepend-icon="ri-notification-line"
              class="quick-action-btn" @click="router.push('/notifications')">
              Notifikasi
            </VBtn>
          </VCol>
        </VRow>
      </VCol>

      <!-- TABEL DATA — update DataTableDashboard untuk belum bayar -->
      <VCol cols="12">
        <VCard rounded="lg">
          <VCardItem class="pb-0">
            <div class="d-flex align-center justify-space-between flex-wrap gap-2">
              <VCardTitle class="text-body-1 font-weight-bold">
                <span v-if="selectedType === 'warga_belum_bayar'">
                  Belum Bayar
                </span>
                <span v-else-if="selectedType === 'pembayaran'">Pembayaran Terbaru</span>
                <span v-else-if="selectedType === 'notifikasi'">Notifikasi</span>
                <span v-else>Log Aktivitas</span>
              </VCardTitle>
            </div>

            <!-- Filter tab — lebih rapi -->
            <div class="d-flex flex-wrap gap-2 mt-3">
              <VChip v-for="f in filterOptions" :key="f.value" :color="selectedType === f.value ? 'primary' : 'default'"
                :variant="selectedType === f.value ? 'flat' : 'tonal'" size="small" :prepend-icon="f.icon"
                class="cursor-pointer" @click="handleFilter(f.value)">
                {{ f.label }}
              </VChip>
            </div>
          </VCardItem>

          <VCardText class="pt-5">
            <DataTableDashboard :type="selectedType" :data="tableData" :loading="dashboardStore.loading"
              :has-filter="false" @approve="handleApprove" @reject="handleReject"
              @cancel="pembayaranStore.openCancelDialog" @show-rejection-reason="handleShowRejectionReason"
              @show-bukti-bayar="handleShowBuktiBayar" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <PaymentProofImageDialog v-model="showPaymentProof" :judul-iuran="itemSelected?.informasi_iuran.judul_iuran"
      :nama-warga="itemSelected?.warga.nama_warga"
      :src="config.public.backendUrl + '/storage/' + itemSelected?.bukti_pembayaran"
      :item="(itemSelected as Pembayaran)" />

    <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm" @confirm="handleConfirmApprove" />

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

    <!-- Dialog Batalkan Pembayaran -->
    <VDialog v-model="pembayaranStore.cancelDialog" max-width="480">
      <VCard rounded="lg">
        <VCardTitle class="pa-4 d-flex align-center gap-2">
          <VIcon icon="ri-close-circle-line" color="error" />
          Batalkan Pembayaran
        </VCardTitle>
        <VDivider />
        <VCardText class="pa-4">
          <p class="text-body-2 mb-3">
            Anda akan membatalkan pembayaran atas nama
            <strong>{{ pembayaranStore.itemToCancel?.warga?.nama_warga }}</strong>.
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <VTextarea v-model="pembayaranStore.cancelReason" label="Alasan Pembatalan"
            placeholder="Masukkan alasan pembatalan..." variant="outlined" rows="3" auto-grow />
        </VCardText>
        <VDivider />
        <VCardText class="pa-4">
          <div class="d-flex justify-end gap-2">
            <VBtn variant="tonal" color="secondary" :disabled="pembayaranStore.isLoadingCancel"
              @click="pembayaranStore.closeCancelDialog">
              Batal
            </VBtn>
            <VBtn variant="flat" color="error" :loading="pembayaranStore.isLoadingCancel"
              :disabled="!pembayaranStore.cancelReason.trim()" @click="pembayaranStore.submitCancel('dashboard')">
              <VIcon icon="ri-close-circle-line" class="me-1" />
              Batalkan Pembayaran
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <DialogFormDataInformasiIuran :is-show="showFormIuran" :is-edit="false" :loading="masterInformasiIuranStore.loading"
      :is-fetch-success="isFetchSuccess" :item-dropdown-warga="dropdownStore.itemWargaForDropdown"
      :loading-dropdown-warga="dropdownStore.loading.wargaForDropdown" @close="showFormIuran = false"
      @submit="handleAddIuran" />

    <DialogShowNote v-model="showRejectionReason" :item="itemSelected" />
  </div>
</template>

<style scoped>
/* Supaya label tombol Aksi Cepat tidak terpotong di layar sempit — dibiarkan turun 2 baris.
   Tinggi tombol kiri & kanan dalam satu baris disamakan lewat align-items: stretch di bawah,
   lalu tombolnya sendiri diberi height: 100% supaya ikut mengisi & teksnya tetap center. */
.quick-action-btn :deep(.v-btn__content) {
  white-space: normal;
  line-height: 1.2;
  text-align: center;
}

.quick-action-btn {
  width: 100%;
  height: 100% !important;
  min-height: 40px;
  padding-block: 8px;
}

/* VRow bawaan Vuetify pakai align-items: center (bukan stretch), jadi kolom kiri-kanan
   tidak otomatis sama tinggi. Di-override khusus untuk grid Aksi Cepat ini. */
.quick-action-row {
  align-items: stretch !important;
}

.quick-action-row > :deep(.v-col) {
  display: flex;
}
</style>

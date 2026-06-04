<script setup lang="ts">
import type { Pembayaran } from '@/types/api/pembayaran'
import DataTablePembayaran from '@/views/pembayaran/DataTable.vue'
import DialogFormDataPembayaran from '@/views/pembayaran/DialogFormData.vue'
import DialogHistoryPaymentWargaPembayaran from '@/views/pembayaran/DialogHistoryPaymentWarga.vue'
import DialogNoPaymentPembayaran from '@/views/pembayaran/DialogNoPayment.vue'
import DialogShowNote from '@/views/pembayaran/DialogShowNote.vue'
import FormFilterPembayaran from '@/views/pembayaran/FormFilter.vue'

definePageMeta({ onlyAdmin: true })

const config = useRuntimeConfig()

const pembayaranStore = usePembayaranStore()
const dropdownStore = useDropdownStore()
const router = useRouter()

const page = ref(1)

const showFormData = ref(false)
const isEdit = ref(false)
const itemSelected = ref<Pembayaran | null>(null)

const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)

const confirmOptions = reactive({
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
})

const showPaymentProof = ref(false)
const showHistoryPayment = ref(false)
const showNoPaymentList = ref(false)

const showSuccessConfirm = ref(false)
const successTitle = ref('')
const successMessage = ref('')

const fromDialog = ref('')

const handleCloseFormData = () => {
  isEdit.value = false
  showFormData.value = false
}

const handleCloseShowHistoryPaymentWarga = () => {
  fromDialog.value = ''
  showHistoryPayment.value = false
}

async function deleteItem() {
  isLoadingConfirm.value = true
  await new Promise(res => setTimeout(res, 1000))
  isLoadingConfirm.value = false
  showConfirmation.value = false
}

const handleDeleteData = (item: Pembayaran) => {
  confirmOptions.title = 'Hapus Data?'
  confirmOptions.message =
    'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'
  confirmOptions.confirmText = 'Hapus'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-delete-bin-line'

  itemSelected.value = item
  showConfirmation.value = true
}

const handleResetAllAnggota = () => {
  confirmOptions.title = 'Reset Semua Anggota?'
  confirmOptions.message =
    'Apakah Anda yakin ingin me-reset semua anggota? Tindakan ini tidak dapat dibatalkan.'
  confirmOptions.confirmText = 'Reset'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-user-community-line'

  showConfirmation.value = true
}

const handleShowAnggota = (item: Pembayaran) => {
  itemSelected.value = item
}

const handleShowBuktiBayar = (item: Pembayaran) => {
  showPaymentProof.value = true
  itemSelected.value = item
}

const handleHistoryPayment = (item: Pembayaran) => {
  pembayaranStore.itemSelected = item
  itemSelected.value = item

  router.push('/pembayaran/riwayat/' + item.warga.nik)
}

const handleShowBuktiBayarHistoryPayment = () => {
  fromDialog.value = 'history'
  showHistoryPayment.value = false
  showPaymentProof.value = true
}

const handleShowNoPayment = () => {

  // showNoPaymentList.value = true
  router.push('/pembayaran/cek-belum-bayar')
}

const handleShowNoValidation = () => {

  // showNoPaymentList.value = true
  router.push('/pembayaran/cek-belum-validasi')
}

const handleSendNotif = (type?: string) => {
  fromDialog.value = type || ''
  showHistoryPayment.value = false
  showNoPaymentList.value = false

  successTitle.value = 'Kirim Notif Berhasil'
  successMessage.value = 'Notifikasi berhasil dikirim ke warga terkait pembayaran.'

  showSuccessConfirm.value = true
}

watch(showSuccessConfirm, val => {
  if (!val) {
    if (fromDialog.value === 'history') {
      showHistoryPayment.value = true
    }

    if (fromDialog.value === 'no-payment') {
      showNoPaymentList.value = true
    }

    fromDialog.value = ''
  }
})

watch(showPaymentProof, val => {
  if (!val && fromDialog.value === 'history') {
    showHistoryPayment.value = true
    fromDialog.value = ''
  }
})

const handleFilter = (filters: {
  date: [string, string] | string | null
  jenis_iuran: string | null
  metode_bayar: string | null
  status_bayar: string | null
  regu: string | null
  nama_warga: string | null
}) => {
  page.value = 1
  pembayaranStore.reload = true

  // console.log(filters)

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // khusus untuk date, ubah ke start_date & end_date
      if (key === 'date' && Array.isArray(value)) {
        // console.log(value)
        if (!value) {
          pembayaranStore.setFilter('start_date', '')
          pembayaranStore.setFilter('end_date', '')
          return
        }
        pembayaranStore.setFilter('start_date', formatDateToYMD(value[0] as any))
        pembayaranStore.setFilter('end_date', formatDateToYMD(value[1] as any))
      } else if (key !== 'date') {
        // sisanya langsung di-set sesuai key di store
        const mapping: Record<string, keyof typeof pembayaranStore.filters> = {
          nama_warga: 'nama_warga',
          regu: 'regu',
          jenis_iuran: 'jenis_iuran',
          metode_bayar: 'metode_bayar',
          status_bayar: 'status_bayar',
        }

        if (mapping[key]) {
          pembayaranStore.setFilter(mapping[key], String(value))
        }
      }
    }
  })

  const nonNullFilters = []

  Object.values(filters).forEach((val) => {
    if (val) nonNullFilters.push(val)
  })

  if (nonNullFilters.length === 0) pembayaranStore.resetFilter()

  // panggil fetch setelah set semua filter
  pembayaranStore.fetchPembayaran({ limit: 10, page: page.value })
}

const handleReload = () => {
  page.value = 1
  pembayaranStore.reload = true
  pembayaranStore.resetFilter()
  pembayaranStore.fetchPembayaran({ limit: 10, page: page.value })
}

const handleLoadMore = async () => {
  page.value += 1
  await pembayaranStore.fetchPembayaran({ limit: 10, page: page.value })
}

const handleGetDropdownRegu = async () => {
  await dropdownStore.fetchReguForDropdown()
}

const showRejectionReason = ref(false)

const handleShowRejectionReason = (item: Pembayaran) => {
  itemSelected.value = item
  showRejectionReason.value = true
}

onMounted(async () => {
  const authStore = useAuthStore()
  if (!authStore.token) return

  if (pembayaranStore.needsReload) {
    pembayaranStore.needsReload = false
    pembayaranStore.pembayaran = []
    await pembayaranStore.fetchPembayaran({ limit: 10, page: 1 })
    page.value = 1
    return
  }

  if (pembayaranStore.page) page.value = pembayaranStore.page

  if (pembayaranStore.page === 0) {
    await pembayaranStore.fetchPembayaran({ limit: 10, page: page.value })
  }

  handleGetDropdownRegu()
})

onBeforeRouteLeave(() => {
  const authStore = useAuthStore()
  if (!authStore.token) return
  pembayaranStore.needsReload = true  // ✅ set flag saja
})
</script>


<template>
  <div>
    <div class="mb-3">
      <h2>Pembayaran</h2>
      <span class="text-body-2">Catat dan kelola transaksi pembayaran iuran yang dilakukan oleh warga.</span>
    </div>

    <VRow class="match-height">
      <VCol cols="12">
        <div>
          <FormFilterPembayaran :regu-options="dropdownStore.reguForDropdown"
            :loading-regu-options="dropdownStore.loading.reguForDropdown"
            @show-form-data="router.push('/create-pembayaran')" @filter="handleFilter" @reload="handleReload"
            @reset-all-anggota="handleResetAllAnggota" @show-no-payment="handleShowNoPayment"
            @show-no-validation="handleShowNoValidation" />
        </div>
      </VCol>

      <VCol cols="12">
        <DataTablePembayaran :data="pembayaranStore.pembayaran" :meta="pembayaranStore.meta"
          :loading="pembayaranStore.loading" :has-more="pembayaranStore.hasMore" :has-filter="pembayaranStore.hasFilter"
          @delete="handleDeleteData" @show-anggota="handleShowAnggota" @show-bukti-bayar="handleShowBuktiBayar"
          @show-history-payment="handleHistoryPayment" @send-notif="handleSendNotif" @load-more="handleLoadMore"
          @show-rejection-reason="handleShowRejectionReason" />
      </VCol>
    </VRow>

    <DialogFormDataPembayaran :is-show="showFormData" :is-edit="isEdit" :item="itemSelected"
      @close="handleCloseFormData" />

    <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm" @confirm="deleteItem" />

    <PaymentProofImageDialog v-model="showPaymentProof" :judul-iuran="itemSelected?.informasi_iuran.judul_iuran"
      :nama-warga="itemSelected?.warga.nama_warga"
      :src="config.public.backendUrl + '/storage/' + itemSelected?.bukti_pembayaran"
      :item="(itemSelected as Pembayaran)" />

    <DialogHistoryPaymentWargaPembayaran :is-show="showHistoryPayment" @close="handleCloseShowHistoryPaymentWarga"
      @show-bukti-bayar="handleShowBuktiBayarHistoryPayment" @send-notif="handleSendNotif" />

    <DialogNoPaymentPembayaran :is-show="showNoPaymentList" @close="showNoPaymentList = false"
      @send-notif="handleSendNotif" />

    <SuccessDialog v-model="showSuccessConfirm" :title="successTitle" :message="successMessage" />

    <DialogShowNote v-model="showRejectionReason" :item="itemSelected" />
  </div>
</template>

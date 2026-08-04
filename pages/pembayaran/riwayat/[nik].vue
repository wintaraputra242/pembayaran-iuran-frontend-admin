<script setup lang="ts">
import type { InformasiIuranForDropdown } from '@/types/api/dropdown'
import type { Pembayaran } from '@/types/api/pembayaran'
import DataTableRiwayat from '@/views/riwayat-pembayaran/DataTable.vue'
import DataTableBelumBayarRiwayat from '@/views/riwayat-pembayaran/DataTableBelumBayar.vue'
import DialogFormDataRiwayat from '@/views/riwayat-pembayaran/DialogFormData.vue'
import DialogHistoryPaymentWargaRiwayat from '@/views/riwayat-pembayaran/DialogHistoryPaymentWarga.vue'
import DialogNoPaymentRiwayat from '@/views/riwayat-pembayaran/DialogNoPayment.vue'

definePageMeta({ onlyAdmin: true })

const config = useRuntimeConfig()

const router = useRouter()
const route = useRoute()

const pembayaranStore = usePembayaranStore()
const dropdownStore = useDropdownStore()

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

const handleShowAnggota = (item: Pembayaran) => {
  itemSelected.value = item
}

const handleShowBuktiBayar = (item: Pembayaran) => {
  showPaymentProof.value = true
  itemSelected.value = item
}

const handleHistoryPayment = (item: Pembayaran) => {
  itemSelected.value = item
  showHistoryPayment.value = true
}

const handleShowBuktiBayarHistoryPayment = () => {
  fromDialog.value = 'history'
  showHistoryPayment.value = false
  showPaymentProof.value = true
}

const itemSelectForSendNotif = ref<string | null>(null)

const handleSendNotif = async (item?: import('@/types/api/master-informasi-iuran').MasterInformasiIuran) => {
  console.log(item);

  const newItem = pembayaranStore.itemSelected

  try {
    await pembayaranStore.fetchNotifyResident({
      id_informasi_iuran: Number(item?.id),
      nik: newItem?.warga.nik as string,
      month: filters.bulan as number
    })

    successTitle.value = 'Kirim Notif Berhasil'
    successMessage.value =
      'Notifikasi berhasil dikirim ke warga terkait pembayaran.'

    showSuccessConfirm.value = true
  } catch (error) {
    console.error(error)
  }
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

const handleLoadMoreHistoryPaid = async () => {
  page.value += 1
  await pembayaranStore.fetchHistoryPaid({ limit: 10, page: page.value })
}

const handleLoadMoreHistoryUnpaid = async () => {
  page.value += 1
  await pembayaranStore.fetchHistoryUnpaid({ limit: 10, page: page.value })
}

const filters = reactive<{
  informasi_iuran: InformasiIuranForDropdown | null
  bulan: number | null
  nama_warga: string | null
}>({
  informasi_iuran: null,
  bulan: null,
  nama_warga: null
})

const bulanOptions = [
  { label: 'Januari', value: 1 },
  { label: 'Februari', value: 2 },
  { label: 'Maret', value: 3 },
  { label: 'April', value: 4 },
  { label: 'Mei', value: 5 },
  { label: 'Juni', value: 6 },
  { label: 'Juli', value: 7 },
  { label: 'Agustus', value: 8 },
  { label: 'September', value: 9 },
  { label: 'Oktober', value: 10 },
  { label: 'November', value: 11 },
  { label: 'Desember', value: 12 },
]

const hasFilterUnpaidWarga = ref(false)

watch(() => filters.informasi_iuran, async (val: any) => {
  if (!val || !filters.bulan) {
    filters.nama_warga = null
    pembayaranStore.unpaidWarga = []
  }

  if (val.jenis_iuran === 'kematian') {
    filters.bulan = null
    pembayaranStore.setFilter('bulan', 0)
  }

  if ((val && val.jenis_iuran === 'kematian') || filters.bulan) {
    hasFilterUnpaidWarga.value = true

    pembayaranStore.setFilter('idInformasiIuran', val.id)
    pembayaranStore.setFilter('bulan', filters.bulan as number)

    page.value = 1

    pembayaranStore.isReloadDataUnpaidWarga = true

    await pembayaranStore.fetchUnpaidPembayaran({ limit: 10, page: page.value })

    return
  }

  pembayaranStore.setFilter('idInformasiIuran', 0)

  hasFilterUnpaidWarga.value = false
})

const handleGetDropdownInformasiIuran = async () => {
  await dropdownStore.fetchInformasiIuranForDropdown()
}

watch(() => filters.bulan, async (val) => {
  if (!val) {
    filters.nama_warga = null
    pembayaranStore.unpaidWarga = []
  }

  if (val) {
    hasFilterUnpaidWarga.value = true

    pembayaranStore.setFilter('idInformasiIuran', filters.informasi_iuran?.id as number)
    pembayaranStore.setFilter('bulan', val)

    page.value = 1

    pembayaranStore.isReloadDataUnpaidWarga = true

    await pembayaranStore.fetchUnpaidPembayaran({ limit: 10, page: page.value })
    return
  }

  pembayaranStore.setFilter('idInformasiIuran', 0)
  pembayaranStore.setFilter('bulan', 0)
  pembayaranStore.setFilter('namaWarga', '')

  hasFilterUnpaidWarga.value = false
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => filters.nama_warga,
  (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      pembayaranStore.isReloadDataUnpaidWarga = true
      pembayaranStore.setFilter('namaWarga', val as string)
      pembayaranStore.fetchUnpaidPembayaran({ page: 1, limit: 10 })
    }, 500) // delay 500ms setelah berhenti mengetik
  }
)

const handleSendNotifToAll = async () => {
  try {
    if ('nik' in route.params) {
      await pembayaranStore.fetchNotifyResidentAllUnpaid(route.params.nik)

      successTitle.value = 'Kirim Notif Berhasil'
      successMessage.value =
        'Notifikasi terkait seluruh pembayaran dari warga, berhasil dikirim.'

      showSuccessConfirm.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

const tab = ref('history')

watch(tab, async (val) => {
  if (val === 'history') {
    pembayaranStore.historyPaid = []
    page.value = 1
    if ('nik' in route.params) pembayaranStore.setFilter('nikWarga', route.params.nik)
    await pembayaranStore.fetchHistoryPaid({ page: page.value, limit: 10 })
  }

  if (val === 'no-payment') {
    pembayaranStore.historyUnpaid = []
    page.value = 1
    if ('nik' in route.params) pembayaranStore.setFilter('nikWarga', route.params.nik)
    await pembayaranStore.fetchHistoryUnpaid({ page: page.value, limit: 10 })
  }
})

const handleGetData = async () => {
  pembayaranStore.historyPaid = []
  if ('nik' in route.params) pembayaranStore.setFilter('nikWarga', route.params.nik)
  await pembayaranStore.fetchHistoryPaid({ page: 1, limit: 10 })
}

onMounted(() => {
  handleGetData()

  if (!pembayaranStore.itemSelected && ('nik' in route.params)) {
    pembayaranStore.fetchDetailPembayaran(route.params.nik)
  }
})
</script>


<template>
  <div>
    <VBtn class="px-0 py-1 mb-3" variant="text" size="large" to="/pembayaran">
      <VIcon icon="ri-arrow-left-s-line" class="me-2" />
      Kembali
    </VBtn>

    <div class="mb-3">
      <h2>Riwayat Pembayaran</h2>
      <span v-if="!pembayaranStore.loadingDetail" class="text-body-2">Nama: {{
        pembayaranStore.itemSelected?.warga.nama_warga || '-' }}</span>
    </div>

    <div v-if="pembayaranStore.loadingDetail" class="text-center py-4">
      <VProgressCircular indeterminate size="26" />
    </div>

    <VRow v-else class="match-height">
      <VCol cols="12">
        <VTabs v-model="tab" color="primary">
          <VTab value="history">Riwayat</VTab>
          <VTab value="no-payment">Belum Bayar</VTab>
        </VTabs>

        <VDivider />

        <VTabsWindow v-model="tab" class="mt-5 pt-5">

          <!-- ================= HISTORY ================= -->
          <VTabsWindowItem value="history">
            <DataTableRiwayat :data="pembayaranStore.historyPaid" :loading="pembayaranStore.loading"
              :has-more="pembayaranStore.hasMoreHistoryPaid" @load-more="handleLoadMoreHistoryPaid"
              @show-bukti-bayar="handleShowBuktiBayar" />
          </VTabsWindowItem>

          <!-- ================= BELUM BAYAR ================= -->
          <VTabsWindowItem value="no-payment">
            <div v-if="pembayaranStore.historyUnpaid.length > 0" class="mb-3">
              <VBtn variant="flat" color="info" :loading="pembayaranStore.loadingSendNotifToAll"
                @click="handleSendNotifToAll">
                <VIcon icon="ri-bell-line" class="me-2" />
                Kirim Semua Notif
              </VBtn>
            </div>

            <DataTableBelumBayarRiwayat :data="pembayaranStore.historyUnpaid" :loading="pembayaranStore.loading"
              :loading-send-notif="pembayaranStore.loadingSendNotif" :has-more="pembayaranStore.hasMoreUnpaidWarga"
              @send-notif="handleSendNotif" @load-more="handleLoadMoreHistoryUnpaid" />
          </VTabsWindowItem>
        </VTabsWindow>
      </VCol>
    </VRow>

    <DialogFormDataRiwayat :is-show="showFormData" :is-edit="isEdit" :item="itemSelected"
      @close="handleCloseFormData" />

    <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm" @confirm="deleteItem" />

    <PaymentProofImageDialog v-model="showPaymentProof" :judul-iuran="itemSelected?.informasi_iuran.judul_iuran"
      :src="config.public.backendUrl + '/storage/' + itemSelected?.bukti_pembayaran"
      :item="(itemSelected as Pembayaran)" />

    <DialogHistoryPaymentWargaRiwayat :is-show="showHistoryPayment" @close="handleCloseShowHistoryPaymentWarga"
      @show-bukti-bayar="handleShowBuktiBayarHistoryPayment" @send-notif="handleSendNotif" />

    <DialogNoPaymentRiwayat :is-show="showNoPaymentList" @close="showNoPaymentList = false"
      @send-notif="handleSendNotif" />

    <SuccessDialog v-model="showSuccessConfirm" :title="successTitle" :message="successMessage" />
  </div>
</template>

<style scoped>
.custom-tabs :deep(.v-tab--selected) {
  background-color: white !important;
  border-radius: 5px;
}
</style>

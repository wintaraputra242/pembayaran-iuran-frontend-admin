<script setup lang="ts">
import type { InformasiIuranForDropdown } from '@/types/api/dropdown'
import type { Pembayaran, UnpaidWarga } from '@/types/api/pembayaran'
import DataTableCekBelumBayar from '@/views/cek-belum-bayar/DataTable.vue'
import DialogFormDataCekBelumBayar from '@/views/cek-belum-bayar/DialogFormData.vue'
import DialogHistoryPaymentWargaCekBelumBayar from '@/views/cek-belum-bayar/DialogHistoryPaymentWarga.vue'
import DialogNoPaymentCekBelumBayar from '@/views/cek-belum-bayar/DialogNoPayment.vue'
import eCommerce2 from '@images/eCommerce/2.png'

definePageMeta({
  middleware: ['admin'],
})

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

const handleSendNotif = async (item?: UnpaidWarga) => {
  if (!item) return

  itemSelectForSendNotif.value = item.nik

  try {
    await pembayaranStore.fetchNotifyResident({
      nik: item.nik,
      title: 'Pengingat Pembayaran Iuran',
      message: `Halo ${item.nama_warga}, mohon segera melakukan pembayaran iuran.`,
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

const handleLoadMore = async () => {
  page.value += 1
  await pembayaranStore.fetchUnpaidPembayaran({ limit: 10, page: page.value })
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
  if (!pembayaranStore.idInformasiIuran) return

  try {
    await pembayaranStore.fetchNotifyUnpaid({
      id_informasi_iuran: pembayaranStore.idInformasiIuran,
      month: pembayaranStore.bulan || undefined,
    })

    successTitle.value = 'Kirim Notif Berhasil'
    successMessage.value =
      'Notifikasi berhasil dikirim ke semua warga yang belum membayar.'

    showSuccessConfirm.value = true
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  handleGetDropdownInformasiIuran()
})
</script>


<template>
  <div>
    <VBtn class="px-0 py-1 mb-3" variant="text" size="large" to="/pembayaran">
      <VIcon icon="ri-arrow-left-s-line" class="me-2" />
      Keluar
    </VBtn>

    <h2 class="mb-3">Cek Belum Bayar</h2>

    <VRow class="match-height">
      <VCol cols="12">
        <VCard>
          <VCardItem>
            <VAutocomplete
              v-model="filters.informasi_iuran"
              placeholder="Pilih informasi iuran"
              :items="dropdownStore.itemInformasiIuranForDropdown"
              return-object
              item-title="judul_iuran"
              item-value="id"
              clearable
              class="mb-3"
              :loading="dropdownStore.loading.informasiIuranForDropdown"
              @click:clear="filters.bulan = null" 
            />

            <VSelect
              v-if="filters.informasi_iuran?.jenis_iuran === 'bulanan'"
              v-model="filters.bulan"
              placeholder="Pilih Bulan"
              :items="bulanOptions"
              item-title="label"
              item-value="value"
              clearable
              class="mb-3"
              :loading="dropdownStore.loading.informasiIuranForDropdown"
            />
            
            <VTextField
              v-if="pembayaranStore.unpaidWarga.length > 0 || filters.nama_warga"
              v-model="filters.nama_warga"
              placeholder="Cari Nama Warga"
              clearable
              class="mb-3"
            />

            <VBtn v-if="pembayaranStore.unpaidWarga.length > 0" type="submit" variant="flat" color="primary" :loading="pembayaranStore.loadingSendNotifToAll" @click="handleSendNotifToAll">
              <VIcon icon="ri-send-plane-fill" class="me-2" />
              Kirim Notif ke Semua Warga
            </VBtn>
          </VCardItem>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <DataTableCekBelumBayar
        :data="pembayaranStore.unpaidWarga"
        :loading="pembayaranStore.loading"
        :loading-send-notif="pembayaranStore.loadingSendNotif"
        :has-more="pembayaranStore.hasMoreUnpaidWarga"
        :has-filter="hasFilterUnpaidWarga"
        :jml-iuran="filters.informasi_iuran?.jumlah_iuran"
        :nik-notif-sended="itemSelectForSendNotif"
        @send-notif="handleSendNotif"
        @load-more="handleLoadMore"
      />
      </VCol>
    </VRow>

    <DialogFormDataCekBelumBayar
      :is-show="showFormData"
      :is-edit="isEdit"
      :item="itemSelected"
      @close="handleCloseFormData"
    />

    <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm"
      @confirm="deleteItem"
    />

    <PaymentProofImageDialog
      v-model="showPaymentProof"
      :src="eCommerce2"
      :item="(itemSelected as Pembayaran)"
    />

    <DialogHistoryPaymentWargaCekBelumBayar
      :is-show="showHistoryPayment"
      @close="handleCloseShowHistoryPaymentWarga"
      @show-bukti-bayar="handleShowBuktiBayarHistoryPayment"
      @send-notif="handleSendNotif"
    />

    <DialogNoPaymentCekBelumBayar
      :is-show="showNoPaymentList"
      @close="showNoPaymentList = false"
      @send-notif="handleSendNotif"
    />

    <SuccessDialog
      v-model="showSuccessConfirm"
      :title="successTitle"
      :message="successMessage"
    />
  </div>
</template>


<script setup lang="ts">
import type { InformasiIuranForDropdown } from '@/types/api/dropdown'
import type { Pembayaran, UnpaidWarga } from '@/types/api/pembayaran'
import DataTableCekBelumBayar from '@/views/cek-belum-bayar/DataTable.vue'
import DialogFormDataCekBelumBayar from '@/views/cek-belum-bayar/DialogFormData.vue'
import DialogHistoryPaymentWargaCekBelumBayar from '@/views/cek-belum-bayar/DialogHistoryPaymentWarga.vue'
import DialogNoPaymentCekBelumBayar from '@/views/cek-belum-bayar/DialogNoPayment.vue'
import eCommerce2 from '@images/eCommerce/2.png'
import { useDisplay } from 'vuetify'

definePageMeta({ onlyAdmin: true })

const pembayaranStore = usePembayaranStore()
const dropdownStore = useDropdownStore()
const router = useRouter()
const display = useDisplay()

const page = ref(1)
const limit = ref(10)

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
      id_informasi_iuran: Number(filters.informasi_iuran?.id),
      nik: item.nik,
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

const handleLoadMore = async () => {
  page.value += 1
  await pembayaranStore.fetchUnpaidPembayaran({ limit: limit.value, page: page.value })
}

// Pagination desktop (server-side) — ganti data (bukan menambahkan) sesuai halaman/jumlah baris yang dipilih.
const handleChangePage = async (newPage: number) => {
  page.value = newPage
  await pembayaranStore.fetchUnpaidPembayaran({ limit: limit.value, page: page.value, replace: true })
}

const handleChangeLimit = async (newLimit: number) => {
  limit.value = newLimit
  page.value = 1
  await pembayaranStore.fetchUnpaidPembayaran({ limit: limit.value, page: page.value, replace: true })
}

const filters = reactive<{
  informasi_iuran: InformasiIuranForDropdown | null
  bulan: number | null
  regu: ReguForDropdown | null
}>({
  informasi_iuran: null,
  bulan: null,
  regu: null
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

// Lebar kolom filter menyesuaikan jumlah field yang sedang tampil (field "Bulan" & "Regu"
// tampil kondisional), supaya baris filter selalu terisi penuh di desktop — tidak ada
// ruang kosong terbuang seperti sebelumnya saat cuma 1-2 field yang muncul.
const visibleFilterFieldCount = computed(() => {
  let count = 1 // "Pilih informasi iuran" selalu tampil

  if (filters.informasi_iuran?.jenis_iuran === 'bulanan') count++
  if (pembayaranStore.unpaidWarga.length > 0 || filters.regu) count++

  return count
})

const filterColMd = computed(() => {
  if (visibleFilterFieldCount.value <= 1) return 4
  if (visibleFilterFieldCount.value === 2) return 6

  return 4
})

watch(() => filters.informasi_iuran, async (val: any) => {
  if (!val || !filters.bulan) {
    filters.regu = null
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

    await pembayaranStore.fetchUnpaidPembayaran({ limit: limit.value, page: page.value })

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
    filters.regu = null
    pembayaranStore.unpaidWarga = []
  }

  if (val) {
    hasFilterUnpaidWarga.value = true

    pembayaranStore.setFilter('idInformasiIuran', filters.informasi_iuran?.id as number)
    pembayaranStore.setFilter('bulan', val)

    page.value = 1

    pembayaranStore.isReloadDataUnpaidWarga = true

    await pembayaranStore.fetchUnpaidPembayaran({ limit: limit.value, page: page.value })
    return
  }

  pembayaranStore.setFilter('idInformasiIuran', 0)
  pembayaranStore.setFilter('bulan', 0)
  pembayaranStore.setFilter('idRegu', '')

  hasFilterUnpaidWarga.value = false
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => filters.regu,
  (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      pembayaranStore.isReloadDataUnpaidWarga = true
      pembayaranStore.setFilter('idRegu', val?.id ?? null) // NOTE: key 'idRegu' perlu disesuaikan juga di backend
      pembayaranStore.fetchUnpaidPembayaran({ page: 1, limit: limit.value })
    }, 500)
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

const handleLeaveCreatePembayaran = () => {
  filters.informasi_iuran = null
  filters.bulan = null
  filters.regu = null

  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/pembayaran')
  }
}

onMounted(() => {
  handleGetDropdownInformasiIuran()
  dropdownStore.fetchReguForDropdown()
})
</script>


<template>
  <div>
    <VBtn class="px-0 py-1 mb-3" variant="text" size="large" @click="handleLeaveCreatePembayaran">
      <VIcon icon="ri-arrow-left-s-line" class="me-2" />
      Kembali
    </VBtn>

    <div class="mb-3">
      <h2>Cek Belum Bayar</h2>
      <span class="text-body-2">Menampilkan daftar warga yang masih memiliki kewajiban iuran yang belum
        diselesaikan.</span>
    </div>

    <VRow class="match-height">
      <VCol cols="12">
        <VCard>
          <VCardItem>
            <VRow>
              <VCol cols="12" sm="6" :md="filterColMd">
                <VAutocomplete v-model="filters.informasi_iuran" placeholder="Pilih informasi iuran"
                  :items="dropdownStore.itemInformasiIuranForDropdown" return-object item-title="judul_iuran"
                  item-value="id" clearable :loading="dropdownStore.loading.informasiIuranForDropdown"
                  @click:clear="filters.bulan = null" />
              </VCol>

              <VCol v-if="filters.informasi_iuran?.jenis_iuran === 'bulanan'" cols="12" sm="6" :md="filterColMd">
                <VSelect v-model="filters.bulan" placeholder="Pilih Bulan" :items="bulanOptions" item-title="label"
                  item-value="value" clearable :loading="dropdownStore.loading.informasiIuranForDropdown" />
              </VCol>

              <VCol v-if="pembayaranStore.unpaidWarga.length > 0 || filters.regu" cols="12" sm="6" :md="filterColMd">
                <VAutocomplete v-model="filters.regu" placeholder="Cari berdasarkan Regu"
                  :items="dropdownStore.reguForDropdown" return-object item-title="nama_regu" item-value="id" clearable
                  :loading="dropdownStore.loading.reguForDropdown" />
              </VCol>

              <VCol v-if="pembayaranStore.unpaidWarga.length > 0" cols="12" class="d-flex align-center">
                <VBtn type="submit" variant="flat" color="primary" :block="display.smAndDown.value"
                  :loading="pembayaranStore.loadingSendNotifToAll" @click="handleSendNotifToAll">
                  <VIcon icon="ri-send-plane-fill" class="me-2" />
                  Kirim Notif ke Semua Warga
                </VBtn>
              </VCol>

            </VRow>
          </VCardItem>
        </VCard>
      </VCol>

      <VCol cols="12">
        <DataTableCekBelumBayar :data="pembayaranStore.unpaidWarga" :meta="pembayaranStore.meta"
          :loading="pembayaranStore.loading" :loading-send-notif="pembayaranStore.loadingSendNotif"
          :has-more="pembayaranStore.hasMoreUnpaidWarga" :has-filter="hasFilterUnpaidWarga"
          :jml-iuran="filters.informasi_iuran?.jumlah_iuran" :nik-notif-sended="itemSelectForSendNotif"
          @send-notif="handleSendNotif" @load-more="handleLoadMore" @change-page="handleChangePage"
          @change-limit="handleChangeLimit" />
      </VCol>
    </VRow>

    <DialogFormDataCekBelumBayar :is-show="showFormData" :is-edit="isEdit" :item="itemSelected"
      @close="handleCloseFormData" />

    <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm" @confirm="deleteItem" />

    <PaymentProofImageDialog v-model="showPaymentProof" :src="eCommerce2" :item="(itemSelected as Pembayaran)" />

    <DialogHistoryPaymentWargaCekBelumBayar :is-show="showHistoryPayment" @close="handleCloseShowHistoryPaymentWarga"
      @show-bukti-bayar="handleShowBuktiBayarHistoryPayment" @send-notif="handleSendNotif" />

    <DialogNoPaymentCekBelumBayar :is-show="showNoPaymentList" @close="showNoPaymentList = false"
      @send-notif="handleSendNotif" />

    <SuccessDialog v-model="showSuccessConfirm" :title="successTitle" :message="successMessage" />
  </div>
</template>

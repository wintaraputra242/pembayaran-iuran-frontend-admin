<script setup lang="ts">
import type { MetodeBayar } from '@/types/api/pembayaran';
import FormCreatePembayaran from '@/views/create-pembayaran/FormCreatePembayaran.vue';

definePageMeta({ adminAndKetuaRegu: true })

const route = useRoute()

const pembayaranStore = usePembayaranStore()
const masterInformasiIuranStore = useMasterInformasiIuranStore()
const dropdownStore = useDropdownStore()
const uiStore = useUiStore()
const authStore = useAuthStore()

const tab = ref('kematian')

const filters = reactive({
  kematian: '',
  bulanan: '',
})

const showTakeFoto = ref(false)
const showSuccessConfirm = ref(false)

const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)

const handleCloseSuccessDialog = () => {
  showSuccessConfirm.value = false

  confirmOptions.title = 'Ingin Menambah Pembayaran?'
  confirmOptions.message = 'Apakah Anda ingin menambahkan pembayaran baru lagi di Iuran A ini?'
  confirmOptions.confirmText = 'Ya'
  confirmOptions.cancelText = 'Tidak'
  confirmOptions.confirmColor = 'primary'
  confirmOptions.confirmIcon = 'ri-check-line'

  showConfirmation.value = true
}

const confirmOptions = {
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
}

const deleteItem = () => {
  showConfirmation.value = false
}

const handleGetMonthPaid = async (nik: string | null) => {
  if ('id' in route.params && masterInformasiIuranStore.detailInformasiIuran.jenis_iuran === 'bulanan') {
    await pembayaranStore.fetchPaidMonthWarga({
      id_informasi_iuran: Number(route.params.id),
      nik: nik as string
    })
  }
}

const isClearForm = ref(false)

const fileBuktiPembayaran = ref<File>()

const paramsCreate = ref<{
  total: number | null,
  warga: string | null,
  bulan: { month: number, year: number }[] | null,
  metode_bayar: string | null
} | null>(null)

const generateBulanRange = (
  bulanParams: { month: number; year: number }[] | null
): number[] | null => {

  if (!bulanParams || bulanParams.length < 2) return null

  const [from, to] = bulanParams

  // month dari 0–11 → ubah ke 1–12
  const startMonth = from.month + 1
  const endMonth = to.month + 1

  const result: number[] = []

  for (let i = startMonth; i <= endMonth; i++) {
    result.push(i)
  }

  return result
}

const handleCreatePembayaran = async (params: {
  total: number | null,
  warga: string | null,
  bulan: { month: number, year: number }[] | null,
  metode_bayar: string | null
  bukti_pembayaran: File | null
}) => {
  isClearForm.value = false

  const informasiIuranItem = masterInformasiIuranStore.detailInformasiIuran

  // Ambil langsung array month number dari bulan yang dikirim
  const bulanArr = params.bulan && params.bulan.length > 0
    ? params.bulan.map(b => b.month)  // ✅ langsung ambil month-nya saja
    : null

  const newParams = {
    nik: params.warga as string,
    id_informasi_iuran: informasiIuranItem.id,
    tanggal_bayar: getTodayDate(),
    total_bayar: params.total as number,
    bulan: informasiIuranItem.jenis_iuran === 'kematian' ? null : bulanArr,
    metode_bayar: params.metode_bayar as MetodeBayar,
    bukti_pembayaran: params.bukti_pembayaran,
  }

  const res = await pembayaranStore.fetchAddPembayaran(newParams)

  if (!res.success) return

  uiStore.showSuccess(res.message)
  isClearForm.value = true

  if ('id' in route.params) {
    await dropdownStore.fetchWargaForPembayaran(Number(route.params.id))
  }
}


const handleCreatePembayaranTunai = async (file: File) => {
  isClearForm.value = false

  const informasiIuranItem = masterInformasiIuranStore.detailInformasiIuran

  const newParams = {
    nik: paramsCreate.value?.warga as string,
    id_informasi_iuran: informasiIuranItem.id,
    tanggal_bayar: getTodayDate(), // format: YYYY-MM-DD
    total_bayar: paramsCreate.value?.total as number,
    bulan: informasiIuranItem.jenis_iuran === 'kematian'
      ? null
      : generateBulanRange(paramsCreate.value?.bulan as any),
    metode_bayar: paramsCreate.value?.metode_bayar as MetodeBayar,
    bukti_pembayaran:
      paramsCreate.value?.metode_bayar === 'tunai'
        ? (file as File)
        : null
  }

  const res = await pembayaranStore.fetchAddPembayaran(newParams)

  if (!res.success) return

  uiStore.showSuccess(res.message)

  isClearForm.value = true

  if ('id' in route.params) {
    const idIuran = masterInformasiIuranStore.detailInformasiIuran.id  // ✅ pakai ini
    await dropdownStore.fetchWargaForPembayaran(idIuran)

    console.log('id_informasi_iuran dikirim:', masterInformasiIuranStore.detailInformasiIuran.id)
    console.log('route.params.id:', route.params.id)
  }
}

onMounted(async () => {
  if ('id' in route.params) {
    await masterInformasiIuranStore.fetchDetailInformasiIuran(route.params.id)

    const idIuran = masterInformasiIuranStore.detailInformasiIuran.id
    await dropdownStore.fetchWargaForPembayaran(idIuran)

    console.log('id_informasi_iuran dikirim:', masterInformasiIuranStore.detailInformasiIuran.id)
    console.log('route.params.id:', route.params.id)
  }
})
</script>

<template>
  <div class="mt-n5">
    <div class="mb-7">
      <VBtn class="px-0 py-1" variant="text" size="large"
        :to="'/create-pembayaran?jenis_iuran=' + masterInformasiIuranStore.detailInformasiIuran.jenis_iuran">
        <VIcon icon="ri-arrow-left-s-line" class="me-2" />
        Keluar
      </VBtn>
    </div>

    <template v-if="masterInformasiIuranStore.loading">
      <div class="d-flex justify-center w-100 mt-4">
        <VProgressCircular indeterminate size="26" />
      </div>
    </template>

    <template v-else>
      <div class="mb-4">
        <VChip size="small"
          :color="masterInformasiIuranStore.detailInformasiIuran.jenis_iuran === 'kematian' ? 'error' : 'info'"
          class="mb-1">
          {{ masterInformasiIuranStore.detailInformasiIuran.jenis_iuran === 'kematian' ? 'Kematian' : 'Bulanan' }}
        </VChip>
        <div class="mb-1">
          <h3>
            {{ masterInformasiIuranStore.detailInformasiIuran.judul_iuran }}
            <span v-if="masterInformasiIuranStore.detailInformasiIuran.jenis_iuran === 'bulanan'">
              (Periode {{ masterInformasiIuranStore.detailInformasiIuran.periode }})
            </span>
          </h3>
          <p class="text-caption ma-0">
            {{ formatDateID(masterInformasiIuranStore.detailInformasiIuran.created_at) }}
          </p>
        </div>
        <p class="text-body-1">Isi form berikut untuk membuat pembayaran baru.</p>
      </div>

      <FormCreatePembayaran :is-clear-form="isClearForm" :month-paid-warga="pembayaranStore.monthPaidPaymentWarga"
        :loading-month-paid-warga="pembayaranStore.loadingGetPaidMonthWarga"
        :item="masterInformasiIuranStore.detailInformasiIuran"
        :is-loading-dropdown-warga="dropdownStore.loading.wargaForPembayaran"
        :dropdown-warga-options="dropdownStore.itemWargaForPembayaran" :loading-submit="pembayaranStore.loading"
        @submit="handleCreatePembayaran" @get-month-paid="handleGetMonthPaid" />

      <SuccessDialog v-model="showSuccessConfirm" title="Pembayaran Berhasil"
        :message="`Pembayaran ${masterInformasiIuranStore.detailInformasiIuran.judul_iuran} berhasil ditambahkan.`"
        @close="handleCloseSuccessDialog" />

      <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
        :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
        :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
        :loading="isLoadingConfirm" @confirm="deleteItem" />
    </template>
  </div>
</template>

<script setup lang="ts">
import DataTableLaporan from '@/views/laporan/DataTable.vue'
import FormFilterLaporan from '@/views/laporan/FormFilter.vue'
import eCommerce2 from '@images/eCommerce/2.png'

definePageMeta({
  middleware: ['admin'],
})

const laporanStore = useLaporanStore()
const dropdownStore = useDropdownStore()

const page = ref(1)

const showConfirmation = ref(false)
const showSuccessConfirm = ref(false)
const showPaymentProof = ref(false)

const confirmOptions = reactive({
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
})

const exportExcel = async () => {
  await laporanStore.fetchExportExcelLaporan()

  showConfirmation.value = false
  showSuccessConfirm.value = true
}

const handleExportExcel = () => {
  // confirmOptions.title = 'Export Data?'
  // confirmOptions.message = 'Apakah Anda yakin ingin mengeksport data laporan?'
  // confirmOptions.confirmText = 'Export'
  // confirmOptions.cancelText = 'Batal'
  // confirmOptions.confirmColor = 'success'
  // confirmOptions.confirmIcon = 'ri-export-line'

  // showConfirmation.value = true

  exportExcel()
}

const handleLoadMore = async () => {
  page.value += 1
  await laporanStore.fetchLaporan({ limit: 10, page: page.value })
}

const handleFilter = async (filters: {
  date: string
  metode_bayar: string | null
  status_bayar: string | null
  jenis_iuran: string | null
  regu: string | null
  informasi_iuran: string
}) => {
  page.value = 1
  laporanStore.reload = true

  if (filters.date && Array.isArray(filters.date)) {
    laporanStore.setFilter('start_date', formatDateToYMD(filters.date[0]))
    laporanStore.setFilter('end_date', formatDateToYMD(filters.date[1]))
  } else {
    laporanStore.setFilter('start_date', '')
    laporanStore.setFilter('end_date', '')
  }

  const mapping: Record<string, keyof typeof laporanStore.filters> = {
    informasi_iuran: 'informasi_iuran',
    regu: 'regu',
    jenis_iuran: 'jenis_iuran',
    metode_bayar: 'metode_bayar',
    status_bayar: 'status_bayar',
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'date') return

    const storeKey = mapping[key]
    if (!storeKey) return

    if (value === null || value === undefined || value === '') {
      laporanStore.setFilter(storeKey, '')
    } else {
      laporanStore.setFilter(storeKey, String(value))
    }
  })

  await laporanStore.fetchLaporan({ limit: 10, page: page.value })
}

const handleReload = async () => {
  page.value = 1
  laporanStore.reload = true
  laporanStore.resetFilter()
  await laporanStore.fetchLaporan({ limit: 10, page: page.value })
}

onMounted(async () => {
  if (laporanStore.page) page.value = laporanStore.page

  if (laporanStore.page === 0) {
    await laporanStore.fetchLaporan({
      page: 1,
      limit: 10,
    })
  }

  await dropdownStore.fetchReguForDropdown()
  await dropdownStore.fetchInformasiIuranForDropdown()
})
</script>

<template>
  <div>
    <div class="mb-3">
      <h2>Laporan</h2>
      <span class="text-body-2">Menampilkan rekapitulasi dan hasil olahan data untuk kebutuhan monitoring dan evaluasi.</span>
    </div>

    <VRow class="match-height">
      <VCol cols="12">
        <FormFilterLaporan
          :informasi-iuran-options="dropdownStore.itemInformasiIuranForDropdown"
          :loading-informasi-iuran-options="dropdownStore.loading.informasiIuranForDropdown"
          :regu-options="dropdownStore.reguForDropdown"
          :loading-regu-options="dropdownStore.loading.reguForDropdown"
          :loading-export-excel="laporanStore.loadingExport"
          @filter="handleFilter"
          @reload="handleReload"
          @exportExcel="exportExcel"
        />
      </VCol>

      <VCol cols="12" md="12">
        <DataTableLaporan
          :data="laporanStore.laporan"
          :meta="laporanStore.meta"
          :loading="laporanStore.loading"
          :has-more="laporanStore.hasMore"
          :has-filter="laporanStore.hasFilter"
          @show-bukti-bayar="showPaymentProof = true"
          @load-more="handleLoadMore"
        />
      </VCol>
    </VRow>

    <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="laporanStore.loadingExport"
      @confirm=""
    />

    <PaymentProofImageDialog
      v-model="showPaymentProof"
      :src="eCommerce2"
    />

    <SuccessDialog
      v-model="showSuccessConfirm"
      title="Export Data Berhasil"
      message="File berupa Excel berhasil diunduh dan tersimpan di penyimpanan lokal Anda"
    />
  </div>
</template>

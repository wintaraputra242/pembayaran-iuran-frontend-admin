<script setup lang="ts">
import type { MasterInformasiIuran } from '@/types/api/master-informasi-iuran';
import type { AnggotaRegu } from '@/types/api/master-regu';
import type { PembayaranByRegu } from '@/types/api/pembayaran';
import DataTableAnggotaReguList from '@/views/regu-list/DataTableAnggota.vue';
import DataTableNoPaymentReguList from '@/views/regu-list/DataTableNoPayment.vue';
import DataTablePayment from '@/views/regu-list/DataTablePayment.vue';
import DialogDetailAnggotaReguList from '@/views/regu-list/DialogDetailAnggota.vue';

definePageMeta({ adminAndKetuaRegu: true })

const config = useRuntimeConfig()

const masterReguStore = useMasterReguStore()
const masterWargaStore = useMasterWargaStore()
const pembayaranStore = usePembayaranStore()
const dropdownStore = useDropdownStore()

const tab = ref('anggota')
const page = ref(1)

const filters = reactive({
  anggota: '',
  anggota_sudah_bayar: '',
  nik: null,
})

const itemSelected = ref<AnggotaRegu | null>(null)

const handleDetailAnggota = async (item: AnggotaRegu) => {
  showDetail.value = true
  itemSelected.value = item

  await masterWargaStore.fetchDetailWarga(item.nik)
}

const showDetail = ref(false)

const successTitle = ref('')
const successMessage = ref('')
const showSuccessConfirm = ref(false)

const handleSendNotif = async (item: MasterInformasiIuran) => {
  try {
    await pembayaranStore.fetchNotifyResident({
      id_informasi_iuran: Number(item.id),
      nik: String((filters.nik as any)?.nik),
      month: null
    })

    successTitle.value = 'Kirim Notif Berhasil'
    successMessage.value =
      'Notifikasi berhasil dikirim ke warga terkait pembayaran.'

    showSuccessConfirm.value = true
  } catch (error) {
    console.error(error)
  }
}

const handleLoadMoreHistoryUnpaid = async () => {
  page.value += 1
  await pembayaranStore.fetchHistoryUnpaid({ limit: 10, page: page.value })
}

watch(() => filters.nik, async (val: any) => {
  pembayaranStore.setFilter('nikWarga', val?.nik)
  pembayaranStore.isReloadDataHistoryUnpaid = true
  page.value = 1
  await pembayaranStore.fetchHistoryUnpaid({ limit: 10, page: page.value })
})

const pagePembayaran = ref(1)

watch(
  () => filters.anggota_sudah_bayar,
  useDebounceFn((val) => {
    pembayaranStore.isReloadDataPembayaranByRegu = true
    pagePembayaran.value = 1
    pembayaranStore.fetchPembayaranByRegu({ page: pagePembayaran.value, nama_warga: val })
  }, 400),
  { immediate: true }
)

const showPaymentProof = ref(false)
const itemSelectedPembayaran = ref<PembayaranByRegu | null>(null)

const handleShowBuktiBayar = (item: PembayaranByRegu) => {
  showPaymentProof.value = true
  itemSelectedPembayaran.value = item
}

const handleLoadMorePembayaran = async () => {
  pagePembayaran.value += 1
  await pembayaranStore.fetchPembayaranByRegu({ page: pagePembayaran.value })
}

onMounted(async () => {
  await masterReguStore.fetchAnggotaRegu()
  await dropdownStore.fetchAnggotaReguForDropdown()
})
</script>

<template>
  <div>
    <div class="mb-7">
      <VBtn class="px-0 py-1" variant="text" size="large" :to="'/create-pembayaran'">
        <VIcon icon="ri-arrow-left-s-line" class="me-2" />
        Keluar
      </VBtn>
    </div>

    <div class="mb-4">
      <h2>Regu Saya</h2>
      <span>Informasi terkait dengan anggota regu Anda, beserta anggota regu Anda yang belum bayar</span>
    </div>
    <VTabs v-model="tab" color="primary">
      <VTab value="anggota">Anggota</VTab>
      <VTab value="sudah_bayar">Sudah Bayar</VTab>
      <VTab value="belum_bayar">Belum Bayar</VTab>
    </VTabs>

    <VDivider></VDivider>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem value="anggota" class="px-2">
        <div class="py-3">
          <VTextField v-model="filters.anggota" placeholder="Cari anggota regu Anda"
            prepend-inner-icon="ri-search-2-line" />
        </div>
        <DataTableAnggotaReguList :data="masterReguStore.anggotaRegu" :loading="masterReguStore.loadingAnggota"
          @detail-anggota="handleDetailAnggota" />
      </VTabsWindowItem>
      <VTabsWindowItem value="sudah_bayar" class="px-2">
        <div class="py-3">
          <VTextField v-model="filters.anggota_sudah_bayar" placeholder="Cari anggota regu Anda"
            prepend-inner-icon="ri-search-2-line" clearable />
        </div>
        <DataTablePayment :data="pembayaranStore.pembayaranByRegu" :loading="pembayaranStore.loadingByRegu"
          :has-more="pembayaranStore.hasMoreByRegu" @show-bukti-bayar="handleShowBuktiBayar"
          @load-more="handleLoadMorePembayaran" />
      </VTabsWindowItem>
      <VTabsWindowItem value="belum_bayar">
        <div class="py-3">
          <VAutocomplete v-model="filters.nik" placeholder="Cari nama anggota regu yang belum bayar"
            :items="dropdownStore.anggotaReguForDropdown" return-object item-title="nama_warga" item-value="nik"
            clearable :loading="dropdownStore.loading.anggotaReguForDropdown" />
        </div>
        <DataTableNoPaymentReguList :data="pembayaranStore.historyUnpaid" :meta="pembayaranStore.metaByRegu"
          :loading="pembayaranStore.loading" :loading-send-notif="pembayaranStore.loadingSendNotif"
          :has-more="pembayaranStore.hasMoreUnpaidWarga" :has-filter="pembayaranStore.hasNikFilter"
          @send-notif="handleSendNotif" @load-more="handleLoadMoreHistoryUnpaid" />
      </VTabsWindowItem>
    </VTabsWindow>

    <DialogDetailAnggotaReguList :is-show="showDetail" :item="itemSelected" @close="showDetail = false" />

    <PaymentProofImageDialog v-model="showPaymentProof" :judul-iuran="itemSelectedPembayaran?.informasi_iuran?.nama"
      :nama-warga="itemSelectedPembayaran?.nama_warga"
      :src="config.public.backendUrl + '/storage/' + itemSelectedPembayaran?.bukti_pembayaran"
      :item="(itemSelectedPembayaran as PembayaranByRegu)" />
  </div>
</template>

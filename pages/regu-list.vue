<script setup lang="ts">
import type { AnggotaRegu } from '@/types/api/master-regu';
import DataTableAnggotaReguList from '@/views/regu-list/DataTableAnggota.vue';
import DataTableNoPaymentReguList from '@/views/regu-list/DataTableNoPayment.vue';
import DialogDetailAnggotaReguList from '@/views/regu-list/DialogDetailAnggota.vue';

definePageMeta({
  middleware: ['role']
})

const masterReguStore = useMasterReguStore()
const masterWargaStore = useMasterWargaStore()
const pembayaranStore = usePembayaranStore()
const dropdownStore = useDropdownStore()

const tab = ref('anggota')
const page = ref(1)

const filters = reactive({
  anggota: '',
  nik: null,
})

const itemSelected = ref<AnggotaRegu | null>(null)

const handleDetailAnggota = async (item: AnggotaRegu) => {
  showDetail.value = true
  itemSelected.value = item

  console.log(itemSelected.value)

  await masterWargaStore.fetchDetailWarga(item.nik)
}

const showDetail = ref(false)

const successTitle = ref('')
const successMessage = ref('')
const showSuccessConfirm = ref(false)

const handleSendNotif = async () => {
  try {
    await pembayaranStore.fetchNotifyResident({
      nik: filters.nik?.nik,
      title: 'Pengingat Pembayaran Iuran',
      message: `Halo ${filters.nik?.nama_warga}, mohon segera melakukan pembayaran iuran.`,
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

onMounted(async () => {
  await masterReguStore.fetchAnggotaRegu()
  await dropdownStore.fetchAnggotaReguForDropdown()
})
</script>

<template>
  <div>
    <div class="mb-4">
      <h2>Regu Saya</h2>
      <span>Informasi terkait dengan anggota regu Anda, beserta anggota regu Anda yang belum bayar</span>
    </div>
    <VTabs v-model="tab" color="primary">
      <VTab value="anggota">Anggota</VTab>
      <VTab value="belum_bayar">Belum Bayar</VTab>
    </VTabs>

    <VDivider></VDivider>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem value="anggota" class="px-2">
        <div class="py-3">
          <VTextField
            v-model="filters.anggota"
            placeholder="Cari anggota regu Anda"
            prepend-inner-icon="ri-search-2-line"
          />
        </div>
        <DataTableAnggotaReguList :data="masterReguStore.anggotaRegu" :loading="masterReguStore.loadingAnggota" @detail-anggota="handleDetailAnggota" />
      </VTabsWindowItem>
      <VTabsWindowItem value="belum_bayar">
        <div class="py-3">
          <VAutocomplete
            v-model="filters.nik"
            placeholder="Cari nama anggota regu yang belum bayar"
            :items="dropdownStore.anggotaReguForDropdown"
            return-object
            item-title="nama_warga"
            item-value="nik"
            clearable
            class="mb-3"
            :loading="dropdownStore.loading.anggotaReguForDropdown"
          />
        </div>
        <DataTableNoPaymentReguList 
          :data="pembayaranStore.historyUnpaid"
          :loading="pembayaranStore.loading"
          :loading-send-notif="pembayaranStore.loadingSendNotif"
          :has-more="pembayaranStore.hasMoreUnpaidWarga"
          @send-notif="handleSendNotif"
          @load-more="handleLoadMoreHistoryUnpaid"
        />
      </VTabsWindowItem>
    </VTabsWindow>

    <DialogDetailAnggotaReguList :is-show="showDetail" :item="itemSelected" @close="showDetail = false" />
  </div>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/api/useApi';
import type { AnggotaRegu } from '@/types/api/master-regu';
import DataTableAnggotaReguList from '@/views/regu-list/DataTableAnggota.vue';
import DataTableNoPaymentReguList from '@/views/regu-list/DataTableNoPayment.vue';
import DataTablePaymentByRegu from '@/views/regu-list/DataTablePayment.vue';
import DialogDetailAnggotaReguList from '@/views/regu-list/DialogDetailAnggota.vue';

definePageMeta({ onlyKetuaRegu: true })

const router = useRouter()
const masterWargaStore = useMasterWargaStore()
const masterReguStore = useMasterReguStore()
const pembayaranStore = usePembayaranStore()
const dropdownStore = useDropdownStore()
const uiStore = useUiStore()
const { api } = useApi()

// -------------------------------------------------------
// STATE
// -------------------------------------------------------
const activeTab = ref('anggota')
const showUnpaidPanel = ref(false)
const selectedRegu = ref<any>(null)
const isLoadingSendNotif = ref(false)

const filters = reactive({
  anggota: '',
  anggota_sudah_bayar: '',
  id_informasi_iuran: null as any,
  bulan: null as number | null,
})

// -------------------------------------------------------
// MOUNTED
// -------------------------------------------------------
onMounted(async () => {
  masterReguStore.reload = true

  await masterReguStore.fetchRegu({ page: 1, limit: 10 })

  const regu = masterReguStore.regu?.[0] ?? null
  selectedRegu.value = regu

  if (regu) {
    await Promise.all([
      masterReguStore.fetchAnggotaRegu(),
      pembayaranStore.fetchPembayaranByRegu({ id_regu: regu.id }),
      dropdownStore.fetchInformasiIuranForDropdown(),
    ])
  }
})

// -------------------------------------------------------
// WATCH FILTER SUDAH BAYAR
// -------------------------------------------------------
watch(() => filters.anggota_sudah_bayar, useDebounceFn(async (val) => {
  if (!selectedRegu.value) return

  // Reset dulu
  pembayaranStore.pembayaranByRegu = []
  pembayaranStore.reload = true

  await pembayaranStore.fetchPembayaranByRegu({
    id_regu: selectedRegu.value.id,
    nama_warga: val || undefined,
  })
}, 400))

// -------------------------------------------------------
// BELUM BAYAR
// -------------------------------------------------------
const handleLoadUnpaid = async () => {
  if (!selectedRegu.value || !filters.id_informasi_iuran) return

  showUnpaidPanel.value = true

  const iuranId = (filters.id_informasi_iuran as any)?.id ?? filters.id_informasi_iuran

  // Set state store sesuai nama yang benar
  pembayaranStore.idInformasiIuran = iuranId
  pembayaranStore.bulan = filters.bulan as number
  pembayaranStore.namaWarga = ''
  pembayaranStore.isReloadDataUnpaidWarga = true

  await pembayaranStore.fetchUnpaidPembayaran({ page: 1 })
}

const handleLoadMoreUnpaid = async () => {
  await pembayaranStore.fetchUnpaidPembayaran({
    page: (pembayaranStore.meta?.current_page ?? 1) + 1,
  })
}

// -------------------------------------------------------
// SUDAH BAYAR
// -------------------------------------------------------
const handleLoadMoreSudahBayar = async () => {
  if (!selectedRegu.value) return
  await pembayaranStore.fetchPembayaranByRegu({
    id_regu: selectedRegu.value.id,
    nama_warga: filters.anggota_sudah_bayar || undefined,
    page: (pembayaranStore.metaByRegu?.current_page ?? 1) + 1,
  })
}

// -------------------------------------------------------
// SEND NOTIF
// -------------------------------------------------------
const handleSendNotif = async (item: any) => {
  isLoadingSendNotif.value = true
  try {
    await api('/pembayaran/notify-resident', {
      method: 'POST',
      body: { id_informasi_iuran: pembayaranStore.idInformasiIuran, nik: item.nik },
    })
    uiStore.showSuccess('Notifikasi berhasil dikirim.')
  } catch (e) {
    // error dihandle useApi
  } finally {
    isLoadingSendNotif.value = false
  }
}

const showDetail = ref(false)

const config = useRuntimeConfig()
const showPaymentProof = ref(false)
const itemSelected = ref<any>(null)

const handleShowBuktiBayar = (item: any) => {
  itemSelected.value = item
  showPaymentProof.value = true
}

const handleDetailAnggota = async (item: AnggotaRegu) => {
  showDetail.value = true
  itemSelected.value = item

  await masterWargaStore.fetchDetailWarga(item.nik)
}

const authStore = useAuthStore()
const isKetuaRegu = computed(() => authStore.user?.role === 'ketua_regu')
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div v-if="isKetuaRegu" class="mb-3">
        <VBtn class="px-0 py-1" variant="text" size="large" to="/create-pembayaran">
          <VIcon icon="ri-arrow-left-s-line" class="me-2" />
          Kembali
        </VBtn>
      </div>
      <h2>{{ selectedRegu?.nama_regu ?? 'Regu Saya' }}</h2>
      <span class="text-body-2 text-medium-emphasis">
        Kelola dan pantau pembayaran anggota regu Anda.
      </span>
    </div>

    <!-- Loading awal -->
    <div v-if="masterReguStore.loading" class="d-flex justify-center py-6">
      <VProgressCircular indeterminate size="26" />
    </div>

    <!-- Tidak ada regu -->
    <VAlert v-else-if="!selectedRegu" type="info" variant="tonal" rounded="lg">
      Anda belum terdaftar dalam regu manapun.
    </VAlert>

    <!-- Konten -->
    <template v-else>
      <VTabs v-model="activeTab" color="primary" class="mb-4">
        <VTab value="anggota">Anggota</VTab>
        <VTab value="sudah_bayar">Sudah Bayar</VTab>
        <VTab value="belum_bayar">Belum Bayar</VTab>
      </VTabs>

      <VTabsWindow v-model="activeTab">

        <!-- TAB ANGGOTA -->
        <VTabsWindowItem value="anggota" class="pt-4">
          <div class="mb-3">
            <VTextField v-model="filters.anggota" placeholder="Cari anggota" prepend-inner-icon="ri-search-2-line"
              hide-details />
          </div>

          <DataTableAnggotaReguList :data="masterReguStore.anggotaRegu" :loading="masterReguStore.loadingAnggota"
            :keyword="filters.anggota" @detail-anggota="handleDetailAnggota" />
        </VTabsWindowItem>

        <!-- TAB SUDAH BAYAR -->
        <VTabsWindowItem value="sudah_bayar" class="pt-4">
          <div class="mb-3">
            <VTextField v-model="filters.anggota_sudah_bayar" placeholder="Cari anggota"
              prepend-inner-icon="ri-search-2-line" hide-details />
          </div>

          <DataTablePaymentByRegu :data="pembayaranStore.pembayaranByRegu" :loading="pembayaranStore.loadingByRegu"
            :has-more="!!pembayaranStore.metaByRegu?.next_page_url" @load-more="handleLoadMoreSudahBayar"
            @show-bukti-bayar="handleShowBuktiBayar" />
        </VTabsWindowItem>

        <!-- TAB BELUM BAYAR -->
        <VTabsWindowItem value="belum_bayar" class="pt-4">
          <!-- Filter -->
          <VCard class="mb-4">
            <VCardItem>
              <VRow align="center">
                <VCol cols="12" sm="6">
                  <VAutocomplete v-model="filters.id_informasi_iuran"
                    :items="dropdownStore.itemInformasiIuranForDropdown" item-title="judul_iuran" item-value="id"
                    placeholder="Pilih informasi iuran" hide-details return-object clearable />
                </VCol>
                <VCol cols="12" sm="4">
                  <VSelect v-model="filters.bulan" :items="Array.from({ length: 12 }, (_, i) => ({
                    title: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
                    value: i + 1,
                  }))" item-title="title" item-value="value" placeholder="Pilih bulan" hide-details clearable />
                </VCol>
                <VCol cols="12" sm="2">
                  <VBtn color="primary" block :loading="pembayaranStore.loadingUnpaid"
                    :disabled="!filters.id_informasi_iuran" @click="handleLoadUnpaid">
                    Cek
                  </VBtn>
                </VCol>
              </VRow>
            </VCardItem>
          </VCard>

          <!-- Tabel belum bayar -->
          <DataTableNoPaymentReguList v-if="showUnpaidPanel" :data="pembayaranStore.unpaidWarga"
            :loading="pembayaranStore.loading" :loading-send-notif="isLoadingSendNotif"
            :has-more="!!pembayaranStore.meta?.next_page_url" :has-filter="showUnpaidPanel"
            @load-more="handleLoadMoreUnpaid" @send-notif="handleSendNotif" />

          <div v-else class="text-center py-6 text-medium-emphasis">
            <VIcon icon="ri-search-line" size="32" class="mb-2 d-block mx-auto" />
            <p class="ma-0">Pilih informasi iuran dan klik Cek.</p>
          </div>
        </VTabsWindowItem>

      </VTabsWindow>
    </template>

    <PaymentProofImageDialog v-model="showPaymentProof" :judul-iuran="itemSelected?.informasi_iuran?.nama"
      :nama-warga="itemSelected?.nama_warga"
      :src="config.public.backendUrl + '/storage/' + itemSelected?.bukti_pembayaran" :item="itemSelected" />

    <DialogDetailAnggotaReguList :is-show="showDetail" :item="itemSelected" @close="showDetail = false" />
  </div>
</template>

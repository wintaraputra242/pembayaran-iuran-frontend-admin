<script setup lang="ts">
const dropdownStore = useDropdownStore()
const laporanStore = useLaporanStore()
const uiStore = useUiStore()
const router = useRouter()

const jenisIuran = ref<'bulanan' | 'kematian'>('bulanan')

const informasiIuranBulananOptions = computed(() =>
  dropdownStore.itemInformasiIuranForDropdown?.filter(i => i.jenis_iuran === 'bulanan') ?? [],
)

const selectedIuranId = ref<number | null>(null)

const selectedIuran = computed(() =>
  informasiIuranBulananOptions.value.find(i => i.id === selectedIuranId.value) ?? null,
)

const dateRange = ref<[string, string] | string>('')

const showBackButton = ref(false)

onMounted(() => {
  dropdownStore.fetchInformasiIuranForDropdown()

  // Cek apakah masuk dari dashboard
  const referrer = sessionStorage.getItem('laporan_referrer')
  if (referrer === '/dashboard')
    showBackButton.value = true

  // Hapus supaya tidak "nempel" kalau nanti user reload/navigasi lain dari sidebar
  sessionStorage.removeItem('laporan_referrer')
})

watch(jenisIuran, () => {
  selectedIuranId.value = null
  dateRange.value = ''
})

const handleBack = () => {
  router.push('/dashboard')
}

const handleExportPdf = async () => {
  if (jenisIuran.value === 'bulanan') {
    if (!selectedIuranId.value) {
      uiStore.showError('Pilih informasi iuran terlebih dahulu.')

      return
    }

    await laporanStore.fetchExportPdfLaporan({ id_informasi_iuran: selectedIuranId.value })
    uiStore.showSuccess('Laporan PDF berhasil diunduh.')

    return
  }

  // Kematian: laporan berdasarkan rentang tanggal, bukan per informasi iuran
  if (!Array.isArray(dateRange.value) || !dateRange.value[0] || !dateRange.value[1]) {
    uiStore.showError('Pilih rentang tanggal terlebih dahulu.')

    return
  }

  await laporanStore.fetchExportPdfLaporan({
    jenis_iuran: 'kematian',
    start_date: formatDateToYMD(dateRange.value[0] as any),
    end_date: formatDateToYMD(dateRange.value[1] as any),
  })
  uiStore.showSuccess('Laporan PDF berhasil diunduh.')
}
</script>

<template>
  <div>
    <!-- Tombol Back -->
    <div
      v-if="showBackButton"
      class="mb-3"
    >
      <VBtn
        class="px-0 py-1"
        variant="text"
        size="large"
        @click="handleBack"
      >
        <VIcon
          icon="ri-arrow-left-s-line"
          class="me-2"
        />
        Kembali
      </VBtn>
    </div>

    <!-- Header -->
    <div class="mb-3">
      <h2>Laporan</h2>
      <span class="text-body-2">
        Export laporan pembayaran iuran dalam format PDF.
      </span>
    </div>

    <VRow justify="center">
      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardText class="pa-5">
            <!-- Icon & judul -->
            <div class="d-flex flex-column align-center text-center mb-5">
              <VAvatar
                size="56"
                color="primary"
                variant="tonal"
                class="mb-3"
              >
                <VIcon
                  icon="ri-file-pdf-2-line"
                  size="28"
                />
              </VAvatar>
              <h3 class="text-h6">
                Export Laporan PDF
              </h3>
              <p class="text-body-2 text-medium-emphasis mt-1">
                Pilih jenis iuran yang ingin diekspor, lalu klik tombol download.
              </p>
            </div>

            <VDivider class="mb-5" />

            <!-- Form -->
            <VRow>
              <!-- Pilih jenis iuran -->
              <VCol cols="12">
                <VRow dense>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VBtn
                      block
                      :variant="jenisIuran === 'bulanan' ? 'flat' : 'outlined'"
                      :color="jenisIuran === 'bulanan' ? 'primary' : 'secondary'"
                      @click="jenisIuran = 'bulanan'"
                    >
                      <VIcon
                        icon="ri-calendar-check-line"
                        class="me-2"
                      />
                      Iuran Bulanan
                    </VBtn>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VBtn
                      block
                      :variant="jenisIuran === 'kematian' ? 'flat' : 'outlined'"
                      :color="jenisIuran === 'kematian' ? 'primary' : 'secondary'"
                      @click="jenisIuran = 'kematian'"
                    >
                      <VIcon
                        icon="ri-heart-pulse-line"
                        class="me-2"
                      />
                      Iuran Kematian
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>

              <!-- Bulanan: pilih informasi iuran spesifik -->
              <template v-if="jenisIuran === 'bulanan'">
                <VCol cols="12">
                  <VSelect
                    v-model="selectedIuranId"
                    :items="informasiIuranBulananOptions"
                    :loading="dropdownStore.loading.informasiIuranForDropdown"
                    item-title="judul_iuran"
                    item-value="id"
                    label="Informasi Iuran"
                    placeholder="Pilih informasi iuran..."
                    clearable
                  />
                </VCol>

                <!-- Preview info iuran terpilih -->
                <VCol
                  v-if="selectedIuran"
                  cols="12"
                >
                  <div
                    class="rounded-lg pa-3"
                    style="background: rgba(var(--v-theme-primary), 0.06); border: 1px dashed rgba(var(--v-theme-primary), 0.3);"
                  >
                    <div class="d-flex flex-column gap-1">
                      <div class="d-flex align-center gap-2">
                        <VIcon
                          icon="ri-price-tag-3-line"
                          size="14"
                          color="primary"
                        />
                        <span class="text-body-2 text-medium-emphasis">Judul</span>
                        <span class="text-body-2 font-weight-medium ms-auto">{{ selectedIuran.judul_iuran }}</span>
                      </div>
                      <div class="d-flex align-center gap-2">
                        <VIcon
                          icon="ri-layout-grid-line"
                          size="14"
                          color="primary"
                        />
                        <span class="text-body-2 text-medium-emphasis">Jenis</span>
                        <VChip
                          size="x-small"
                          color="info"
                          class="ms-auto"
                        >
                          Bulanan
                        </VChip>
                      </div>
                      <div class="d-flex align-center gap-2">
                        <VIcon
                          icon="ri-money-rupee-circle-line"
                          size="14"
                          color="primary"
                        />
                        <span class="text-body-2 text-medium-emphasis">Jumlah Iuran</span>
                        <span class="text-body-2 font-weight-medium ms-auto">
                          Rp {{ Number(selectedIuran.jumlah_iuran ?? 0).toLocaleString('id-ID') }}
                        </span>
                      </div>
                      <div
                        v-if="(selectedIuran as any).periode"
                        class="d-flex align-center gap-2"
                      >
                        <VIcon
                          icon="ri-calendar-line"
                          size="14"
                          color="primary"
                        />
                        <span class="text-body-2 text-medium-emphasis">Periode</span>
                        <span class="text-body-2 font-weight-medium ms-auto">{{ (selectedIuran as any).periode
                        }}</span>
                      </div>
                    </div>
                  </div>
                </VCol>
              </template>

              <!-- Kematian: pilih rentang tanggal, seluruh iuran kematian di rentang itu ikut -->
              <template v-else>
                <VCol cols="12">
                  <DatePicker
                    v-model="dateRange"
                    label="Rentang Tanggal"
                    placeholder="Pilih rentang tanggal"
                    range
                    :enable-time="false"
                  />
                </VCol>

                <VCol cols="12">
                  <VAlert
                    type="info"
                    variant="tonal"
                    density="compact"
                    rounded="lg"
                  >
                    Laporan akan berisi seluruh iuran kematian yang terjadi dalam rentang tanggal yang dipilih,
                    tidak dipisah per informasi iuran.
                  </VAlert>
                </VCol>
              </template>

              <!-- Tombol export -->
              <VCol cols="12">
                <VBtn
                  block
                  variant="flat"
                  color="primary"
                  :loading="laporanStore.loadingExport"
                  :disabled="jenisIuran === 'bulanan' ? !selectedIuranId : !dateRange"
                  prepend-icon="ri-download-2-line"
                  @click="handleExportPdf"
                >
                  Download PDF
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

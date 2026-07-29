<script setup lang="ts">
const dropdownStore = useDropdownStore()
const laporanStore = useLaporanStore()
const uiStore = useUiStore()

const selectedIuranId = ref<number | null>(null)
const selectedIuran = computed(() =>
  dropdownStore.itemInformasiIuranForDropdown?.find(i => i.id === selectedIuranId.value) ?? null
)

onMounted(() => {
  dropdownStore.fetchInformasiIuranForDropdown()
})

const handleExportPdf = async () => {
  if (!selectedIuranId.value) {
    uiStore.showError('Pilih informasi iuran terlebih dahulu.')
    return
  }
  await laporanStore.fetchExportPdfLaporan(selectedIuranId.value)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-3">
      <h2>Laporan</h2>
      <span class="text-body-2">
        Export laporan pembayaran iuran dalam format PDF berdasarkan informasi iuran yang dipilih.
      </span>
    </div>

    <VRow justify="center">
      <VCol cols="12" md="6">
        <VCard>
          <VCardText class="pa-5">

            <!-- Icon & judul -->
            <div class="d-flex flex-column align-center text-center mb-5">
              <VAvatar size="56" color="primary" variant="tonal" class="mb-3">
                <VIcon icon="ri-file-pdf-2-line" size="28" />
              </VAvatar>
              <h3 class="text-h6">Export Laporan PDF</h3>
              <p class="text-body-2 text-medium-emphasis mt-1">
                Pilih informasi iuran yang ingin diekspor, lalu klik tombol download.
              </p>
            </div>

            <VDivider class="mb-5" />

            <!-- Form -->
            <VRow>
              <VCol cols="12">
                <VSelect v-model="selectedIuranId" :items="dropdownStore.itemInformasiIuranForDropdown"
                  :loading="dropdownStore.loading.informasiIuranForDropdown" item-title="judul_iuran" item-value="id"
                  label="Informasi Iuran" placeholder="Pilih informasi iuran..." clearable />
              </VCol>

              <!-- Preview info iuran terpilih -->
              <VCol v-if="selectedIuran" cols="12">
                <div class="rounded-lg pa-3"
                  style="background: rgba(var(--v-theme-primary), 0.06); border: 1px dashed rgba(var(--v-theme-primary), 0.3);">
                  <div class="d-flex flex-column gap-1">
                    <div class="d-flex align-center gap-2">
                      <VIcon icon="ri-price-tag-3-line" size="14" color="primary" />
                      <span class="text-body-2 text-medium-emphasis">Judul</span>
                      <span class="text-body-2 font-weight-medium ms-auto">{{ selectedIuran.judul_iuran }}</span>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VIcon icon="ri-layout-grid-line" size="14" color="primary" />
                      <span class="text-body-2 text-medium-emphasis">Jenis</span>
                      <VChip size="x-small" :color="selectedIuran.jenis_iuran === 'bulanan' ? 'info' : 'warning'"
                        class="ms-auto">
                        {{ selectedIuran.jenis_iuran === 'bulanan' ? 'Bulanan' : 'Kematian' }}
                      </VChip>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VIcon icon="ri-money-rupee-circle-line" size="14" color="primary" />
                      <span class="text-body-2 text-medium-emphasis">Jumlah Iuran</span>
                      <span class="text-body-2 font-weight-medium ms-auto">
                        Rp {{ Number(selectedIuran.jumlah_iuran ?? 0).toLocaleString('id-ID') }}
                      </span>
                    </div>
                    <div v-if="selectedIuran.jenis_iuran === 'bulanan'" class="d-flex align-center gap-2">
                      <VIcon icon="ri-calendar-line" size="14" color="primary" />
                      <span class="text-body-2 text-medium-emphasis">Periode</span>
                      <span class="text-body-2 font-weight-medium ms-auto">{{ (selectedIuran as any).periode ?? '-'
                      }}</span>
                    </div>
                  </div>
                </div>
              </VCol>

              <!-- Tombol export -->
              <VCol cols="12">
                <VBtn block variant="flat" color="primary" :loading="laporanStore.loadingExport"
                  :disabled="!selectedIuranId" prepend-icon="ri-download-2-line" @click="handleExportPdf">
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

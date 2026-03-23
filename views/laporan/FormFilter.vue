<script lang="ts" setup>
import type { InformasiIuranForDropdown, ReguForDropdown } from '@/types/api/dropdown';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay()
const showDialog = ref(false)

const laporanStore = useLaporanStore()

const emit = defineEmits<{
  (e: 'filter', item: {
    date: string
    metode_bayar: string | null
    status_bayar: string | null
    jenis_iuran: string | null
    regu: string | null
    informasi_iuran: string | null
  }): void
  (e: 'reload'): void
  (e: 'exportExcel'): void
}>()

const props = withDefaults(defineProps<{
  reguOptions: ReguForDropdown[]
  informasiIuranOptions: InformasiIuranForDropdown[]
  loadingReguOptions: boolean
  loadingInformasiIuranOptions: boolean
  loadingExportExcel: boolean
}>(), {})

const filters = reactive({
  date: '',
  metode_bayar: null as string | null,
  status_bayar: null as string | null,
  jenis_iuran: null as string | null,
  regu: null as string | null,
  informasi_iuran: null as string | null,
})

const handleReload = () => {
  filters.date = ''
  filters.metode_bayar = null
  filters.status_bayar = null
  filters.jenis_iuran = null
  filters.regu = null
  filters.informasi_iuran = null

  emit('reload')
}

const statusOptions = [
  { label: 'Lunas', value: 'paid' },
  { label: 'Belum Lunas', value: 'unpaid' },
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="emit('filter', filters); showDialog = false">
        <VRow align="center">

          <!-- DESKTOP -->
          <template v-if="!smAndDown">
            <VCol cols="12" md="4">
              <DatePicker
                v-model="filters.date"
                placeholder="Rentang tanggal bayar"
                range
                :enable-time="false"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.jenis_iuran"
                placeholder="Jenis iuran"
                item-title="label"
                item-value="value"
                clearable
                :items="[
                  {label: 'Kematian', value: 'kematian'},
                  {label: 'Bulanan', value: 'bulanan'},
                ]"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.metode_bayar"
                placeholder="Metode pembayaran"
                :items="['Tunai', 'QRIS', 'Transfer']"
                clearable
              />
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.status_bayar"
                placeholder="Status pembayaran"
                :items="statusOptions"
                item-title="label"
                item-value="value"
                clearable
              />
            </VCol>

            <VCol cols="12" md="4">
              <VAutocomplete
                v-model="filters.regu"
                placeholder="Regu"
                :loading="loadingReguOptions"
                :items="reguOptions"
                item-title="nama_regu"
                item-value="id"
                clearable
                @click:clear="filters.regu = null; laporanStore.setFilter('regu', '')"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VAutocomplete
                v-model="filters.informasi_iuran"
                placeholder="Informasi Iuran"
                :loading="loadingInformasiIuranOptions"
                :items="informasiIuranOptions"
                item-title="judul_iuran"
                item-value="id"
                clearable
                @click:clear="filters.informasi_iuran = null; laporanStore.setFilter('informasi_iuran', '')"
              />
            </VCol>
          </template>

          <!-- BUTTON -->
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">

              <VBtn
                v-if="smAndDown"
                color="primary"
                @click="showDialog = true"
              >
                <VIcon icon="ri-filter-3-line" class="me-2" />
                Filter
              </VBtn>

              <VBtn
                v-else
                type="submit"
                variant="flat"
                color="primary"
              >
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>

              <IconBtn
                variant="flat"
                color="primary"
                @click="handleReload"
              >
                <VIcon icon="ri-restart-line" />
              </IconBtn>

              <VBtn
                variant="flat"
                color="success"
                :loading="loadingExportExcel"
                @click="emit('exportExcel')"
              >
                <VIcon icon="ri-export-line" class="me-2" />
                Export Excel
              </VBtn>
            </div>
          </VCol>

        </VRow>
      </VForm>
    </VCardItem>
  </VCard>

  <!-- MOBILE FILTER -->
  <VDialog v-model="showDialog">
    <VCard>

      <VCardTitle class="pt-3 position-sticky top-0" style="background:#fff;z-index:10;">
        <div class="d-flex align-center justify-space-between">
          <h3>Filter</h3>
          <IconBtn variant="text" size="small" @click="showDialog = false">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>

      <VCardItem>
        <VForm @submit.prevent="emit('filter', filters); showDialog = false">
          <VRow>

            <VCol cols="12">
              <DatePicker
                v-model="filters.date"
                placeholder="Rentang tanggal bayar"
                range
                :enable-time="false"
              />
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="filters.jenis_iuran"
                placeholder="Jenis iuran"
                item-title="label"
                item-value="value"
                clearable
                :items="[
                  {label: 'Kematian', value: 'kematian'},
                  {label: 'Bulanan', value: 'bulanan'},
                ]"
              />
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="filters.metode_bayar"
                placeholder="Metode pembayaran"
                :items="['Tunai', 'QRIS', 'Transfer']"
                clearable
              />
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="filters.status_bayar"
                placeholder="Status pembayaran"
                :items="statusOptions"
                item-title="label"
                item-value="value"
                clearable
              />
            </VCol>

            <VCol cols="12" md="4">
              <VAutocomplete
                v-model="filters.regu"
                placeholder="Regu"
                :loading="loadingReguOptions"
                :items="reguOptions"
                item-title="nama_regu"
                item-value="id"
                clearable
                @click:clear="filters.regu = null; laporanStore.setFilter('regu', '')"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VAutocomplete
                v-model="filters.informasi_iuran"
                placeholder="Informasi Iuran"
                :loading="loadingInformasiIuranOptions"
                :items="informasiIuranOptions"
                item-title="judul_iuran"
                item-value="id"
                clearable
                @click:clear="filters.informasi_iuran = null; laporanStore.setFilter('informasi_iuran', '')"
              />
            </VCol>

            <VCol cols="12">
              <VBtn
                block
                color="primary"
                type="submit"
              >
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>
            </VCol>

          </VRow>
        </VForm>
      </VCardItem>

    </VCard>
  </VDialog>
</template>

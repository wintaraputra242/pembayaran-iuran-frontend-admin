<script lang="ts" setup>
import type { ReguForDropdown } from '@/types/api/dropdown';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay()
const showDialog = ref(false)

const pembayaranStore = usePembayaranStore()

const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'showFormData'): void;
  (e: 'showNoPayment'): void;
  (e: 'showNoValidation'): void;
  (e: 'filter', item: {
    date: [string, string] | string | null
    jenis_iuran: string | null
    metode_bayar: string | null
    status_bayar: string | null
    regu: string | null
    nama_warga: string | null
  }): void;
}>();

const props = withDefaults(defineProps<{
  reguOptions: ReguForDropdown[]
  loadingReguOptions: boolean
  initialFilters?: Record<string, any>
}>(), {
  initialFilters: () => ({}),
})

const filters = reactive({
  date: props.initialFilters?.date ?? '',
  metode_bayar: props.initialFilters?.metode_bayar ?? null,
  status_bayar: props.initialFilters?.status_bayar ?? null,
  jenis_iuran: props.initialFilters?.jenis_iuran ?? null,
  regu: props.initialFilters?.regu ?? null,
  nama_warga: props.initialFilters?.nama_warga ?? '',
})

const handleReload = () => {
  filters.date = '',
    filters.metode_bayar = null,
    filters.status_bayar = null,
    filters.jenis_iuran = null,
    filters.regu = null,
    filters.nama_warga = '',

    emit('reload')
}

// const statusOptions = [
//   { label: 'Menunggu', value: 'pending' },
//   { label: 'Menunggu Pembayaran', value: 'waiting_payment' },
//   { label: 'Lunas', value: 'paid' },
//   { label: 'Gagal', value: 'failed' },
//   { label: 'Kedaluwarsa', value: 'expired' },
//   { label: 'Dibatalkan', value: 'canceled' },
//   { label: 'Manual', value: 'manual' },
// ]

const statusOptions = [
  { label: 'Menunggu Validasi', value: 'pending' },
  { label: 'Diterima', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="emit('filter', filters); showDialog = false">
        <VRow align="center">
          <template v-if="!smAndDown">
            <VCol cols="12" sm="6">
              <DatePicker v-model="filters.date" placeholder="Rentang tanggal bayar" range :enable-time="false" />
            </VCol>

            <VCol cols="12" sm="6">
              <VSelect v-model="filters.jenis_iuran" placeholder="Jenis iuran" item-title="label" item-value="value"
                clearable :items="[
                  { label: 'Kematian', value: 'kematian' },
                  { label: 'Bulanan', value: 'bulanan' },
                ]" />
            </VCol>

            <VCol cols="12" sm="6">
              <VSelect v-model="filters.metode_bayar" placeholder="Metode pembayaran"
                :items="['Tunai', 'QRIS', 'Transfer']" clearable />
            </VCol>

            <VCol cols="12" sm="6">
              <VSelect v-model="filters.status_bayar" placeholder="Status pembayaran" :items="statusOptions"
                item-title="label" item-value="value" clearable />
            </VCol>

            <VCol cols="12" sm="6">
              <VAutocomplete v-model="filters.regu" placeholder="Regu" :loading="loadingReguOptions"
                :items="reguOptions" item-title="nama_regu" item-value="id" clearable
                @click:clear="filters.regu = null; pembayaranStore.setFilter('regu', '')" />
            </VCol>

            <VCol cols="12" sm="6">
              <VTextField v-model="filters.nama_warga" placeholder="Cari nama warga"
                prepend-inner-icon="ri-search-2-line" clearable />
            </VCol>
          </template>

          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn v-if="smAndDown" color="primary" @click="showDialog = true">
                <VIcon icon="ri-filter-3-line" class="me-2" />
                Filter
              </VBtn>

              <VBtn v-else type="submit" variant="flat" color="primary">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>

              <IconBtn variant="flat" color="primary" @click="handleReload">
                <VIcon icon="ri-restart-line" />
              </IconBtn>

              <VBtn variant="flat" color="success" @click="emit('showFormData')">
                <VIcon icon="ri-add-large-line" class="me-2" />
                Tambah Pembayaran
              </VBtn>

              <VBtn variant="flat" color="secondary" @click="emit('showNoPayment')">
                <VIcon icon="ri-list-check-2" class="me-2" />
                Cek Belum Bayar
              </VBtn>

              <VBtn variant="flat" color="secondary" @click="emit('showNoValidation')">
                <VIcon icon="ri-list-check-2" class="me-2" />
                Cek Belum Validasi
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>

  <VDialog v-model="showDialog">
    <VCard>
      <VCardTitle class="pt-3 position-sticky top-0" style="background-color: #fff !important; z-index: 10;">
        <div class="d-flex align-center justify-space-between">
          <h3>Filter</h3>
          <IconBtn variant="text" color="secondary" size="small" @click="showDialog = false">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>

      <VCardItem>
        <VForm @submit.prevent="emit('filter', filters); showDialog = false">
          <VRow align="center">
            <VCol cols="12">
              <DatePicker v-model="filters.date" placeholder="Rentang tanggal bayar" range :enable-time="false" />
            </VCol>

            <VCol cols="12">
              <VSelect v-model="filters.jenis_iuran" placeholder="Jenis iuran" item-title="label" item-value="value"
                clearable :items="[
                  { label: 'Kematian', value: 'kematian' },
                  { label: 'Bulanan', value: 'bulanan' },
                ]" />
            </VCol>

            <VCol cols="12">
              <VSelect v-model="filters.metode_bayar" placeholder="Metode pembayaran"
                :items="['Tunai', 'QRIS', 'Transfer']" clearable />
            </VCol>

            <VCol cols="12">
              <VSelect v-model="filters.status_bayar" placeholder="Status pembayaran" :items="statusOptions"
                item-title="label" item-value="value" clearable />
            </VCol>

            <VCol cols="12">
              <VAutocomplete v-model="filters.regu" placeholder="Regu" :loading="loadingReguOptions"
                :items="reguOptions" item-title="nama_regu" item-value="id" clearable
                @click:clear="filters.regu = null; pembayaranStore.setFilter('regu', '')" />
            </VCol>

            <VCol cols="12">
              <VTextField v-model="filters.nama_warga" placeholder="Cari nama warga"
                prepend-inner-icon="ri-search-2-line" clearable />
            </VCol>

            <VCol cols="12">
              <div class="d-flex flex-wrap gap-2">
                <VBtn v-if="smAndDown" block color="primary" class="mb-3" type="submit">
                  <VIcon icon="ri-search-line" class="me-2" />
                  Filter
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

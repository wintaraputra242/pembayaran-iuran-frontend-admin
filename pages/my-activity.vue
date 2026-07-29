<script setup lang="ts">
import DataTableRiwayatKetua from '@/views/activity/DataTableRiwayatKetua.vue'

definePageMeta({ adminAndKetuaRegu: true })

const pembayaranStore = usePembayaranStore()
const authStore = useAuthStore()

const isKetuaRegu = computed(() => authStore.user?.role === 'ketua_regu')

// Filter
const filters = reactive({
  nama_warga: '',
  status_bayar: '',
  tanggal: [] as any[],
})

const page = ref(1)

const fetchData = async (reset = false) => {
  if (reset) {
    page.value = 1
    // Tidak perlu reset store di sini — store yang handle berdasarkan page
  }

  const params: any = {
    page: page.value,
    per_page: 10,
    nama_warga: filters.nama_warga || undefined,
    status_bayar: filters.status_bayar || undefined,
  }

  if (filters.tanggal?.length === 2) {
    params.start_date = formatDateToYMD(filters.tanggal[0])
    params.end_date = formatDateToYMD(filters.tanggal[1])
  }

  await pembayaranStore.fetchRiwayatKetuaRegu(params)
}

const handleLoadMore = async () => {
  page.value++
  await fetchData()
}

// Debounce filter nama
watch(() => filters.nama_warga, useDebounceFn(() => fetchData(true), 400))

// Filter status & tanggal
watch(() => filters.status_bayar, () => fetchData(true))
watch(() => filters.tanggal, (val) => {
  if (val?.length === 2 || !val || val?.length === 0) fetchData(true)
}, { deep: true })

onMounted(() => fetchData(true))
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <div class="mb-3">
        <VBtn class="px-0 py-1" variant="text" size="large" to="/create-pembayaran">
          <VIcon icon="ri-arrow-left-s-line" class="me-2" />
          Kembali
        </VBtn>
      </div>
      <h2>Riwayat Transaksi</h2>
      <span class="text-body-2 text-medium-emphasis">
        Daftar pembayaran yang telah Anda proses sebagai ketua regu.
      </span>
    </div>

    <!-- Filter -->
    <VCard class="mb-4">
      <VCardItem>
        <VRow align="center">
          <VCol cols="12" sm="4">
            <VTextField v-model="filters.nama_warga" placeholder="Cari nama warga" prepend-inner-icon="ri-search-2-line"
              hide-details clearable />
          </VCol>
          <VCol cols="12" sm="4">
            <VSelect v-model="filters.status_bayar" :items="[
              { title: 'Semua Status', value: '' },
              { title: 'Menunggu', value: 'pending' },
              { title: 'Diterima', value: 'approved' },
              { title: 'Ditolak', value: 'rejected' },
              { title: 'Dibatalkan', value: 'cancelled' },
            ]" item-title="title" item-value="value" placeholder="Filter status" hide-details clearable />
          </VCol>
          <VCol cols="12" sm="4">
            <DatePicker v-model="filters.tanggal" placeholder="Filter tanggal bayar" :enable-time="false" range
              clearable />
          </VCol>
        </VRow>
      </VCardItem>
    </VCard>

    <!-- Tabel -->
    <DataTableRiwayatKetua :data="pembayaranStore.riwayatKetuaRegu" :loading="pembayaranStore.loadingRiwayatKetua"
      :has-more="!!pembayaranStore.metaRiwayatKetua?.next_page_url" @load-more="handleLoadMore" />
  </div>
</template>

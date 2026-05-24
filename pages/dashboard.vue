<script setup lang="ts">
import DataTableDashboard from '@/views/dashboard-new/DataTable.vue';
import FormFilterDashboard from '@/views/dashboard-new/FormFilter.vue';

definePageMeta({ onlyAdmin: true })

const uiStore = useUiStore()
const dashboardStore = useDashboardStore()

const selectedType = ref<'notifikasi' | 'pembayaran' | 'warga_belum_bayar' | 'activity_log'>('notifikasi')

const tableData = computed(() => {
  switch (selectedType.value) {
    case 'notifikasi':
      return dashboardStore.notifications

    case 'pembayaran':
      return dashboardStore.payments

    case 'warga_belum_bayar':
      return dashboardStore.unpaidResidents

    case 'activity_log':
      return dashboardStore.activityLogs

    default:
      return []
  }
})

const handleFilter = async (type: typeof selectedType.value) => {
  selectedType.value = type
  await dashboardStore.fetchDashboard(type)
}

onMounted(async () => {
  const fromPath = useCookie('from-path')

  if (uiStore.isLoading && fromPath.value === '/login') {
    uiStore.endLoading()
    fromPath.value = null
  }
})
</script>

<template>
  <div>
    <div class="mb-3">
      <h2>Dashboard</h2>
      <span class="text-body-2">Ringkasan data utama sistem, termasuk statistik warga, regu, iuran, dan aktivitas
        terbaru.</span>
    </div>

    <VRow class="match-height">

      <!-- 🔥 MINI CARDS -->
      <VCol cols="12">
        <VRow>
          <VCol cols="12" sm="6">
            <VCard class="pa-3">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption">Total Warga</div>
                  <div class="text-h6 font-weight-bold">
                    {{ dashboardStore.totalWarga }}
                  </div>
                </div>
                <div><i class="ri-group-line text-h5"></i></div>
              </div>
            </VCard>
          </VCol>

          <VCol cols="12" sm="6">
            <VCard class="pa-3">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption">Bayar Hari Ini</div>
                  <div class="text-h6 font-weight-bold">
                    {{ formatRupiah(dashboardStore.totalPembayaranHariIni) }}
                  </div>
                </div>
                <div><i class="ri-money-dollar-circle-line text-h5"></i></div>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <FormFilterDashboard @change="handleFilter" />
      </VCol>

      <VCol cols="12">
        <DataTableDashboard :type="selectedType" :data="tableData" :loading="dashboardStore.loading"
          :hasFilter="false" />
      </VCol>
    </VRow>
  </div>
</template>

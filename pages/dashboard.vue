<script setup lang="ts">
import DataTableDashboard from '@/views/dashboard-new/DataTable.vue';
import FormFilterDashboard from '@/views/dashboard-new/FormFilter.vue';

definePageMeta({
  middleware: ['admin']
})

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
    <h2 class="mb-3">Dashboard</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterDashboard @change="handleFilter" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableDashboard
          :type="selectedType"
          :data="tableData"
          :loading="dashboardStore.loading"
          :hasFilter="false"
        />
      </VCol>
    </VRow>
  </div>
</template>

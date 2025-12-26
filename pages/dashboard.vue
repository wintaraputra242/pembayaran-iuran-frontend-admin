<script setup lang="ts">
import FormFilterDashboard from '@/views/dashboard-new/FormFilter.vue';
import NotifcationTableDashboard from '@/views/dashboard-new/NotifcationTable.vue';

definePageMeta({
  middleware: ['admin']
})
</script>

<template>
  <div>
    <h2 class="mb-3">Dashboard</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterDashboard />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <NotifcationTableDashboard />
      </VCol>
  
      <!-- <VCol
        cols="12"
        md="8"
      >
        <AnalyticsTransactions />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <AnalyticsWeeklyOverview />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <AnalyticsTotalEarning />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <VRow class="match-height">
          <VCol
            cols="12"
            sm="6"
          >
            <AnalyticsTotalProfitLineCharts />
          </VCol>
  
          <VCol
            cols="12"
            sm="6"
          >
            <CardStatisticsVertical v-bind="totalProfit" />
          </VCol>
  
          <VCol
            cols="12"
            sm="6"
          >
            <CardStatisticsVertical v-bind="newProject" />
          </VCol>
  
          <VCol
            cols="12"
            sm="6"
          >
            <AnalyticsBarCharts />
          </VCol>
        </VRow>
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <AnalyticsSalesByCountries />
      </VCol>
  
      <VCol
        cols="12"
        md="8"
      >
        <AnalyticsDepositWithdraw />
      </VCol>
  
      <VCol cols="12">
        <AnalyticsUserTable />
      </VCol> -->
    </VRow>
  </div>
</template>

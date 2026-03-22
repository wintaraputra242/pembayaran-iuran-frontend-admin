<script setup lang="ts">
import DataTableActivity from '@/views/activity/DataTable.vue'
import FormFilterActivity from '@/views/activity/FormFilter.vue'

definePageMeta({
  middleware: ['admin'],
})

const activityStore = useActivityStore()

const page = ref(1)

const handleLoadMore = async () => {
  page.value += 1
  await activityStore.fetchActivities({ limit: 10, page: page.value })
}

const handleFilter = async (filters: {
  action: string
  user: string
  date: string
}) => {
  page.value = 1
  activityStore.reload = true

  if (filters.date && Array.isArray(filters.date)) {
    activityStore.setFilter('start_date', formatDateToYMD(filters.date[0]))
    activityStore.setFilter('end_date', formatDateToYMD(filters.date[1]))
  } else {
    activityStore.setFilter('start_date', '')
    activityStore.setFilter('end_date', '')
  }

  activityStore.setFilter('action', filters.action || '')
  activityStore.setFilter('user', filters.user || '')

  await activityStore.fetchActivities({ limit: 10, page: page.value })
}

const handleReload = async () => {
  page.value = 1
  activityStore.reload = true
  activityStore.resetFilter()

  await activityStore.fetchActivities({
    page: 1,
    limit: 10,
  })
}

onMounted(async () => {
  if (activityStore.page) page.value = activityStore.page

  if (activityStore.page === 0) {
    await activityStore.fetchActivities({
      page: 1,
      limit: 10,
    })
  }
})
</script>

<template>
  <div>
    <div class="mb-3">
      <h2>Aktivitas</h2>
      <span class="text-body-2">Menampilkan riwayat aktivitas pengguna dalam sistem untuk keperluan audit dan tracking.</span>
    </div>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterActivity
          :loading="activityStore.loading"
          @filter="handleFilter"
          @reload="handleReload"
        />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableActivity
          :data="activityStore.activities"
          :meta="activityStore.meta"
          :loading="activityStore.loading"
          :has-more="activityStore.hasMore"
          :has-filter="activityStore.hasFilter"
          @load-more="handleLoadMore"
        />
      </VCol>
    </VRow>
  </div>
</template>

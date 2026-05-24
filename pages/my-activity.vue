<script setup lang="ts">
import DataTableActivity from '@/views/activity/DataTable.vue'

definePageMeta({ adminAndKetuaRegu: true })

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
  await activityStore.fetchActivities({
    page: 1,
    limit: 10,
  })
})
</script>

<template>
  <div>
    <div class="mb-7">
      <VBtn class="px-0 py-1" variant="text" size="large" :to="'/create-pembayaran'">
        <VIcon icon="ri-arrow-left-s-line" class="me-2" />
        Keluar
      </VBtn>
    </div>

    <div class="mb-4">
      <h2>Aktivitas Saya</h2>
      <span>Informasi terkait dengan aktivitas yang sudah pernah Anda lakukan sebelumnya</span>
    </div>
    <VRow class="match-height">

      <VCol cols="12">
        <DataTableActivity :data="activityStore.activities" :meta="activityStore.meta" :loading="activityStore.loading"
          :has-more="activityStore.hasMore" :has-filter="activityStore.hasFilter" @load-more="handleLoadMore" />
      </VCol>
    </VRow>
  </div>
</template>

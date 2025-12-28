<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'editPassword', item: object): void;
  (e: 'edit', item: object): void;
  (e: 'delete', item: object): void;
}>();

// Dummy data simulasi API
const allDummyData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  nama: `Warga #${i + 1}`,
  info: i % 2 === 0 ? 'Notifikasi belum dibaca' : 'Pembayaran berhasil',
  created_at: `2025-01-${String((i % 28) + 1).padStart(2, '0')}`,
}))

// State
const items = ref<any[]>([])
const page = ref(1)
const perPage = 20
const isLoading = ref(false)
const hasMore = ref(true)

const loadData = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  const start = (page.value - 1) * perPage
  const end = page.value * perPage
  const newData = allDummyData.slice(start, end)

  items.value.push(...newData)
  page.value++

  if (end >= allDummyData.length) {
    hasMore.value = false
  }

  isLoading.value = false
}

let observer: IntersectionObserver

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'info', label: 'Nama', width: '400px' },
  { key: 'nama', label: 'Username', width: '200px' },
  { key: 'role', label: 'Role', align: 'center' },
  { key: 'actions' },
]

onMounted(() => {
  const sentinelWarga = document.getElementById('sentinelWarga')
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadData()
    }
  })

  if (sentinelWarga) observer.observe(sentinelWarga)

  // Initial load
  loadData()
})
</script>

<template>
  <VCard class="pa-0">
    <VCardItem class="pa-2">
      <div
        class="table-scroll-wrapper"
      >
        <AppDataTable
          :headers="headers"
          :items="items"
          :loading="isLoading"
          :has-more="hasMore"
          @loadMore="loadData"
        >
          <template #cell-role="{ item }">
            <VChip color="info">
              Ketua Regu
            </VChip>
          </template>

          <template #cell-actions="{ item }">
            <IconBtn
              size="small"
              variant="outlined"
              color="secondary"
              @click="emit('editPassword', item)"
            >
              <VIcon icon="ri-lock-2-line" />
            </IconBtn>

            <IconBtn
              size="small"
              variant="outlined"
              color="secondary"
              @click="emit('edit', item)"
            >
              <VIcon icon="ri-edit-line" />
            </IconBtn>
          </template>
        </AppDataTable>
      </div>
    </VCardItem>
  </VCard>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;   /* tinggi container */
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>

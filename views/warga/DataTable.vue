<script setup lang="ts">
import { onMounted, ref } from 'vue'

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

    <!-- Wrapper table yang di-scroll -->
    <div
      class="table-scroll-wrapper"
    >
      <VTable fixed-header height="400px">
        <thead>
          <tr>
            <th>No.</th>
            <th>NIK</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>No. HP</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in items" :key="item.id">
            <td>{{ i + 1 }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.info }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.info }}</td>
            <td>{{ item.created_at }}</td>
            <td>
              <div class="d-flex">
                <IconBtn variant="text" color="secondary">
                  <VIcon icon="ri-edit-line" />
                </IconBtn>
                <IconBtn variant="text" color="secondary">
                  <VIcon icon="ri-delete-bin-line" />
                </IconBtn>
              </div>
            </td>
          </tr>

          <!-- Loading -->
          <tr v-if="isLoading">
            <td colspan="3" class="text-center py-3">
              <VProgressCircular indeterminate size="26" />
            </td>
          </tr>

          <tr>
            <div id="sentinelWarga" style="height: 1px;"></div>
          </tr>
        </tbody>
      </VTable>
    </div>
  </VCard>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;   /* tinggi container */
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

/* optional: biar header lebih jelas */
thead th {
  font-weight: 600;
  background: white;
  z-index: 3;
}
</style>

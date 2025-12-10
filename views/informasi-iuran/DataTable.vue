<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'updateStatus', item: object): void;
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
        <VTable fixed-header height="400px" class="my-table">
          <thead>
            <tr>
              <th style="width: 70px">No.</th>
              <th class="text-center" style="width: 150px">Jenis Iuran</th>
              <th style="width: 250px">Judul</th>
              <th style="width: 400px">Keterangan</th>
              <th style="width: 100px">Periode</th>
              <th style="width: 150px">Jumlah Iuran</th>
              <th style="width: 150px">Status</th>
              <th style="width: 150px"></th>
            </tr>
          </thead>
  
          <tbody>
            <tr v-for="(item, i) in items" :key="item.id">
              <td>{{ i + 1 }}</td>
              <td align="center">
                <!-- <VChip :color="'info'">
                  Bulanan
                </VChip> -->
                <VChip :color="'error'">
                  Kematian
                </VChip>
              </td>
              <td>{{ item.info }}</td>
              <td>{{ item.info }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.nama }}</td>
              <td>
                <!-- <span class="text-success">Aktif</span> -->
                <span class="text-error">Tidak Aktif</span>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('updateStatus', item)">
                    <VIcon icon="ri-eye-off-line" />
                  </IconBtn>
                  <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('edit', item)">
                    <VIcon icon="ri-edit-line" />
                  </IconBtn>
                  <IconBtn variant="outlined" class="rounded-lg" size="small" color="error" @click="emit('delete', item)">
                    <VIcon icon="ri-delete-bin-line" />
                  </IconBtn>
                </div>
              </td>
            </tr>
  
            <!-- Loading -->
            <tr v-if="isLoading">
              <td colspan="7" rowspan="2" class="text-center py-3">
                <VProgressCircular indeterminate size="26" />
              </td>
            </tr>
  
            <tr v-if="hasMore">
              <td colspan="7"><div id="sentinelWarga" style="height: 1px; width: 100%;"></div></td>
            </tr>
          </tbody>
        </VTable>
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

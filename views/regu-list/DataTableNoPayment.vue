<script setup lang="ts">
import type { PaginationMeta } from '@/types/common'

const props = withDefaults(defineProps<{
  data: any[]
  meta?: null | PaginationMeta
  loading: boolean
  loadingSendNotif: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {
  data: () => [],
  loadingSendNotif: false,
  hasMore: false,
  hasFilter: false,
})

const emit = defineEmits<{
  (e: 'loadMore'): void
  (e: 'sendNotif', item: any): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

const headers = [
  { label: 'No.', key: 'no', width: '60px' },
  { label: 'Nama Warga', key: 'nama_warga', width: '200px' },
  { label: 'No. HP', key: 'no_hp', width: '150px' },
  { label: 'Regu', key: 'regu', width: '120px' },
  { label: 'Status', key: 'status_keaktifan', width: '120px' },
  { key: 'actions' },
]

const indexSelected = ref<number | null>(null)

const handleSendNotif = (item: any, index: number) => {
  indexSelected.value = index
  emit('sendNotif', item)
}
</script>

<template>
  <AppDataTable :headers="headers" :items="data" :meta="meta" :loading="loading" :has-more="hasMore"
    :no-data-text="!hasFilter ? 'Pilih informasi iuran dan klik Cek' : 'Semua warga sudah membayar'"
    @load-more="emit('loadMore')" @change-page="emit('changePage', $event)"
    @change-limit="emit('changeLimit', $event)">
    <!-- Nama Warga -->
    <template #cell-nama_warga="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.nama_warga }}</span>
        <!-- <span class="text-caption text-medium-emphasis">{{ item.nik }}</span> -->
      </div>
    </template>

    <!-- No HP -->
    <template #cell-no_hp="{ item }">
      <!-- <span v-if="item.no_hp">{{ item.no_hp }}</span> -->
      <a v-if="item.no_hp" :href="`https://wa.me/${item.no_hp.replace(/\D/g, '').replace(/^0/, '62')}`" target="_blank"
        rel="noopener noreferrer" class="text-decoration-none d-inline-flex align-center gap-1 px-2 py-1 rounded-lg"
        style="background: rgba(37, 211, 102, 0.1); border: 1px solid rgba(37, 211, 102, 0.3);">
        <VIcon icon="ri-whatsapp-line" size="13" color="success" />
        <p class="ma-0 text-caption font-weight-medium" style="color: #25d366;">{{
          item.no_hp }}</p>
        <VIcon icon="ri-external-link-line" size="11" style="color: #25d366; opacity: 0.7;" />
      </a>
      <span v-else class="text-medium-emphasis">-</span>
    </template>

    <!-- Regu -->
    <template #cell-regu="{ item }">
      <span>{{ item.anggota_regu?.[0]?.regu?.nama_regu ?? '-' }}</span>
    </template>

    <!-- Status -->
    <template #cell-status_keaktifan="{ item }">
      <VChip size="small" :color="item.status_keaktifan === 'aktif' ? 'success' : 'error'" variant="tonal">
        {{ item.status_keaktifan === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <!-- Aksi -->
    <template #cell-actions="{ item, index }">
      <div class="d-flex justify-center">
        <VTooltip text="Kirim Notifikasi">
          <template #activator="{ props: tooltipProps }">
            <IconBtn v-bind="tooltipProps" variant="outlined" class="rounded-lg" size="small" color="primary"
              :loading="index === indexSelected && loadingSendNotif" :disabled="!item.no_hp"
              @click="handleSendNotif(item, index as number)">
              <VIcon icon="ri-bell-line" />
            </IconBtn>
          </template>
        </VTooltip>
      </div>
    </template>
  </AppDataTable>
</template>

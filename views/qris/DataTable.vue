<script setup lang="ts">
import type { QrSetting } from '@/composables/api/useQrSetting';

const emit = defineEmits<{
  (e: 'delete', item: QrSetting): void
  (e: 'updateStatus', item: QrSetting): void
  (e: 'loadMore'): void
  (e: 'showImage', item: QrSetting): void
}>()

const props = withDefaults(defineProps<{
  data: QrSetting[]
  meta: null
  loading: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {})

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'image', label: 'Gambar QRIS', align: 'center' },
  { key: 'nama_rekening', label: 'Nama Rekening' },
  { key: 'nomor_rekening', label: 'Nomor Rekening' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'uploaded_by', label: 'Diupload Oleh' },
  { key: 'is_active', label: 'Status', align: 'center' },
  { key: 'actions', label: 'Aksi', align: 'center' },
]
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading" :has-more="props.hasMore"
    :has-filter="props.hasFilter" @loadMore="emit('loadMore')">
    <!-- Gambar QRIS -->
    <template #cell-image="{ item }">
      <div class="d-flex">
        <div v-if="item.image" v-ripple v-tooltip="'Klik untuk lihat QRIS'"
          class="cursor-pointer d-inline-flex flex-column align-center gap-1" style="max-width: 70px;"
          @click="emit('showImage', item)">
          <div style="position: relative; width: 60px; height: 60px;">
            <img :src="item.image"
              style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(var(--v-theme-secondary), 0.3);" />
            <div style="
          position: absolute; inset: 0;
          background: rgba(0, 0, 0, 0.18);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        ">
              <VIcon size="20" color="white">ri-zoom-in-line</VIcon>
            </div>
          </div>
          <span style="font-size: 10px; color: rgb(var(--v-theme-secondary)); white-space: nowrap;">
            Lihat QRIS
          </span>
        </div>

        <!-- Fallback jika belum ada gambar -->
        <div v-else class="d-flex flex-column align-center gap-1" style="opacity: 0.4;">
          <VIcon icon="ri-qr-code-line" size="36" color="secondary" />
          <span style="font-size: 10px; color: rgb(var(--v-theme-secondary)); white-space: nowrap;">Belum ada</span>
        </div>
      </div>
    </template>

    <!-- Nama Rekening -->
    <template #cell-nama_rekening="{ item }">
      <span class="font-weight-medium">{{ item.nama_rekening ?? '-' }}</span>
    </template>

    <!-- Nomor Rekening -->
    <template #cell-nomor_rekening="{ item }">
      <span class="text-body-2">{{ item.nomor_rekening ?? '-' }}</span>
    </template>

    <!-- Keterangan -->
    <template #cell-keterangan="{ item }">
      <span class="text-body-2 text-medium-emphasis">{{ item.keterangan ?? '-' }}</span>
    </template>

    <!-- Uploaded By -->
    <template #cell-uploaded_by="{ item }">
      <span class="text-body-2">{{ item.uploaded_by ?? '-' }}</span>
    </template>

    <!-- Status -->
    <template #cell-is_active="{ item }">
      <VChip size="small" :color="item.is_active ? 'success' : 'error'">
        {{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <!-- Aksi -->
    <template #cell-actions="{ item }">
      <div class="d-flex gap-1 justify-center">
        <!-- Toggle Status: hanya muncul jika belum aktif -->
        <VTooltip v-if="!item.is_active" text="Aktifkan">
          <template #activator="{ props: tooltipProps }">
            <IconBtn v-bind="tooltipProps" variant="outlined" class="rounded-lg" size="small" color="success"
              @click="emit('updateStatus', item)">
              <VIcon icon="ri-eye-line" />
            </IconBtn>
          </template>
        </VTooltip>

        <!-- Delete: tidak bisa hapus jika sedang aktif -->
        <VTooltip :text="item.is_active ? 'QRIS aktif tidak bisa dihapus' : 'Hapus'">
          <template #activator="{ props: tooltipProps }">
            <span v-bind="tooltipProps">
              <IconBtn variant="outlined" class="rounded-lg" size="small" color="error" :disabled="item.is_active"
                @click="emit('delete', item)">
                <VIcon icon="ri-delete-bin-line" />
              </IconBtn>
            </span>
          </template>
        </VTooltip>
      </div>
    </template>
  </AppDataTable>
</template>

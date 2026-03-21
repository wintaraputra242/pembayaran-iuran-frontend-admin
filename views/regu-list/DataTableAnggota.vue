<script setup lang="ts">
import type { AnggotaRegu } from '@/types/api/master-regu';

const emit = defineEmits<{
  (e: 'setLeader', item: object): void;
  (e: 'changeLeader', item: object): void;
  (e: 'delete', item: object): void;
  (e: 'close'): void;
  (e: 'detailAnggota', item: AnggotaRegu): void;
  (e: 'resetAnggota', items: object[]): void;
}>();

const props = withDefaults(defineProps<{
  data: AnggotaRegu[] | null
  item?: AnggotaRegu | null
  loading: boolean
  isLoading?: boolean
}>(), {
  data: () => ([]),
  isLoading: false,
})

const tab = ref('table')

const itemSelected = ref<AnggotaRegu | null>(null)

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'nama_anggota', label: 'Nama Anggota' },
  { key: 'status_anggota', label: 'Status Keanggotaan' },
  { key: 'actions' },
]

const handleDetailAnggota = (item: AnggotaRegu) => {
  tab.value = 'detail-warga'

  itemSelected.value = item

  emit('detailAnggota', item)
}

</script>

<template>
  <AppDataTable
    :headers="headers"
    :items="props.data"
    :loading="props.loading"
    no-data-text="Tidak ada anggota"
  >
    <template #cell-nama_anggota="{ item }">
      <span>{{ item.warga.nama_warga }}</span>
    </template>

    <template #cell-status_anggota="{ item }">
      <VChip size="small" :color="item.is_leader ? 'info' : ''" :prepend-icon="item.is_leader ? 'ri-vip-crown-line' : ''">
        {{ item.is_leader ? 'Ketua Regu' : 'Anggota' }}
      </VChip>
    </template>

    <template #cell-actions="{ item }">
      <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="handleDetailAnggota(item)">
        <VIcon icon="ri-info-card-line" />
      </IconBtn>
    </template>
  </AppDataTable>
</template>

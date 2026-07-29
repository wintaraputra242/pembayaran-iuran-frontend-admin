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
  keyword?: string // ← tambah
}>(), {
  data: () => ([]),
  isLoading: false,
  keyword: '',
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

// Filter data berdasarkan keyword
const filteredData = computed(() => {
  if (!props.data?.length) return []
  if (!props.keyword?.trim()) return props.data

  const kw = props.keyword.toLowerCase()
  return props.data.filter(item =>
    item.warga?.nama_warga?.toLowerCase().includes(kw)
  )
})

// Highlight keyword
const highlight = (text: string | null | undefined): string => {
  if (!text) return '-'
  if (!props.keyword?.trim()) return text

  const escaped = props.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')

  return text.replace(
    regex,
    '<mark style="background: rgba(var(--v-theme-warning), 0.35); color: inherit; border-radius: 2px; padding: 0 2px;">$1</mark>'
  )
}

</script>

<template>
  <AppDataTable :headers="headers" :items="filteredData" :loading="props.loading" no-data-text="Tidak ada anggota">
    <template #cell-nama_anggota="{ item }">
      <span v-html="item.warga?.nama_warga" />
    </template>

    <template #cell-status_anggota="{ item }">
      <VChip size="small" :color="item.is_leader ? 'info' : ''"
        :prepend-icon="item.is_leader ? 'ri-vip-crown-line' : ''">
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

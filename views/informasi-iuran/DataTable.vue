<script setup lang="ts">
import type { MasterInformasiIuran } from '@/types/api/master-informasi-iuran';
import type { PaginationMeta } from '@/types/common';


const emit = defineEmits<{
  (e: 'updateStatus', item: MasterInformasiIuran): void;
  (e: 'edit', item: MasterInformasiIuran): void;
  (e: 'delete', item: MasterInformasiIuran): void;
  (e: 'loadMore'): void;
}>();

const props = withDefaults(defineProps<{
  data: any[]
  meta: null | PaginationMeta
  loading: boolean
  hasMore: boolean
  hasFilter: boolean
}>(), {})


const headers = [
  { key: 'no', label: 'No.' },
  { key: 'judul_iuran', label: 'Judul Iuran', width: '200px' },
  { key: 'jenis_iuran', label: 'Jenis Iuran', width: '400px' },
  { key: 'nama_warga_meninggal', label: 'Warga yang Meninggal', width: '400px' },
  { key: 'nik_penanggung_jawab', label: 'Warga yang Bertanggung Jawab', width: '400px' },
  { key: 'periode', label: 'Periode' },
  { key: 'jumlah_iuran', label: 'Jumlah Iuran' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'status_aktif', label: 'Status Keaktifan' },
  { key: 'is_deleted' },
  { key: 'actions' },
]

// const formatRupiah = (value: number) => {
//   return new Intl.NumberFormat('id-ID').format(value)
// }
</script>

<template>
  <AppDataTable
    :headers="headers"
    :items="props.data"
    :loading="props.loading"
    :has-more="props.hasMore"
    :has-filter="props.hasFilter"
    @loadMore="emit('loadMore')"
  >
    <template #cell-status_aktif="{ item }">
      <VChip size="small" :color="item.status_aktif === 1 ? 'success' : 'error'">
        {{ item.status_aktif === 1 ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <template #cell-jenis_iuran="{ item }">
      <VChip class="text-capitalize" size="small" :color="item.jenis_iuran === 'bulanan' ? 'info' : 'secondary'">
        {{ item.jenis_iuran }}
      </VChip>
    </template>

    <template #cell-jumlah_iuran="{ item }">
      <p class="pa-0 ma-0">{{ formatRupiah(item.jumlah_iuran) }}</p>
    </template>

    <template #label-jumlah_iuran="{ item, label }">
      <p class="pa-0 ma-0" :class="{ 'mt-n3': item.jenis_iuran === 'kematian' }">{{ label }}</p>
    </template>

    <template #cell-nik_penanggung_jawab="{ item }">
      <span v-if="item.jenis_iuran === 'kematian'">{{ item.warga?.nama_warga || '-' }}</span>
      <span v-else></span>
    </template>

    <template #label-nik_penanggung_jawab="{ item, label }">
      <span v-if="item.jenis_iuran === 'kematian'"> {{ label }} </span>
      <span v-else></span>
    </template>

    <template #cell-nama_warga_meninggal="{ item }">
      <span v-if="item.jenis_iuran === 'kematian'">{{ item.nama_warga_meninggal || '-' }}</span>
      <span v-else></span>
    </template>

    <template #label-nama_warga_meninggal="{ item, label }">
      <span v-if="item.jenis_iuran === 'kematian'"> {{ label }} </span>
      <span v-else></span>
    </template>

    <template #cell-periode="{ item }">
      <p class="ma-0" v-if="item.jenis_iuran === 'bulanan'">{{ item.periode || '-' }}</p>
      <span v-else></span>
    </template>

    <template #label-periode="{ item, label }">
      <p class="ma-0 mt-n3" v-if="item.jenis_iuran === 'bulanan'"> {{ label }} </p>
      <span v-else></span>
    </template>

    <template #cell-actions="{ item }">
      <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('updateStatus', item)">
        <VIcon :icon="item.status_aktif === 1 ? 'ri-eye-off-line' : 'ri-eye-line'" />
      </IconBtn>
      <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('edit', item)">
        <VIcon icon="ri-edit-line" />
      </IconBtn>
      <IconBtn v-if="!item.is_deleted" variant="outlined" class="rounded-lg" size="small" color="error" @click="emit('delete', item)">
        <VIcon icon="ri-delete-bin-line" />
      </IconBtn>
    </template>
  </AppDataTable>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;   /* tinggi container */
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>

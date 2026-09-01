<script setup lang="ts">
import type { Pembayaran } from '@/types/api/pembayaran';
import type { PaginationMeta } from '@/types/common';
import qris from '@images/pages/qris.png';

const props = withDefaults(defineProps<{
  data: Pembayaran[]
  meta: null | PaginationMeta
  loading: boolean
  hasMore: boolean
}>(), {})

const emit = defineEmits<{
  (e: 'showBuktiBayar', item: Pembayaran): void
  (e: 'approve', item: Pembayaran): void
  (e: 'reject', item: Pembayaran): void
  (e: 'loadMore'): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

const config = useRuntimeConfig()

const headers = [
  { label: 'No.', key: 'no', width: '70px', sortable: false },
  { label: 'Warga', key: 'warga', width: '200px' },
  { label: 'Regu', key: 'regu', width: '180px' },
  { label: 'Judul Iuran', key: 'judul_iuran', width: '220px' },
  { label: 'Jenis Iuran', key: 'jenis_iuran', width: '150px' },
  { label: 'Nominal Bayar', key: 'nominal', width: '160px' },
  { label: 'Metode Bayar', key: 'metode_bayar', width: '160px' },
  { label: 'Tanggal Submit', key: 'submitted_at', width: '180px' },
  { label: 'Bukti Pembayaran', key: 'bukti_bayar', width: '160px', align: 'center', sortable: false },
  // { label: 'Catatan', key: 'note', width: '200px' },
  { label: 'Aksi', key: 'aksi', width: '130px', align: 'center', sortable: false },
]
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :meta="props.meta" :loading="props.loading"
    :has-more="props.hasMore" :has-filter="false" @load-more="emit('loadMore')"
    @change-page="emit('changePage', $event)" @change-limit="emit('changeLimit', $event)">

    <!-- Warga -->
    <template #cell-warga="{ item }">
      {{ item.warga.nama_warga }}
    </template>

    <!-- Regu -->
    <template #cell-regu="{ item }">
      {{ item.warga?.anggota_regu[0]?.regu?.nama_regu || '-' }}
    </template>

    <!-- Judul Iuran -->
    <template #cell-judul_iuran="{ item }">
      {{ item.informasi_iuran.judul_iuran || '-' }}
    </template>

    <!-- Jenis Iuran -->
    <template #cell-jenis_iuran="{ item }">
      <VChip size="small" :color="item.informasi_iuran.jenis_iuran === 'bulanan' ? 'info' : 'error'"
        class="text-capitalize">
        {{ item.informasi_iuran.jenis_iuran }}
      </VChip>
    </template>

    <!-- Nominal -->
    <template #cell-nominal="{ item }">
      {{ formatRupiah(item.total_bayar) }}
    </template>

    <!-- Metode Bayar -->
    <template #cell-metode_bayar="{ item }">
      <div class="d-flex align-center gap-1 text-capitalize">
        <VImg v-if="item.metode_bayar === 'qris'" :src="qris" max-width="20px" />
        <VIcon v-else :icon="item.metode_bayar === 'transfer' ? 'ri-exchange-line' : 'ri-cash-line'" size="20" />
        {{ item.metode_bayar }}
      </div>
    </template>

    <!-- Tanggal Submit -->
    <template #cell-submitted_at="{ item }">
      {{ item.submitted_at ? formatDateID(item.submitted_at) : '-' }}
    </template>

    <!-- Bukti Pembayaran -->
    <template #cell-bukti_bayar="{ item }">
      <div v-if="item.bukti_pembayaran" v-ripple class="cursor-pointer d-inline-flex flex-column align-center gap-1"
        style="max-width: 70px;" @click="emit('showBuktiBayar', item)">
        <div style="position: relative; width: 54px; height: 54px;">
          <img :src="config.public.backendUrl + '/storage/' + item.bukti_pembayaran"
            style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(var(--v-theme-primary), 0.3);" />
          <!-- overlay icon zoom -->
          <div style="
        position: absolute; inset: 0;
        background: rgba(var(--v-theme-primary), 0.15);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
      ">
            <VIcon size="18" color="primary">ri-zoom-in-line</VIcon>
          </div>
        </div>
        <span style="font-size: 10px; color: rgb(var(--v-theme-primary)); white-space: nowrap;">
          Lihat Bukti
        </span>
      </div>
      <span v-else class="text-medium-emphasis">-</span>
    </template>

    <!-- Catatan -->
    <!-- <template #cell-note="{ item }">
      <span class="text-body-2 text-medium-emphasis">
        {{ item.note || '-' }}
      </span>
    </template> -->

    <!-- Aksi -->
    <template #cell-aksi="{ item }">
      <div class="d-flex gap-1">
        <VTooltip text="Setujui">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" size="small" variant="flat" color="success" @click="emit('approve', item)">
              <VIcon icon="ri-check-line" /> &nbsp;
              Terima
            </VBtn>
          </template>
        </VTooltip>

        <VTooltip text="Tolak">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" size="small" variant="flat" color="error" @click="emit('reject', item)">
              <VIcon icon="ri-close-line" /> &nbsp;
              Tolak
            </VBtn>
          </template>
        </VTooltip>
      </div>
    </template>

  </AppDataTable>
</template>

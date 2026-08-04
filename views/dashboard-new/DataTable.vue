<script setup lang="ts">
import type { ActivityLog } from '@/types/api/activity';
import type { MasterWarga } from '@/types/api/master-warga';
import type { Notification } from '@/types/api/notification';
import type { Pembayaran } from '@/types/api/pembayaran';
import qris from '@images/pages/qris.png';

type DashboardType =
  | 'notifikasi'
  | 'pembayaran'
  | 'warga_belum_bayar'
  | 'activity_log'

const emit = defineEmits<{
  (e: 'loadMore'): void
  (e: 'approve', item: any): void
  (e: 'reject', item: any): void
  (e: 'cancel', item: any): void
  (e: 'showRejectionReason', item: any): void
  (e: 'showBuktiBayar', item: any): void
}>()

const props = withDefaults(defineProps<{
  type: DashboardType
  data: (Notification | Pembayaran | MasterWarga | ActivityLog)[]
  loading: boolean
}>(), {})

const config = useRuntimeConfig()

const headersMap = {
  notifikasi: [
    { key: 'no', label: '' },         // ← dummy untuk slice(1)
    { key: 'title', label: 'Judul', width: '200px' },
    { key: 'message', label: 'Pesan', width: '400px' },
    { key: 'created_at', label: 'Tanggal' },
  ],
  pembayaran: [
    { key: 'no', label: '' },        // ← dummy untuk slice(1)
    { key: 'nama_warga', label: 'Nama Warga', width: '200px' },
    { key: 'judul_iuran', label: 'Jenis Iuran', width: '200px' },
    { key: 'total_bayar', label: 'Total Bayar' },
    { key: 'tanggal_bayar', label: 'Tanggal Bayar' },
    { key: 'metode_bayar', label: 'Metode' },
    { key: 'bukti_bayar', label: 'Bukti Bayar' },
    { key: 'aksi', label: 'Aksi' },
  ],
  warga_belum_bayar: [
    { key: 'no', label: '' },
    { key: 'nama_warga', label: 'Nama Warga', width: '250px' },
    { key: 'status', label: 'Status' },
  ],
  activity_log: [
    { key: 'no', label: '' },         // ← dummy untuk slice(1)
    { key: 'user', label: 'User', width: '200px' },
    { key: 'action', label: 'Action' },
    { key: 'description', label: 'Deskripsi', width: '350px' },
    { key: 'created_at', label: 'Tanggal' },
  ],
}

const headers = computed(() => headersMap[props.type] ?? [])

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const actionColor: Record<string, string> = {
  create: 'success',
  update: 'info',
  delete: 'error',
  reset: 'warning',
  login: 'primary',
  logout: 'secondary',
}

const actionLabel: Record<string, string> = {
  create: 'Tambah',
  update: 'Ubah',
  delete: 'Hapus',
  login: 'Login',
  logout: 'Logout',
  export: 'Export',
  send_notification: 'Kirim Notifikasi',
}
</script>

<template>
  <AppDataTable :headers="headers" :items="props.data" :loading="props.loading">

    <!-- NOTIFICATION -->
    <template #cell-created_at="{ item }" v-if="props.type === 'notifikasi'">
      {{ formatDateID(item.created_at) }}
    </template>

    <!-- PEMBAYARAN -->
    <template #cell-nama_warga="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-medium">{{ item.nama_warga }}</span>
        <span class="text-caption text-medium-emphasis">{{ item.nis ?? item.nik }}</span>
      </div>
    </template>

    <template #cell-judul_iuran="{ item }" v-if="props.type === 'pembayaran'">
      {{ item.informasi_iuran?.judul_iuran }}
    </template>

    <template #cell-tanggal_bayar="{ item }" v-if="props.type === 'pembayaran'">
      {{ formatDateID(item.tanggal_bayar) }}
    </template>

    <template #cell-total_bayar="{ item }" v-if="props.type === 'pembayaran'">
      Rp {{ formatRupiah(item.total_bayar) }}
    </template>

    <template #cell-metode_bayar="{ item }" v-if="props.type === 'pembayaran'">
      <div class="d-flex align-center gap-1 text-capitalize">
        <VIcon v-if="item.metode_bayar !== 'qris'"
          :icon="item.metode_bayar === 'transfer' ? 'ri-exchange-line' : 'ri-cash-line'" size="20" />
        <VImg v-if="item.metode_bayar === 'qris'" :src="qris" max-width="20px" />
        {{ item.metode_bayar }}
      </div>
    </template>

    <!-- WARGA BELUM BAYAR -->
    <template #cell-status="{ item }">
      <VChip size="x-small" :color="item.status_keaktifan === 'aktif' ? 'success' : 'error'" variant="tonal">
        {{ item.status_keaktifan === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <!-- ACTIVITY LOG -->
    <template #cell-action="{ item }">
      <VChip size="small" class="text-capitalize" :color="actionColor[item.action] || 'secondary'">
        {{ actionLabel[item.action] || item.action }}
      </VChip>
    </template>

    <template #cell-user="{ item }" v-if="props.type === 'activity_log'">
      {{ item.user?.name ?? '-' }}
    </template>

    <template #cell-created_at="{ item }" v-if="props.type === 'activity_log'">
      {{ formatDateID(item.created_at) ?? '-' }}
    </template>

    <template #cell-bukti_bayar="{ item }" v-if="props.type === 'pembayaran'">
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

    <template #cell-aksi="{ item }" v-if="props.type === 'pembayaran'">
      <div v-if="item.status_bayar === 'pending'" class="d-flex gap-1">
        <VTooltip text="Setujui">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" size="small" variant="flat" color="success" @click="emit('approve', item)">
              <VIcon icon="ri-check-line" />&nbsp;Terima
            </VBtn>
          </template>
        </VTooltip>

        <VTooltip text="Tolak">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" size="small" variant="flat" color="error" @click="emit('reject', item)">
              <VIcon icon="ri-close-line" />&nbsp;Tolak
            </VBtn>
          </template>
        </VTooltip>
      </div>

      <!-- Sudah diproses -->
      <template v-else-if="item.status_bayar === 'approved'">
        <div class="d-flex align-center gap-2">
          <div class="d-flex align-center gap-1">
            <VIcon icon="ri-checkbox-circle-line" color="success" size="22" />
            <span class="text-success">Diterima</span>
          </div>
          <VBtn size="x-small" variant="flat" color="error" @click="emit('cancel', item)">
            <VIcon icon="ri-close-line" size="14" class="me-1" />
            Batalkan
          </VBtn>
        </div>
      </template>

      <!-- Rejected -->
      <!-- <template v-else-if="item.status_bayar === 'rejected'">
          <VTooltip :text="'Ditolak: ' + (item.rejection_reason || '-')">
            <template #activator="{ props: tooltipProps }">
              <VIcon v-bind="tooltipProps" icon="ri-close-circle-line" color="error" size="22" />
            </template>
          </VTooltip>
        </template> -->
      <template v-else-if="item.status_bayar === 'rejected'">
        <div v-ripple v-tooltip="'Klik untuk lihat alasan penolakan'"
          class="d-inline-flex align-center gap-1 cursor-pointer px-2 py-1 rounded-lg"
          style="border: 1px dashed rgb(var(--v-theme-error)); background: rgba(var(--v-theme-error), 1);"
          @click="emit('showRejectionReason', item)">
          <VIcon icon="ri-close-circle-line" color="white" size="16" />
          <span class="text-white" style="font-size: 12px; white-space: nowrap;">Ditolak</span>
          <VIcon icon="ri-information-line" color="white" size="14" style="opacity: 0.7;" />
        </div>
      </template>

      <template v-else-if="item.status_bayar === 'cancelled'">
        <div class="d-flex align-center gap-1">
          <VIcon icon="ri-forbid-line" color="secondary" size="22" />
          <span class="text-secondary">Dibatalkan</span>
        </div>
      </template>
    </template>
  </AppDataTable>
</template>

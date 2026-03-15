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
}>()

const props = withDefaults(defineProps<{
  type: DashboardType
  data: (Notification | Pembayaran | MasterWarga | ActivityLog)[]
  loading: boolean
}>(), {})

const headers = computed(() => {
  switch (props.type) {
    case 'notifikasi':
      return [
        { key: 'title', label: 'Judul', width: '200px' },
        { key: 'message', label: 'Pesan', width: '400px' },
        { key: 'created_at', label: 'Tanggal' },
      ]

    case 'pembayaran':
      return [
        { key: 'nama_warga', label: 'Nama Warga', width: '200px' },
        { key: 'judul_iuran', label: 'Jenis Iuran', width: '200px' },
        { key: 'total_bayar', label: 'Total Bayar' },
        { key: 'tanggal_bayar', label: 'Tanggal Bayar' },
        { key: 'metode_bayar', label: 'Metode' },
      ]

    case 'warga_belum_bayar':
      return [
        { key: 'nik', label: 'NIK' },
        { key: 'nama_warga', label: 'Nama Warga', width: '250px' },
        { key: 'no_hp', label: 'No HP' },
        { key: 'status_keaktifan', label: 'Status' },
      ]

    case 'activity_log':
      return [
        { key: 'user', label: 'User', width: '200px' },
        { key: 'action', label: 'Action' },
        { key: 'description', label: 'Deskripsi', width: '350px' },
        { key: 'created_at', label: 'Tanggal' },
      ]
  }
})

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
  <AppDataTable
    :headers="headers"
    :items="props.data"
    :loading="props.loading"
  >

    <!-- NOTIFICATION -->
    <template #cell-created_at="{ item }" v-if="props.type === 'notifikasi'">
      {{ item.created_at }}
    </template>

    <!-- PEMBAYARAN -->
    <template #cell-nama_warga="{ item }" v-if="props.type === 'pembayaran'">
      {{ item.warga?.nama_warga }}
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
        <VIcon
          v-if="item.metode_bayar !== 'qris'"
          :icon="item.metode_bayar === 'transfer' ? 'ri-exchange-line' : 'ri-cash-line'"
          size="20"
        />
        <VImg
          v-if="item.metode_bayar === 'qris'"
          :src="qris"
          max-width="20px"
        />
        {{ item.metode_bayar }}
      </div>
    </template>

    <!-- WARGA BELUM BAYAR -->
    <template #cell-status_keaktifan="{ item }">
      <VChip size="small" :color="item.status_keaktifan === 'aktif' ? 'success' : 'error'">
        {{ item.status_keaktifan === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
      </VChip>
    </template>

    <!-- ACTIVITY LOG -->
    <template #cell-action="{ item }">
      <VChip
        size="small"
        class="text-capitalize"
        :color="actionColor[item.action] || 'secondary'"
      >
        {{ actionLabel[item.action] || item.action }}
      </VChip>
    </template>

    <template #cell-user="{ item }" v-if="props.type === 'activity_log'">
      {{ item.user?.name ?? '-' }}
    </template>

    <template #cell-created_at="{ item }" v-if="props.type === 'activity_log'">
      {{ formatDateID(item.created_at) ?? '-' }}
    </template>

  </AppDataTable>
</template>

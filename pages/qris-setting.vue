<script setup lang="ts">
import type { QrSetting } from '@/composables/api/useQrSetting'
import { useQrSettingStore } from '@/stores/useQrSettingStore'
import DataTableQris from '@/views/qris/DataTable.vue'
import DialogFormDataQris from '@/views/qris/DialogFormData.vue'
import DialogQrisImagePreview from '@/views/qris/DialogQrisImagePreview.vue'
import FormFilterQris from '@/views/qris/FormFilter.vue'


export interface QrisPayload {
  nama: string
  keterangan: string
  nomor_rekening: string
  nama_rekening: string
  gambar?: File | null
}

const qrSettingStore = useQrSettingStore()

// =====================
// State lokal UI
// =====================
const isFetchSuccess = ref(false)

const showFormData = ref(false)
const itemSelected = ref<QrSetting | null>(null)

const showConfirmation = ref(false)
const confirmFrom = ref<'delete' | 'status'>('delete')

const confirmOptions = reactive({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Batal',
  confirmColor: 'error',
  confirmIcon: 'ri-delete-bin-line',
  action: () => { },
})

// =====================
// Init
// =====================
onMounted(() => {
  qrSettingStore.fetchQrSettings()
})

// =====================
// Filter
// =====================
const handleFilter = (params: { keyword: string; status: string }) => {
  qrSettingStore.setFilter('keyword', params.keyword)
  qrSettingStore.setFilter('status', params.status)
}

const handleReload = () => {
  qrSettingStore.resetFilter()
  qrSettingStore.fetchQrSettings()
}

// =====================
// Form Data
// =====================
const handleShowFormData = () => {
  itemSelected.value = null
  isFetchSuccess.value = false
  showFormData.value = true
}

const handleCloseFormData = () => {
  showFormData.value = false
  itemSelected.value = null
}

// =====================
// Submit Tambah
// =====================
const handleSubmit = async (payload: QrisPayload) => {
  const formData = new FormData()
  formData.append('nama_rekening', payload.nama_rekening)
  formData.append('nomor_rekening', payload.nomor_rekening)
  if (payload.keterangan) formData.append('keterangan', payload.keterangan)
  if (payload.gambar) formData.append('image', payload.gambar)

  await qrSettingStore.storeQrSetting(formData)
  isFetchSuccess.value = true
}

// =====================
// Delete
// =====================
const handleShowConfirmDelData = (item: QrSetting) => {
  itemSelected.value = item
  confirmFrom.value = 'delete'
  confirmOptions.title = 'Hapus QRIS'
  confirmOptions.message = `Apakah Anda yakin ingin menghapus QRIS "${item.nama_rekening ?? item.id}"? Tindakan ini tidak dapat dibatalkan.`
  confirmOptions.confirmText = 'Hapus'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-delete-bin-line'
  confirmOptions.action = handleDelete
  showConfirmation.value = true
}

const handleDelete = async () => {
  if (!itemSelected.value) return
  await qrSettingStore.destroyQrSetting(itemSelected.value.id)
  showConfirmation.value = false
}

// =====================
// Update Status (Set Active)
// =====================
const handleShowConfirmUpdateStatus = (item: QrSetting) => {
  itemSelected.value = item
  confirmFrom.value = 'status'

  const isActivating = !item.is_active
  const hasActive = qrSettingStore.qrSettings.some(q => q.is_active && q.id !== item.id)

  confirmOptions.confirmColor = isActivating ? 'success' : 'warning'
  confirmOptions.confirmIcon = isActivating ? 'ri-eye-line' : 'ri-eye-off-line'
  confirmOptions.confirmText = isActivating ? 'Aktifkan' : 'Nonaktifkan'
  confirmOptions.title = isActivating ? 'Aktifkan QRIS' : 'Nonaktifkan QRIS'

  if (isActivating && hasActive) {
    confirmOptions.message = `QRIS "${item.nama_rekening ?? item.id}" akan diaktifkan. QRIS yang sebelumnya aktif akan otomatis dinonaktifkan. Lanjutkan?`
  } else {
    confirmOptions.message = `Apakah Anda yakin ingin ${isActivating ? 'mengaktifkan' : 'menonaktifkan'} QRIS "${item.nama_rekening ?? item.id}"?`
  }

  confirmOptions.action = handleSetActive
  showConfirmation.value = true
}

const handleSetActive = async () => {
  if (!itemSelected.value) return
  await qrSettingStore.setActive(itemSelected.value.id)
  showConfirmation.value = false
}

const showPreviewQris = ref(false)

const handleShowImage = (item: QrSetting) => {
  itemSelected.value = item
  showPreviewQris.value = true
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-3">
      <h2>Atur QRIS</h2>
      <span class="text-body-2">
        Kelola data QRIS untuk pembayaran. Hanya satu QRIS yang dapat aktif pada satu waktu.
      </span>
    </div>

    <VRow class="match-height">
      <!-- Filter -->
      <VCol cols="12">
        <FormFilterQris @show-form-data="handleShowFormData" @filter="handleFilter" @reload="handleReload" />
      </VCol>

      <!-- Tabel -->
      <VCol cols="12">
        <DataTableQris :data="qrSettingStore.filteredQrSettings" :meta="null" :loading="qrSettingStore.loading"
          :has-more="false" :has-filter="qrSettingStore.hasFilter" @show-image="handleShowImage"
          @delete="handleShowConfirmDelData" @update-status="handleShowConfirmUpdateStatus" @load-more="() => { }" />
      </VCol>
    </VRow>

    <!-- Dialog Form Tambah -->
    <DialogFormDataQris :is-show="showFormData" :is-edit="false" :is-fetch-success="isFetchSuccess" :item="null"
      :loading="qrSettingStore.loadingAction" @close="handleCloseFormData" @submit="handleSubmit" />

    <!-- Konfirmasi Delete / Set Active -->
    <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
      :loading="qrSettingStore.loadingAction" @confirm="confirmOptions.action" />

    <DialogQrisImagePreview v-model="showPreviewQris" :item="itemSelected" />
  </div>
</template>

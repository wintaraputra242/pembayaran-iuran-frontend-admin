<script setup lang="ts">
import type { AddWargaPayload, MasterWarga } from '@/types/api/master-warga';
import DataTableWarga from '@/views/warga/DataTable.vue';
import DialogFormDataWarga from '@/views/warga/DialogFormData.vue';
import FormFilterWarga from '@/views/warga/FormFilter.vue';

definePageMeta({
  middleware: ['admin']
})

const masterWargaStore = useMasterWargaStore()
const uiStore = useUiStore()

const showFormData = ref(false)
const isEdit = ref(false)

const handleCloseFormData = () => {
  showFormData.value = false
}

const itemSelected = ref<MasterWarga | null>(null)

const handleEditData = async (item: MasterWarga) => {
  isEdit.value = false

  showFormData.value = true 
  itemSelected.value = item

  await nextTick()
  isEdit.value = true
}

const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)

const confirmOptions = {
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
  action: () => {},
}

const handleDelete = async () => {
  const res = await masterWargaStore.fetchDeleteWarga(itemSelected.value?.nik as string)

  if (res.success) {
    showConfirmation.value = false
    uiStore.showSuccess(res.message)

    page.value = 1
    masterWargaStore.reload = true
    await masterWargaStore.fetchWarga({ limit: 10, page: page.value })
  }
}

const handleShowConfirmDelData = (item: MasterWarga) => {
  confirmOptions.title = 'Hapus Data?'
  confirmOptions.message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'
  confirmOptions.confirmText = 'Hapus'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-delete-bin-line'
  confirmOptions.action = handleDelete

  showConfirmation.value = true 
  itemSelected.value = item
}

const handleUpdateStatus = async () => {
  const res = await masterWargaStore.fetchUpdateStatus({ nik: itemSelected.value?.nik as string, status_keaktifan: itemSelected.value?.status_keaktifan === 'aktif' ? 'tidak_aktif' : 'aktif' })

  if (res.success) {
    showConfirmation.value = false
    uiStore.showSuccess(res.message)

    page.value = 1
    masterWargaStore.reload = true
    await masterWargaStore.fetchWarga({ limit: 10, page: page.value })
  }
}

const handleShowConfirmUpdateStatus = (item: MasterWarga) => {
  const statusAktif = item.status_keaktifan

  const setMessageWhenToActive = () => {
    if (item.is_deleted) return `Sebelumnya data warga dengan nama ${item?.nama_warga} sudah anda hapus, Yakin ingin mengaktifkan kembali data warga ini?.`

    if (statusAktif) return `Apakah Anda yakin ingin mengaktifkan kembali data warga atas nama ${item?.nama_warga}?.`
  } 

  confirmOptions.title = statusAktif === 'aktif' ? 'Nonaktif Warga?' : 'Aktifkan Kembali?'
  confirmOptions.message = statusAktif === 'aktif' ? `Apakah Anda yakin ingin menonaktifkan data warga atas nama ${item?.nama_warga}?.` : setMessageWhenToActive() as string
  confirmOptions.confirmText = statusAktif === 'aktif' ? 'Nonaktif' : 'Aktif'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = statusAktif === 'aktif' ? 'error' : 'success'
  confirmOptions.confirmIcon = statusAktif === 'aktif' ? 'ri-eye-off-line' : 'ri-eye-line'
  confirmOptions.action = handleUpdateStatus

  showConfirmation.value = true 
  itemSelected.value = item
}

const page = ref(1)

const handleFilter = (filters: { keyword: string, status_keaktifan: null | string }) => {
  page.value = 1
  masterWargaStore.reload = true
  Object.entries(filters).forEach(([key, value]) => {
    masterWargaStore.setFilter(key as 'status_keaktifan' | 'keyword', value as string)
  })
  masterWargaStore.fetchWarga({ limit: 10, page: page.value })
}

const handleReload = () => {
  page.value = 1
  masterWargaStore.reload = true
  masterWargaStore.resetFilter()
  masterWargaStore.fetchWarga({ limit: 10, page: page.value })
}

const handleLoadMore = async () => {
  page.value += 1
  await masterWargaStore.fetchWarga({ limit: 10, page: page.value })
}

const isFetchSuccess = ref(false)

const handleAddData = async (params: AddWargaPayload) => {
  isFetchSuccess.value = false

  const res = await masterWargaStore.fetchAddWarga(params)

  if (res.success) {
    showFormData.value = false
    uiStore.showSuccess(res.message)
    isFetchSuccess.value = true

    page.value = 1
    masterWargaStore.reload = true
    await masterWargaStore.fetchWarga({ limit: 10, page: page.value })
  }
}

const handleShowFormData = () => {
  isEdit.value = false

  showFormData.value = true
}

const handleImport = async (file: File) => {
  isFetchSuccess.value = false

  const res = await masterWargaStore.fetchImportAddWarga(file)

  if (res.success) {
    showFormData.value = false
    uiStore.showSuccess(res.message)
    isFetchSuccess.value = true

    page.value = 1
    masterWargaStore.reload = true
    await masterWargaStore.fetchWarga({ limit: 10, page: page.value })
  }
}

const handleUpdate = async (params: AddWargaPayload) => {
  isFetchSuccess.value = false
  const res = await masterWargaStore.fetchUpdateWarga(params, itemSelected.value?.nik as string)

  if (res.success) {
    showFormData.value = false
    uiStore.showSuccess(res.message)
    isFetchSuccess.value = true

    page.value = 1
    masterWargaStore.reload = true
    await masterWargaStore.fetchWarga({ limit: 10, page: page.value })
  }
}

onMounted(async () => {
  await masterWargaStore.fetchWarga({ limit: 10, page: page.value })
})
</script>

<template>
  <div>
    <div class="mb-3">
      <h2>Data Warga</h2>
      <span class="text-body-2">Kelola data warga sebagai objek utama dalam sistem, termasuk identitas dan informasi dasar.</span>
    </div>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterWarga @show-form-data="handleShowFormData" @filter="handleFilter" @reload="handleReload" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableWarga :data="masterWargaStore.warga" :meta="masterWargaStore.meta" :loading="masterWargaStore.loading" :has-more="masterWargaStore.hasMore" :has-filter="masterWargaStore.hasFilter" @edit="handleEditData" @delete="handleShowConfirmDelData" @update-status="handleShowConfirmUpdateStatus" @load-more="handleLoadMore" />
      </VCol>
    </VRow>

    <DialogFormDataWarga :is-fetch-success="isFetchSuccess" :loading="masterWargaStore.loading" :is-show="showFormData" :is-edit="isEdit" :item="itemSelected" @close="handleCloseFormData" @submit="isEdit ? handleUpdate($event) : handleAddData($event)" @import="handleImport" />

    <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="masterWargaStore.loading"
      @confirm="confirmOptions.action"
    />
  </div>
</template>

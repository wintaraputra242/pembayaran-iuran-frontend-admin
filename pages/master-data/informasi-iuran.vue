<script setup lang="ts">
import type { AddInformasiIuranPayload, MasterInformasiIuran } from '@/types/api/master-informasi-iuran';
import DataTableInformasiIuran from '@/views/informasi-iuran/DataTable.vue';
import DialogFormDataInformasiIuran from '@/views/informasi-iuran/DialogFormData.vue';
import FormFilterInformasiIuran from '@/views/informasi-iuran/FormFilter.vue';

definePageMeta({
  middleware: ['admin']
})

const masterInformasiIuranStore = useMasterInformasiIuranStore()
const uiStore = useUiStore()
const dropdownStore = useDropdownStore()

const showFormData = ref(false)
const isEdit = ref(false)

const handleCloseFormData = () => {
  showFormData.value = false
}

const itemSelected = ref<MasterInformasiIuran | null>(null)

const handleEditData = async (item: MasterInformasiIuran) => {
  isEdit.value = false

  showFormData.value = true 
  itemSelected.value = item

  await nextTick()
  isEdit.value = true
}

const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)

async function deleteItem() {
  isLoadingConfirm.value = true

  // contoh request
  await new Promise(res => setTimeout(res, 1000))

  isLoadingConfirm.value = false
  showConfirmation.value = false

  // console.log("Item dihapus!")
}

const confirmOptions = {
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
  action: () => {},
}

const handleDeleteData = (item: MasterInformasiIuran) => {
  confirmOptions.title = 'Hapus Data?'
  confirmOptions.message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'
  confirmOptions.confirmText = 'Hapus'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-delete-bin-line'

  showConfirmation.value = true 
  itemSelected.value = item
}

const showAnggota = ref(false)
const isLoadingGetAnggota = ref(false)

const handleShowAnggota = (item: MasterInformasiIuran) => {
  isLoadingGetAnggota.value = true

  setTimeout(() => {
    isLoadingGetAnggota.value = false
  }, 5000)
  
  showAnggota.value = true 
  itemSelected.value = item
}

// const handleUpdateStatus = (item: object) => {
//   confirmOptions.title = 'Nonaktif Warga?'
//   confirmOptions.message = `Apakah Anda yakin ingin mengnonaktifkan data informasi iuran ${item?.nama}?.`
//   confirmOptions.confirmText = 'Nonaktif'
//   confirmOptions.cancelText = 'Batal'
//   confirmOptions.confirmColor = 'error'
//   confirmOptions.confirmIcon = 'ri-eye-off-line'

//   showConfirmation.value = true 
//   itemSelected.value = item
// }

const page = ref(1)

const handleShowFormData = () => {
  isEdit.value = false

  showFormData.value = true
}

const handleFilter = (filters: { keyword: string, status_aktif: null | number, jenis_iuran: string | null }) => {
  page.value = 1
  masterInformasiIuranStore.reload = true
  Object.entries(filters).forEach(([key, value]) => {
    masterInformasiIuranStore.setFilter(key as 'status_aktif' | 'keyword' | 'jenis_iuran', value as string)
  })
  masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
}

const handleReload = () => {
  page.value = 1
  masterInformasiIuranStore.reload = true
  masterInformasiIuranStore.resetFilter()
  masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
}

const handleDelete = async () => {
  const res = await masterInformasiIuranStore.fetchDeleteInformasiIuran(itemSelected.value?.id as number)

  if (res.success) {
    showConfirmation.value = false
    uiStore.showSuccess(res.message)

    page.value = 1
    masterInformasiIuranStore.reload = true
    await masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
  }
}

const handleShowConfirmDelData = (item: MasterInformasiIuran) => {
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
  const res = await masterInformasiIuranStore.fetchUpdateStatus({ id: itemSelected.value?.id as number, status_aktif: itemSelected.value?.status_aktif === 1 ? 0 : 1 })

  if (res.success) {
    showConfirmation.value = false
    uiStore.showSuccess(res.message)

    page.value = 1
    masterInformasiIuranStore.reload = true
    await masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
  }
}

const handleShowConfirmUpdateStatus = (item: MasterInformasiIuran) => {
  const statusAktif = item.status_aktif

  const setMessageWhenToActive = () => {
    if (item.is_deleted) return `Sebelumnya data informasi iuran dengan judul ${item?.judul_iuran} sudah anda hapus, Yakin ingin mengaktifkan kembali data informasi iuran ini?.`

    if (statusAktif) return `Apakah Anda yakin ingin mengaktifkan kembali data informasi iuran atas judul ${item?.judul_iuran}?.`
  } 

  confirmOptions.title = statusAktif === 1 ? 'Nonaktif Informasi Iuran?' : 'Aktifkan Kembali?'
  confirmOptions.message = statusAktif === 1 ? `Apakah Anda yakin ingin menonaktifkan data informasi iuran atas judul ${item?.judul_iuran}?.` : setMessageWhenToActive() as string
  confirmOptions.confirmText = statusAktif === 1 ? 'Nonaktif' : 'Aktif'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = statusAktif === 1 ? 'error' : 'success'
  confirmOptions.confirmIcon = statusAktif === 1 ? 'ri-eye-off-line' : 'ri-eye-line'
  confirmOptions.action = handleUpdateStatus

  showConfirmation.value = true 
  itemSelected.value = item
}

const handleLoadMore = async () => {
  page.value += 1
  await masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
}

const isFetchSuccess = ref(false)

const handleUpdate = async (params: AddInformasiIuranPayload) => {
  isFetchSuccess.value = false
  const res = await masterInformasiIuranStore.fetchUpdateInformasiIuran(params, itemSelected.value?.id as number)

  if (res.success) {
    showFormData.value = false
    uiStore.showSuccess(res.message)
    isFetchSuccess.value = true

    page.value = 1
    masterInformasiIuranStore.reload = true
    await masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
  }
}

const handleAddData = async (params: AddInformasiIuranPayload) => {
  isFetchSuccess.value = false

  const res = await masterInformasiIuranStore.fetchAddInformasiIuran(params)

  if (res.success) {
    showFormData.value = false
    uiStore.showSuccess(res.message)
    isFetchSuccess.value = true

    page.value = 1
    masterInformasiIuranStore.reload = true
    await masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
  }
}

onMounted(async () => {
  if (masterInformasiIuranStore.page) page.value = masterInformasiIuranStore.page

  if (masterInformasiIuranStore.page === 0) {
    await masterInformasiIuranStore.fetchInformasiIuran({ limit: 10, page: page.value, mode: 'admin' })
  }
  
  await dropdownStore.fetchWargaForDropdown()
})
</script>

<template>
  <div>
    <div class="mb-3">
      <h2>Data Informasi Iuran</h2>
      <span class="text-body-2">Kelola jenis dan detail iuran yang berlaku, termasuk nominal dan kategori iuran.</span>
    </div>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterInformasiIuran @show-form-data="handleShowFormData" @filter="handleFilter" @reload="handleReload" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableInformasiIuran :data="masterInformasiIuranStore.informasiIuran" :meta="masterInformasiIuranStore.meta" :loading="masterInformasiIuranStore.loading" :has-more="masterInformasiIuranStore.hasMore" :has-filter="masterInformasiIuranStore.hasFilter" @edit="handleEditData" @delete="handleShowConfirmDelData" @update-status="handleShowConfirmUpdateStatus" @load-more="handleLoadMore" />
      </VCol>
    </VRow>

    <DialogFormDataInformasiIuran :is-fetch-success="isFetchSuccess" :loading="masterInformasiIuranStore.loading" :is-show="showFormData" :is-edit="isEdit" :item="itemSelected" :item-dropdown-warga="dropdownStore.itemWargaForDropdown" :loading-dropdown-warga="dropdownStore.loading.wargaForDropdown" @close="handleCloseFormData" @submit="isEdit ? handleUpdate($event) : handleAddData($event)" />

    <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="masterInformasiIuranStore.loading"
      @confirm="confirmOptions.action"
    />
  </div>
</template>

<script setup lang="ts">
import type { AnggotaRegu, CreateReguPayload, MasterRegu } from '@/types/api/master-regu';
import DataTableRegu from '@/views/regu/DataTable.vue';
import DialogDataTableAnggota from '@/views/regu/DialogDataTableAnggota.vue';
import DialogFormDataRegu from '@/views/regu/DialogFormData.vue';
import FormFilterRegu from '@/views/regu/FormFilter.vue';

definePageMeta({ onlyAdmin: true })

const masterReguStore = useMasterReguStore()
const masterUsersStore = useMasterUsersStore()
const masterWargaStore = useMasterWargaStore()
const uiStore = useUiStore()
const dropdownStore = useDropdownStore()

const showFormData = ref(false)
const isEdit = ref(false)

const handleCloseFormData = () => {
  if (isEdit.value) isEdit.value = false

  showFormData.value = false
}

const handleCloseShowAnggota = () => {
  fromDialog.value = ''

  showAnggota.value = false
}

const itemSelected = ref<MasterRegu | null>(null)

const handleEditData = async (item: MasterRegu) => {
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
  loading: false,
  action: () => {},
}

const handleDelete = async () => {
  const res = await masterReguStore.fetchDeleteRegu(itemSelected.value?.id as number)

  if (res.success) {
    showConfirmation.value = false
    uiStore.showSuccess(res.message)

    page.value = 1
    masterReguStore.reload = true
    await masterReguStore.fetchRegu({ limit: 10, page: page.value })
  }
}

const handleShowConfirmDelData = (item: MasterRegu) => {
  confirmFrom.value = 'not-anggota'

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

const showAnggota = ref(false)
const isLoadingGetAnggota = ref(false)

const handleShowAnggota = async (item: MasterRegu) => {
  showAnggota.value = true 
  itemSelected.value = item

  await masterReguStore.fetchAnggotaRegu(item.id)
}

const fromDialog = ref('')

const handleFetchSetLeaderAnggota = async (nik: string) => {
  const res = await masterReguStore.fetchSetLeaderAnggota({
    id_regu: itemSelected.value?.id as number,
    nik,
  })

  await masterReguStore.fetchAnggotaRegu(itemSelected.value?.id as number)

  showConfirmation.value = false
  showAnggota.value = true
  
  await nextTick()
  uiStore.showSuccess(res.message)
}


watch(() => showConfirmation.value, (newVal) => {
  if (!newVal) {
    if (fromDialog.value && fromDialog.value === 'data-table-anggota-regu') {
      showAnggota.value = true
      return
    }

    fromDialog.value = ''
  }

  if (newVal) {
    if (fromDialog.value && fromDialog.value === 'data-table-anggota-regu') {
      showAnggota.value = false
      return
    }
  }
})

const handleSetLeaderAnggota = (item: AnggotaRegu) => {
  fromDialog.value = 'data-table-anggota-regu'
  confirmFrom.value = 'anggota'

  confirmOptions.title = 'Jadikan Ketua Regu?'
  confirmOptions.message = 'Apakah Anda yakin ingin menjadikan anggota Made Sovian sebagai ketua regu A?'
  confirmOptions.confirmText = 'Simpan'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'info'
  confirmOptions.confirmIcon = 'ri-save-2-line'
  confirmOptions.action = () => {
    handleFetchSetLeaderAnggota(item.nik)
  }

  showConfirmation.value = true 
  // itemSelected.value = item
}

const showAnnouncement = ref(false)

const handleFetchResetAllAnggota = async () => {
  const res = await masterReguStore.fetchResetAnggotaAll()

  showConfirmation.value = false
  
  uiStore.showSuccess(res.message)
}

const confirmFrom = ref('not-anggota')

const handleResetAllAnggota = () => {
  confirmFrom.value = 'anggota'

  confirmOptions.title = 'Reset Semua Anggota?'
  confirmOptions.message = 'Apakah Anda yakin ingin me-reset semua anggota yang ada dimasing-masing regu? Tindakan ini tidak dapat dibatalkan.'
  confirmOptions.confirmText = 'Reset'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-user-community-line'
  confirmOptions.action = handleFetchResetAllAnggota

  showConfirmation.value = true 
}

const handleResetOneAnggota = async (id: number) => {
  const res = await masterReguStore.fetchResetAnggota(id)
  
  await masterReguStore.fetchAnggotaRegu(itemSelected.value?.id as number)
  
  showConfirmation.value = false
  showAnggota.value = true
  
  await nextTick()
  uiStore.showSuccess(res.message)
}

const handleResetAnggotaByRegu = async () => {
  const res = await masterReguStore.fetchResetAnggotaByRegu(itemSelected.value?.id as number)

  await masterReguStore.fetchAnggotaRegu(itemSelected.value?.id as number)

  showConfirmation.value = false
  showAnggota.value = true
  
  await nextTick()
  uiStore.showSuccess(res.message)
}

const handleResetAnggota = (item?: AnggotaRegu) => {
  fromDialog.value = 'data-table-anggota-regu'
  confirmFrom.value = 'anggota'

  confirmOptions.title = 'Reset Anggota?'
  confirmOptions.message = item ? `Apakah Anda yakin ingin me-reset anggota atas nama ${item.warga.nama_warga} dari ${item.regu.nama_regu}?` : `Apakah Anda yakin ingin me-reset seluruh anggota dari ${itemSelected.value?.nama_regu} ?`
  confirmOptions.confirmText = 'Reset'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-user-community-line'
  confirmOptions.action = () => {
    if (item) {
      handleResetOneAnggota(item.id)
    } else {
      handleResetAnggotaByRegu()
    }
  }

  showConfirmation.value = true 
}

const handleSubmit = async (params: CreateReguPayload) => {
  isFetchSuccess.value = false

  const res = await masterReguStore.createRegu(params)
  
  if (localStorage.getItem('from') && localStorage.getItem('from') === 'create-user') {
    handleCloseFormData()
    masterUsersStore.reload = true
    masterUsersStore.resetFilter()
    navigateTo('/master-data/users')
    return
  }

  page.value = 1
  masterReguStore.reload = true
  await masterReguStore.fetchRegu({ limit: 10, page: page.value })

  isFetchSuccess.value = true
  showFormData.value = false
  uiStore.showSuccess(res.message)
}

watch(() => showFormData.value, (newVal) => {
  if (!newVal) {
    localStorage.removeItem('from')
  }
})

const handleShowFormData = () => {
  isEdit.value = false

  showFormData.value = true
}

const page = ref(1)

const isFetchSuccess = ref(false)

const handleFilter = (filters: { nama_regu: string, status_keaktifan: 'aktif' | 'tidak_aktif' | null }) => {
  page.value = 1
  masterReguStore.reload = true
  Object.entries(filters).forEach(([key, value]) => {
    masterReguStore.setFilter(key as 'nama_regu' | 'status_keaktifan', value as string)
  })
  masterReguStore.fetchRegu({ limit: 10, page: page.value })
}

const handleUpdate = async (params: CreateReguPayload) => {
  isFetchSuccess.value = false
  const res = await masterReguStore.fetchUpdateRegu(params, itemSelected.value?.id as number)

  if (res.success) {
    showFormData.value = false
    uiStore.showSuccess(res.message)
    isFetchSuccess.value = true

    page.value = 1
    masterReguStore.reload = true
    await masterReguStore.fetchRegu({ limit: 10, page: page.value })
  }
}

const handleLoadMore = async () => {
  page.value += 1
  await masterReguStore.fetchRegu({ limit: 10, page: page.value })
}

const handleReload = () => {
  page.value = 1
  masterReguStore.reload = true
  masterReguStore.resetFilter()
  masterReguStore.fetchRegu({ limit: 10, page: page.value })
}

const handleUpdateStatus = async () => {
  const res = await masterReguStore.fetchUpdateStatus({ id: itemSelected.value?.id as number, status_keaktifan: itemSelected.value?.status_keaktifan === 'aktif' ? 'tidak_aktif' : 'aktif' })

  if (res.success) {
    showConfirmation.value = false
    uiStore.showSuccess(res.message)

    page.value = 1
    masterReguStore.reload = true
    await masterReguStore.fetchRegu({ limit: 10, page: page.value })
  }
}

const handleShowConfirmUpdateStatus = (item: MasterRegu) => {
  const statusAktif = item.status_keaktifan
  confirmFrom.value = 'not-anggota'

  const setMessageWhenToActive = () => {
    if (item.is_deleted) return `Sebelumnya data regu dengan nama ${item?.nama_regu} sudah anda hapus, Yakin ingin mengaktifkan kembali data regu ini?.`

    if (statusAktif) return `Apakah Anda yakin ingin mengaktifkan kembali data regu atas nama ${item?.nama_regu}?.`
  } 

  confirmOptions.title = statusAktif === 'aktif' ? 'Nonaktif Regu?' : 'Aktifkan Kembali?'
  confirmOptions.message = statusAktif === 'aktif' ? `Apakah Anda yakin ingin menonaktifkan data regu atas nama ${item?.nama_regu}?.` : setMessageWhenToActive() as string
  confirmOptions.confirmText = statusAktif === 'aktif' ? 'Nonaktif' : 'Aktif'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = statusAktif === 'aktif' ? 'error' : 'success'
  confirmOptions.confirmIcon = statusAktif === 'aktif' ? 'ri-eye-off-line' : 'ri-eye-line'
  confirmOptions.action = handleUpdateStatus

  showConfirmation.value = true 
  itemSelected.value = item
}

const handleDetailAnggota = async (item: AnggotaRegu) => {
  await masterWargaStore.fetchDetailWarga(item.nik)
}

const handleGetDropdownForAddAnggota = async () => {
  await dropdownStore.fetchWargaForAddAnggota()
}

const handleSubmitAddAnggota = async (params: { warga: string[] | null }) => {
  isFetchSuccess.value = false

  const { warga } = params

  const res = await masterReguStore.fetchAddAnggota({
    id_regu: itemSelected.value?.id as number,
    niks: warga as string[]
  })

  isFetchSuccess.value = true
  uiStore.showSuccess(res.message)

  await masterReguStore.fetchAnggotaRegu(itemSelected.value?.id as number)
}

onMounted(async () => {
  if(localStorage.getItem('from') && localStorage.getItem('from') === 'create-user') {
    showAnnouncement.value = true
  }

  if (masterReguStore.page) page.value = masterReguStore.page

  if (masterReguStore.page === 0) {
    await masterReguStore.fetchRegu({ limit: 10, page: page.value })
  }
})
</script>

<template>
  <div>
    <div class="mb-3">
      <h2>Data Regu</h2>
      <span class="text-body-2">Kelola data regu dan pengelompokan warga berdasarkan struktur yang ditentukan.</span>
    </div>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterRegu @show-form-data="handleShowFormData" @filter="handleFilter" @reset-all-anggota="handleResetAllAnggota" @reload="handleReload" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableRegu :data="masterReguStore.regu" :meta="masterReguStore.meta" :loading="masterReguStore.loading" :has-more="masterReguStore.hasMore" :has-filter="masterReguStore.hasFilter" @edit="handleEditData" @delete="handleShowConfirmDelData" @update-status="handleShowConfirmUpdateStatus" @show-anggota="handleShowAnggota" @load-more="handleLoadMore" />
      </VCol>
    </VRow>

    <DialogFormDataRegu :is-fetch-success="isFetchSuccess" :is-show="showFormData" :is-edit="isEdit" :item="itemSelected" :loading="masterReguStore.loading" @close="handleCloseFormData" @submit="isEdit ? handleUpdate($event) : handleSubmit($event)" />

    <DialogDataTableAnggota :is-show="showAnggota" :data="masterReguStore.anggotaRegu" :item="itemSelected" :loading="masterReguStore.loadingAnggota" :loading-dropdown-add-anggota="dropdownStore.loading.wargaForAddAnggota" :item-dropdown-add-anggota="dropdownStore.itemWargaForAddAnggota" :is-fetch-success="isFetchSuccess" :is-leader-available="masterReguStore.leaderAvailable" @close="handleCloseShowAnggota" @detail-anggota="handleDetailAnggota" @fetch-dropdown-add-anggota="handleGetDropdownForAddAnggota" @reset-anggota="handleResetAnggota" @submit-add-anggota="handleSubmitAddAnggota"  @set-leader="handleSetLeaderAnggota" />

    <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="confirmFrom === 'anggota' ? masterReguStore.loadingAnggota : masterReguStore.loading"
      @confirm="confirmOptions.action"
    />

    <AnnouncementDialog
      v-model="showAnnouncement"
      message="Pembuatan akun Ketua Regu hanya dapat dilakukan setelah data Regu baru berhasil dibuat. Ketika data Regu berhasil ditambahkan, sistem akan otomatis membuatkan akun Ketua Regu terkait."
      @close="showAnnouncement = false; showFormData = true"
    />
  </div>
</template>

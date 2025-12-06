<script setup lang="ts">
import DataTableRegu from '@/views/regu/DataTable.vue';
import DialogDataTableAnggotaRegu from '@/views/regu/DialogDataTableAnggota.vue';
import DialogFormDataRegu from '@/views/regu/DialogFormData.vue';
import FormFilterRegu from '@/views/regu/FormFilter.vue';

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

const itemSelected = ref<object | null>(null)

const handleEditData = (item: object) => {
  showFormData.value = true 
  isEdit.value = true
  itemSelected.value = item
}

const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)

async function deleteItem() {
  isLoadingConfirm.value = true

  // contoh request
  await new Promise(res => setTimeout(res, 1000))

  isLoadingConfirm.value = false
  showConfirmation.value = false

  console.log("Item dihapus!")
}

const confirmOptions = {
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
}

const handleDeleteData = (item: object) => {
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

const handleShowAnggota = (item: object) => {
  isLoadingGetAnggota.value = true

  setTimeout(() => {
    isLoadingGetAnggota.value = false
  }, 5000)
  
  showAnggota.value = true 
  itemSelected.value = item
}

const fromDialog = ref('')

const handleChangeLeaderAnggota = (item: object) => {
  fromDialog.value = 'data-table-anggota-regu'

  confirmOptions.title = 'Ganti Ketua Regu A?'
  confirmOptions.message = 'Apakah Anda yakin ingin mengganti ketua regu A yang sebelumnya atas nama Made Sovian ke Putu Agus?'
  confirmOptions.confirmText = 'Ganti'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'info'
  confirmOptions.confirmIcon = 'ri-save-2-line'

  showConfirmation.value = true 
  itemSelected.value = item
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

const handleDeleteDataAnggota = (item: object) => {
  fromDialog.value = 'data-table-anggota-regu'

  confirmOptions.title = 'Hapus Anggota?'
  confirmOptions.message = 'Apakah Anda yakin ingin menghapus data anggota Made Sovian dari regu A? Tindakan ini tidak dapat dibatalkan.'
  confirmOptions.confirmText = 'Hapus'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-delete-bin-line'

  showConfirmation.value = true 
  itemSelected.value = item
}

const handleSetLeaderAnggota = (item: object) => {
  fromDialog.value = 'data-table-anggota-regu'

  confirmOptions.title = 'Jadikan Ketua Regu?'
  confirmOptions.message = 'Apakah Anda yakin ingin menjadikan anggota Made Sovian sebagai ketua regu A?'
  confirmOptions.confirmText = 'Simpan'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'info'
  confirmOptions.confirmIcon = 'ri-save-2-line'

  showConfirmation.value = true 
  itemSelected.value = item
}
</script>

<template>
  <div>
    <h2 class="mb-3">Data Regu</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterRegu @show-form-data="showFormData = true" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableRegu @edit="handleEditData" @delete="handleDeleteData" @show-anggota="handleShowAnggota" />
      </VCol>
    </VRow>

    <DialogFormDataRegu :is-show="showFormData" :is-edit="isEdit" :item="itemSelected" @close="handleCloseFormData" />

    <DialogDataTableAnggotaRegu :is-show="showAnggota" :data="[]" :item="itemSelected" :is-loading="isLoadingGetAnggota" @close="handleCloseShowAnggota" @change-leader="handleChangeLeaderAnggota" @delete="handleDeleteDataAnggota" @set-leader="handleSetLeaderAnggota" />

    <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm"
      @confirm="deleteItem"
    />
  </div>
</template>

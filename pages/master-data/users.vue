<script setup lang="ts">
import DataTableUsers from '@/views/users/DataTable.vue';
import DialogFormDataUsers from '@/views/users/DialogFormData.vue';
import FormFilterUsers from '@/views/users/FormFilter.vue';

const showFormData = ref(false)
const isEdit = ref(false)

const handleCloseFormData = () => {
  if (isCreate.value) isCreate.value = false
  if (isEdit.value) isEdit.value = false
  if (isEditPassword.value) isEditPassword.value = false

  showFormData.value = false
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

const handleUpdateStatus = (item: object) => {
  confirmOptions.title = 'Nonaktif Warga?'
  confirmOptions.message = `Apakah Anda yakin ingin mengnonaktifkan data informasi iuran ${item?.nama}?.`
  confirmOptions.confirmText = 'Nonaktif'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-eye-off-line'

  showConfirmation.value = true 
  itemSelected.value = item
}

const isCreate = ref(false)

const handleCreate = () => {
  showFormData.value = true 
  isCreate.value = true
}

const isEditPassword = ref(false)

const handleEditPassword = (item: object) => {
  showFormData.value = true 
  isEditPassword.value = true
  itemSelected.value = item
}

</script>

<template>
  <div>
    <h2 class="mb-3">Data Pengguna</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterUsers @show-form-data="handleCreate" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableUsers @edit="handleEditData" @delete="handleDeleteData" @edit-password="handleEditPassword" />
      </VCol>
    </VRow>

    <DialogFormDataUsers :is-show="showFormData" :is-create="isCreate" :is-edit="isEdit" :is-edit-password="isEditPassword" :item="itemSelected" @close="handleCloseFormData" />

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

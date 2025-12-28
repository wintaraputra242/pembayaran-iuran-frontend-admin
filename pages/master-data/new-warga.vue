<script setup lang="ts">
import DataTableWarga from '@/views/warga/DataTable.vue';
import DialogFormDataWarga from '@/views/warga/DialogFormData.vue';
import FormFilterWarga from '@/views/warga/FormFilter.vue';

definePageMeta({
  middleware: ['admin']
})

const showFormData = ref(false)
const isEdit = ref(false)

const handleCloseFormData = () => {
  if (isEdit.value) isEdit.value = false

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

const handleUpdateStatus = (item: object) => {
  confirmOptions.title = 'Nonaktif Warga?'
  confirmOptions.message = `Apakah Anda yakin ingin mengnonaktifkan data warga atas nama ${item?.nama}?.`
  confirmOptions.confirmText = 'Nonaktif'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-eye-off-line'

  showConfirmation.value = true 
  itemSelected.value = item
}
</script>

<template>
  <div>
    <h2 class="mb-3">Data Warga</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterWarga @show-form-data="showFormData = true" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableWarga @edit="handleEditData" @delete="handleDeleteData" @update-status="handleUpdateStatus" />
      </VCol>
    </VRow>

    <DialogFormDataWarga :is-show="showFormData" :is-edit="isEdit" :item="itemSelected" @close="handleCloseFormData" />

    <!-- <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm"
      @confirm="deleteItem"
    /> -->
  </div>
</template>

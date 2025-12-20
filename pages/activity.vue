<script setup lang="ts">
import DataTableActivity from '@/views/activity/DataTable.vue';
import FormFilterActivity from '@/views/activity/FormFilter.vue';
import eCommerce2 from '@images/eCommerce/2.png';


definePageMeta({
  middleware: ['auth', 'admin']
})

const router = useRouter()

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

  // contoh request
  await new Promise(res => setTimeout(res, 1000))

  isLoadingConfirm.value = false
  showConfirmation.value = false

  showSuccessConfirm.value = true
}

const confirmOptions = {
  title: '',
  message: '',
  confirmText: '',  
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
}

const handleExportExcel = () => {
  confirmOptions.title = 'Export Data?'
  confirmOptions.message = 'Apakah Anda yakin ingin mengeksport data dari tanggal 12 juni 2025 sampai 19 februari 2026 dengan regu A?'
  confirmOptions.confirmText = 'Export'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'success'
  confirmOptions.confirmIcon = 'ri-export-line'

  showConfirmation.value = true 
  itemSelected.value = item
}

const showPaymentProof = ref(false)
const showSuccessConfirm = ref(false)
</script>

<template>
  <div>
    <h2 class="mb-3">Aktivitas</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterActivity @export-excel="handleExportExcel" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableActivity @show-bukti-bayar="showPaymentProof = true" />
      </VCol>
    </VRow>

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

    <PaymentProofImageDialog v-model="showPaymentProof" :src="eCommerce2" />
    
    <SuccessDialog v-model="showSuccessConfirm" title="Export Data Berhasil" message="File berupa Excel berhasil diunduh dan tersimpan di penyimpanan lokal Anda" />
  </div>
</template>

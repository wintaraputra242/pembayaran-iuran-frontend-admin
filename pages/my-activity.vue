<script setup lang="ts">
import DataTableActivity from '@/views/activity/DataTable.vue'

definePageMeta({
  middleware: ['role']
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

const filters = reactive({
  activity: ''
})
</script>

<template>
  <div>
    <div class="mb-4">
      <h2>Aktivitas Saya</h2>
      <span>Informasi terkait dengan aktivitas yang sudah pernah Anda lakukan sebelumnya</span>
    </div>
    <div class="py-3">
      <VTextField
        v-model="filters.activity"
        placeholder="Cari anggota regu Anda"
        prepend-inner-icon="ri-search-2-line"
      />
    </div>
    <DataTableActivity />
  </div>
</template>

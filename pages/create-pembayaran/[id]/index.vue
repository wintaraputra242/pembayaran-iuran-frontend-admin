<script setup lang="ts">
import DialogTakeFotoBuktiPembayaran from '@/views/create-pembayaran/DialogTakeFotoBuktiPembayaran.vue';
import FormCreatePembayaran from '@/views/create-pembayaran/FormCreatePembayaran.vue';

const tab = ref('kematian')

const filters = reactive({
  kematian: '',
  bulanan: '',
})

const showTakeFoto = ref(false)
const showSuccessConfirm = ref(false)

const handleSubmit = () => {
  showSuccessConfirm.value = true
}

const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)

const handleCloseSuccessDialog = () => {
  showSuccessConfirm.value = false

  confirmOptions.title = 'Ingin Menambah Pembayaran?'
  confirmOptions.message = 'Apakah Anda ingin menambahkan pembayaran baru lagi di Iuran A ini?'
  confirmOptions.confirmText = 'Ya'
  confirmOptions.cancelText = 'Tidak'
  confirmOptions.confirmColor = 'primary'
  confirmOptions.confirmIcon = 'ri-check-line'

  showConfirmation.value = true 
}

const confirmOptions = {
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
}

const deleteItem = () => {
  showConfirmation.value = false 
}
</script>

<template>
  <div class="mt-n5">
    <div class="mb-4">
      <div class="mb-3">
        <VBtn class="px-0 py-1" variant="text" size="large" to="/create-pembayaran">
          <VIcon icon="ri-arrow-left-s-line" class="me-2" />
          Keluar
        </VBtn>
      </div>
      <VChip size="small" :color="'info'" class="mb-1">
        {{ 'Bulanan' }}
      </VChip>
      <h2 class="mb-1">Iuran tahun 2025</h2>
      <p>Isi form berikut untuk membuat pembayaran baru.</p>
    </div>
    
    <FormCreatePembayaran @submit="showTakeFoto = true" />

    <DialogTakeFotoBuktiPembayaran :is-show="showTakeFoto" @close="showTakeFoto = false" @submit="handleSubmit" />

    <SuccessDialog v-model="showSuccessConfirm" title="Pembayaran Berhasil" message="Pembayaran Iuran A dengan warga atas nama A, berhasil dilakukan" @close="handleCloseSuccessDialog" />

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

<script setup lang="ts">
import DataTablePembayaran from '@/views/pembayaran/DataTable.vue';
import DialogFormDataPembayaran from '@/views/pembayaran/DialogFormData.vue';
import DialogHistoryPaymentWargaPembayaran from '@/views/pembayaran/DialogHistoryPaymentWarga.vue';
import DialogNoPaymentPembayaran from '@/views/pembayaran/DialogNoPayment.vue';
import FormFilterPembayaran from '@/views/pembayaran/FormFilter.vue';
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

const handleCloseShowHistoryPaymentWarga = () => {
  fromDialog.value = ''

  showHistoryPayment.value = false
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

  confirmOptions.title = 'Ganti Ketua Pembayaran A?'
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

const showPaymentProof = ref(false)

watch(() => showPaymentProof.value, (newVal) => {
  if (!newVal) {
    if (fromDialog.value && fromDialog.value === 'data-table-history-payment-warga') {
      showHistoryPayment.value = true
      return
    }

    fromDialog.value = ''
  }

  if (newVal) {
    if (fromDialog.value && fromDialog.value === 'data-table-history-payment-warga') {
      showHistoryPayment.value = false
      return
    }
  }
})

const showAnnouncement = ref(false)

const handleResetAllAnggota = () => {
  confirmOptions.title = 'Reset Semua Anggota?'
  confirmOptions.message = 'Apakah Anda yakin ingin me-reset semua anggota yang ada dimasing-masing regu? Tindakan ini tidak dapat dibatalkan.'
  confirmOptions.confirmText = 'Reset'
  confirmOptions.cancelText = 'Batal'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-user-community-line'

  showConfirmation.value = true 
}

const handleShowBuktiBayar = () => {
  showPaymentProof.value  = true
}

const showHistoryPayment = ref(false)

const handleHistoryPayment = (item: object) => {
  showHistoryPayment.value = true
}

const handleShowBuktiBayarHistoryPayment = () => {
  fromDialog.value = 'data-table-history-payment-warga'

  showPaymentProof.value = true
}

const showSuccessConfirm = ref(false)

const handleSendNotif = (type: string) => {
  fromDialog.value = type

  showSuccessConfirm.value = true
}

watch(() => showSuccessConfirm.value, (newVal) => {
  if (!newVal) {
    if (fromDialog.value && fromDialog.value === 'data-table-history-payment-warga') {
      console.log('masuk sini data-table-history-payment-warga');
      
      showHistoryPayment.value = true
      return
    }

    if (fromDialog.value && fromDialog.value === 'data-check-no-payment') {
      console.log('masuk sini data-check-no-payment');

      showNoPaymentList.value = true
      return
    }

    fromDialog.value = ''
  }

  if (newVal) {
    if (fromDialog.value && fromDialog.value === 'data-table-history-payment-warga') {
      console.log('masuk sini data-table-history-payment-warga true');

      showHistoryPayment.value = false
      return
    }

    if (fromDialog.value && fromDialog.value === 'data-check-no-payment') {
      console.log('masuk sini data-check-no-payment true');

      showNoPaymentList.value = false
      return
    }
  }
})

const showNoPaymentList = ref(false)

const handleShowNoPayment = () => {
  showNoPaymentList.value = true
}
</script>

<template>
  <div>
    <h2 class="mb-3">Pembayaran</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterPembayaran @show-form-data="router.push('/create-pembayaran')" @reset-all-anggota="handleResetAllAnggota" @show-no-payment="handleShowNoPayment" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTablePembayaran @edit="handleEditData" @delete="handleDeleteData" @show-anggota="handleShowAnggota" @show-bukti-bayar="handleShowBuktiBayar" @show-history-payment="handleHistoryPayment" />
      </VCol>
    </VRow>

    <DialogFormDataPembayaran :is-show="showFormData" :is-edit="isEdit" :item="itemSelected" @close="handleCloseFormData" />

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
    
    <DialogHistoryPaymentWargaPembayaran :is-show="showHistoryPayment" @close="handleCloseShowHistoryPaymentWarga" @show-bukti-bayar="handleShowBuktiBayarHistoryPayment" @send-notif="handleSendNotif('data-table-history-payment-warga')" />

    <!-- <SuccessDialog v-model="showSuccessConfirm" title="Kirim Notif Berhasil" message="Anda telah mengirim notifikasi terkait Iuran A, Iuran B, dan Iuran C ke warga atas nama I Nyoman Ari" /> -->
    <!-- <SuccessDialog v-model="showSuccessConfirm" title="Kirim Notif Berhasil" message="Anda telah mengirim notifikasi terkait Iuran A ke warga atas nama I Nyoman Ari" /> -->

    <!-- <SuccessDialog v-model="showSuccessConfirm" title="Kirim Notif Berhasil" message="Anda telah mengirim notifikasi ke semua warga yang belum membayar Iuran A" /> -->
    <SuccessDialog v-model="showSuccessConfirm" title="Kirim Notif Berhasil" message="Anda telah mengirim notifikasi ke warga atas nama A, karena belum membayar Iuran A" />

    <DialogNoPaymentPembayaran :is-show="showNoPaymentList" @close="showNoPaymentList = false" @send-notif="handleSendNotif('data-check-no-payment')" />
  </div>
</template>

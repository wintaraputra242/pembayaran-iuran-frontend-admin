<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'showFormData'): void;
  (e: 'showNoPayment'): void;
}>();

const filter = reactive({
  date: '',
  metode_bayar: null,
  status_bayar: null,
  jenis_iuran: null,
  regu: null,
  nama_warga: '',
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="() => {}">
        <VRow align="center">
          <VCol cols="12">
            <DatePicker
              v-model="filter.date"
              placeholder="Pilih rentang tgl. pembayaran"
              range
              :enable-time="false"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filter.metode_bayar"
              placeholder="Cari metode pembayaran"
              :items="['Tunai', 'QRIS', 'Transfer']"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filter.status_bayar"
              placeholder="Cari status pembayaran"
              :items="['Sudah Bayar', 'Belum Bayar']"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filter.jenis_iuran"
              placeholder="Cari jenis iuran"
              :items="['Bulanan', 'Kematian']"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filter.regu"
              placeholder="Cari status pembayaran"
              :items="['Regu A', 'Regu B', 'Regu C']"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="filter.nama_warga"
              placeholder="Cari nama warga yang bayar"
              prepend-inner-icon="ri-search-2-line"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn variant="flat" color="primary">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>
              <IconBtn variant="flat" color="primary" @click="emit('reload')">
                <VIcon icon="ri-restart-line" />
              </IconBtn>
              <VBtn variant="flat" color="success" @click="emit('showFormData')">
                <VIcon icon="ri-add-large-line" class="me-2" />
                Tambah Pembayaran
              </VBtn>
              <VBtn variant="flat" color="secondary" @click="emit('showNoPayment')">
                <VIcon icon="ri-list-check-2" class="me-2" />
                Cek Belum Bayar
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
</template>

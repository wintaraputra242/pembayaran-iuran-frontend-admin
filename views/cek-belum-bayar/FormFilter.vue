<script lang="ts" setup>
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay()
const showDialog = ref(false)

const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'showFormData'): void;
  (e: 'showNoPayment'): void;
  (e: 'filter', item: {
    date: [string, string] | string | null
    jenis_iuran: string | null
    metode_bayar: string | null
    status: string | null
    regu: string | null
    nama_warga: string | null
  }): void;
}>();

const filters = reactive({
  date: '',
  metode_bayar: null,
  status: null,
  jenis_iuran: null,
  regu: null,
  nama_warga: '',
})

const handleReload = () => {
  filters.date = '',
  filters.metode_bayar = null,
  filters.status = null,
  filters.jenis_iuran = null,
  filters.regu = null,
  filters.nama_warga = '',

  emit('reload')
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="emit('filter', filters); showDialog = false">
        <VRow align="center">
          <template v-if="!smAndDown">
            <VCol cols="12" md="4">
              <DatePicker
                v-model="filters.date"
                placeholder="Rentang tanggal bayar"
                range
                :enable-time="false"
              />
            </VCol>
  
            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.jenis_iuran"
                placeholder="Jenis iuran"
                :items="['Bulanan', 'Kematian']"
                clearable
              />  
            </VCol>
  
            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.metode_bayar"
                placeholder="Metode pembayaran"
                :items="['Tunai', 'QRIS', 'Transfer']"
                clearable
              />
            </VCol>
  
            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.status"
                placeholder="Status pembayaran"
                :items="['Sudah Bayar', 'Belum Bayar']"
                clearable
              />
            </VCol>
  
            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.regu"
                placeholder="Regu"
                :items="['Regu A', 'Regu B', 'Regu C']"
                clearable
              />
            </VCol>
  
            <VCol cols="12" md="4">
              <VTextField
                v-model="filters.nama_warga"
                placeholder="Cari nama warga"
                prepend-inner-icon="ri-search-2-line"
                clearable
              />
            </VCol>
          </template>

          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                v-if="smAndDown"
                color="primary"
                @click="showDialog = true"
              >
                <VIcon icon="ri-filter-3-line" class="me-2" />
                Filter
              </VBtn>

              <VBtn v-else type="submit" variant="flat" color="primary">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>

              <IconBtn
                variant="flat"
                color="primary"
                @click="handleReload"
              >
                <VIcon icon="ri-restart-line" />
              </IconBtn>

              <VBtn
                variant="flat"
                color="success"
                @click="emit('showFormData')"
              >
                <VIcon icon="ri-add-large-line" class="me-2" />
                Tambah Pembayaran
              </VBtn>

              <VBtn
                variant="flat"
                color="secondary"
                @click="emit('showNoPayment')"
              >
                <VIcon icon="ri-list-check-2" class="me-2" />
                Cek Belum Bayar
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>

  <VDialog
    v-model="showDialog"
  >
    <VCard>
      <VCardTitle class="pt-3 position-sticky top-0" style="background-color: #fff !important; z-index: 10;">
        <div class="d-flex align-center justify-space-between">
          <h3>Filter</h3>
          <IconBtn variant="text" color="secondary" size="small" @click="showDialog = false">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>

      <VCardItem>
        <VForm @submit.prevent="emit('filter', filters); showDialog = false">
          <VRow align="center">
            <VCol cols="12" md="4">
              <DatePicker
                v-model="filters.date"
                placeholder="Rentang tanggal bayar"
                range
                :enable-time="false"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.jenis_iuran"
                placeholder="Jenis iuran"
                :items="['Bulanan', 'Kematian']"
                clearable
              />  
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.metode_bayar"
                placeholder="Metode pembayaran"
                :items="['Tunai', 'QRIS', 'Transfer']"
                clearable
              />
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.status"
                placeholder="Status pembayaran"
                :items="['Sudah Bayar', 'Belum Bayar']"
                clearable
              />
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="filters.regu"
                placeholder="Regu"
                :items="['Regu A', 'Regu B', 'Regu C']"
                clearable
              />
            </VCol>

            <VCol cols="12" md="4">
              <VTextField
                v-model="filters.nama_warga"
                placeholder="Cari nama warga"
                prepend-inner-icon="ri-search-2-line"
                clearable
              />
            </VCol>

            <VCol cols="12">
              <div class="d-flex flex-wrap gap-2">
                <VBtn
                  v-if="smAndDown"
                  block
                  color="primary"
                  class="mb-3"
                  type="submit"
                >
                  <VIcon icon="ri-search-line" class="me-2" />
                  Filter
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

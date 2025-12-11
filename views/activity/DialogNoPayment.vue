<script lang="ts" setup>

const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'close'): void;
  (e: 'showBuktiBayar'): void;
  (e: 'sendNotif'): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  item?: object | null
}>(), {
  isShow: false,
  item: () => ({
    nama_warga: '',
    regu: '',
  })
})

const handleClose = () => {
  emit('close')
}

const tab = ref('history')

const isLoading = ref(false)

const dataDummy = [
  {
    id: 1,
    nama_warga: "I Wayan Sudarma",
    regu: "Regu 1",
    jumlah_iuran: 20000
  },
  {
    id: 2,
    nama_warga: "Ni Komang Ayu Sulastri",
    regu: "Regu 2",
    jumlah_iuran: 20000
  },
  {
    id: 3,
    nama_warga: "I Made Adi Putra",
    regu: "Regu 1",
    jumlah_iuran: 20000
  },
  {
    id: 4,
    nama_warga: "I Ketut Arya Wiguna",
    regu: "Regu 3",
    jumlah_iuran: 20000
  },
  {
    id: 5,
    nama_warga: "Ni Luh Eka Pratiwi",
    regu: "Regu 2",
    jumlah_iuran: 20000
  }
];


const statusChipsColor = {
  'pending': 'info',
  'success': 'success',
  'failed': 'error',
  'expired': 'secondary',
  'cancelled': 'secondary',
}

const filters = reactive({
  informasi_iuran: null
})
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard class="position-relative">
      <VCardTitle class="pt-3 position-sticky top-0" style="background-color: #fff !important; z-index: 10;">
        <div class="d-flex align-center justify-space-between">
          <h3>Cek Belum Bayar</h3>
          <IconBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardItem>
        <div class="mb-5">
          <VAutocomplete
            v-model="filters.informasi_iuran"
            placeholder="Pilih informasi iuran"
            :items="['Informasi Iuran A', 'Informasi Iuran B', 'Informasi Iuran C']"
            clearable
            class="mb-1"
          ></VAutocomplete>
          <span class="text-caption">Pilih informasi iuran terlebih dahulu untuk menampilkan daftar warga yang belum melakukan pembayaran.</span>
        </div>

        <div v-if="filters.informasi_iuran" class="mb-3 d-flex justify-end" @click="emit('sendNotif')">
          <VBtn variant="flat" color="info">
            <VIcon icon="ri-bell-line" class="me-2" />
            Kirim Notif
          </VBtn>
        </div>

        <p v-if="!filters.informasi_iuran" class="ma-0 text-center font-weight-bold">Cari informasi iuran terlebih dahulu</p>
        <VTable v-else fixed-header height="400px" class="my-table">
          <thead>
            <tr>
              <th style="width: 70px;">No.</th>
              <th style="width: 250px;">Nama Warga</th>
              <th style="width: 200px">Regu</th>
              <th style="width: 180px;">Jml. Iuran</th>
              <th style="width: 80px;"></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, i) in dataDummy" :key="item.id">
              <td>{{ i + 1 }}</td>
              <td>{{ item.nama_warga }}</td>
              <td>{{ item.regu }}</td>
              <td>{{ formatRupiah(item.jumlah_iuran) }}</td>
              <td>
                <div class="d-flex justify-center">
                  <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('sendNotif')">
                    <VIcon icon="ri-bell-line" />
                  </IconBtn>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

<style>
.dropzone {
  width: 100%;
  padding: 30px;
  border: 2px dashed #888;
  border-radius: 10px;
  text-align: center;
}
</style>

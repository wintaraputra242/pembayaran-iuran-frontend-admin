<script lang="ts" setup>
const props = withDefaults(defineProps<{
  isShow: boolean
  item?: object | null
}>(), {
  isShow: false,
  item: () => ({
    nama_warga: '',
    regu: '',
  }),
})

const emit = defineEmits<{
  (e: 'reload'): void
  (e: 'close'): void
  (e: 'showBuktiBayar'): void
  (e: 'sendNotif', item: any): void
  (e: 'sendNotifAll', informasiIuranId: number | string): void
}>()

const handleClose = () => {
  emit('close')
}

const isLoading = ref(false)

const filters = reactive({
  informasi_iuran: null,
})

const informasiIuranOptions = ref([
  { id: 1, judul_iuran: 'Iuran Bulanan Januari' },
  { id: 2, judul_iuran: 'Iuran Bulanan Februari' },
  { id: 3, judul_iuran: 'Iuran Kematian A' },
])

const dataList = ref<any[]>([])
</script>

<template>
  <VDialog
    :model-value="props.isShow"
    max-width="900"
    @update:model-value="emit('close')"
  >
    <VCard class="position-relative">
      <!-- HEADER -->
      <VCardTitle
        class="pt-3 position-sticky top-0"
        style="background-color: #fff; z-index: 10;"
      >
        <div class="d-flex align-center justify-space-between">
          <h3>Cek Belum Bayar</h3>
          <IconBtn
            variant="text"
            color="secondary"
            size="small"
            @click="handleClose"
          >
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>

      <VCardItem>
        <!-- FILTER IURAN -->
        <div class="mb-5">
          <VAutocomplete
            v-model="filters.informasi_iuran"
            placeholder="Pilih informasi iuran"
            :items="informasiIuranOptions"
            item-title="judul_iuran"
            item-value="id"
            clearable
            class="mb-1"
          />

          <span class="text-caption">
            Pilih informasi iuran terlebih dahulu untuk menampilkan daftar warga
            yang belum melakukan pembayaran.
          </span>
        </div>

        <!-- ACTION -->
        <div
          v-if="filters.informasi_iuran && dataList.length"
          class="mb-3 d-flex justify-end"
        >
          <VBtn
            variant="flat"
            color="info"
            @click="emit('sendNotifAll', filters.informasi_iuran)"
          >
            <VIcon
              icon="ri-bell-line"
              class="me-2"
            />
            Kirim Notif ke Semua
          </VBtn>
        </div>

        <!-- EMPTY STATE -->
        <p
          v-if="!filters.informasi_iuran"
          class="ma-0 text-center font-weight-bold"
        >
          Pilih informasi iuran terlebih dahulu
        </p>

        <!-- TABLE -->
        <VTable
          v-else
          fixed-header
          height="400px"
          class="my-table"
        >
          <thead>
            <tr>
              <th style="width: 70px;">
                No.
              </th>
              <th style="width: 250px;">
                Nama Warga
              </th>
              <th style="width: 200px;">
                Regu
              </th>
              <th style="width: 180px;">
                Jumlah Iuran
              </th>
              <th style="width: 80px;" />
            </tr>
          </thead>

          <tbody>
            <!-- DATA -->
            <tr
              v-for="(item, i) in dataList"
              :key="item.id"
            >
              <td>{{ i + 1 }}</td>
              <td>{{ item.nama_warga }}</td>
              <td>{{ item.regu }}</td>
              <td>{{ formatRupiah(item.jumlah_iuran) }}</td>
              <td>
                <div class="d-flex justify-center">
                  <IconBtn
                    variant="outlined"
                    class="rounded-lg"
                    size="small"
                    color="secondary"
                    @click="emit('sendNotif', item)"
                  >
                    <VIcon icon="ri-bell-line" />
                  </IconBtn>
                </div>
              </td>
            </tr>

            <!-- LOADING -->
            <tr v-if="isLoading">
              <td
                colspan="5"
                class="text-center py-3"
              >
                <VProgressCircular
                  indeterminate
                  size="26"
                />
              </td>
            </tr>

            <!-- EMPTY DATA -->
            <tr v-if="!isLoading && !dataList.length">
              <td
                colspan="5"
                class="text-center py-3"
              >
                Semua warga sudah melakukan pembayaran 🎉
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

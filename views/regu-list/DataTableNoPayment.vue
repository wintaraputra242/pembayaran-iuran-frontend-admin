<script setup lang="ts">

const emit = defineEmits<{
  (e: 'setLeader', item: object): void;
  (e: 'changeLeader', item: object): void;
  (e: 'delete', item: object): void;
  (e: 'close'): void;
  (e: 'resetAnggota', items: object[]): void;
}>();

const props = withDefaults(defineProps<{
  data?: object[] | null
  item?: object | null
  isLoading?: boolean
}>(), {
  data: () => ([]),
  item: () => ({}),
  isLoading: false,
})

const handleClose = () => {
  tab.value = 'table'

  emit('close')
}

const dataDummy = [
  {
    id: 1,
    nama: "I Wayan Sudarma",
    no_hp: "081234567890",
    status: "Anggota",
  },
  {
    id: 2,
    nama: "I Made Adi Putra",
    no_hp: "081239998877",
    status: "Anggota",
  },
  {
    id: 3,
    nama: "Ni Luh Ayu Sulastri",
    no_hp: "082155443322",
    status: "Anggota",
  },
  {
    id: 4,
    nama: "I Ketut Dwi Arta",
    no_hp: "087812345678",
    status: "Anggota",
  },
  {
    id: 5,
    nama: "Ni Kadek Mirah Santi",
    no_hp: "081333221144",
    status: "Anggota",
  },
  {
    id: 6,
    nama: "I Putu Gede Pratama",
    no_hp: "081778899110",
    status: "Anggota",
  },
  {
    id: 7,
    nama: "Ni Komang Sari Dewi",
    no_hp: "082144332211",
    status: "Anggota",
  },
  {
    id: 8,
    nama: "I Nyoman Surya",
    no_hp: "087766554433",
    status: "Anggota",
  },
  {
    id: 9,
    nama: "Ni Ketut Ayu Pertiwi",
    no_hp: "081200334455",
    status: "Anggota",
  },
  // {
  //   id: 10,
  //   nama: "I Made Yoga Saputra",
  //   no_hp: "081777666555",
  //   status: "Anggota",
  // },
]

const checkLeaderIsAvailable = dataDummy.filter((item, i) => item.status === 'Ketua Regu').length > 0

const tab = ref('table')

const defaultParamsAddAnggota = {
  warga: null,
}
const params = reactive({...defaultParamsAddAnggota})

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  warga: (v: string) => {
    if (!v) return "Pilih Warga wajib diisi"
    return true
  },
}

const dropdownItemsWarga = dataDummy.map((item, i) => item.nama)

const itemSelected = ref<object | null>(null)

const handleDetailAnggota = (item: object) => {
  tab.value = 'detail-warga'

  itemSelected.value = item
}

const btnTabStyle: any = {
  table: {
    color: 'success',
    action: () => { tab.value = 'form' },
    icon: 'ri-add-line',
    content: 'Tambah Anggota',
  },
  form: {
    color: 'secondary',
    action: () => { tab.value = 'table' },
    icon: 'ri-close-line',
    content: 'Batal',
  },
  'detail-warga': {
    color: 'secondary',
    action: () => { tab.value = 'table' },
    icon: 'ri-arrow-left-s-line',
    content: 'Kembali',
  },
}

const dataDummyNoPayment = [
  {
    id: 1,
    judul_iuran: "Iuran Kebersihan Bulanan",
    jenis_iuran: "Bulanan",
    tgl_buat: "2025-01-10",
    jumlah_iuran: 20000,
  },
  {
    id: 2,
    judul_iuran: "Iuran Piodalan",
    jenis_iuran: "Insidental",
    tgl_buat: "2025-01-05",
    jumlah_iuran: 50000,
  },
  {
    id: 3,
    judul_iuran: "Iuran Kegiatan Pecalang",
    jenis_iuran: "Kegiatan",
    tgl_buat: "2025-02-01",
    jumlah_iuran: 30000,
  },
  {
    id: 4,
    judul_iuran: "Iuran Perbaikan Balai Banjar",
    jenis_iuran: "Perbaikan",
    tgl_buat: "2025-02-15",
    jumlah_iuran: 100000,
  },
  {
    id: 5,
    judul_iuran: "Iuran Suka Duka",
    jenis_iuran: "Sosial",
    tgl_buat: "2025-03-01",
    jumlah_iuran: 25000,
  }
];
</script>

<template>
  <VCard class="pa-0">
    <VCardItem class="pa-2">
      <div
        class="table-scroll-wrapper"
      >
        <VTable fixed-header height="400px" class="my-table mt-3">
          <thead>
            <tr>
              <th style="width: 70px;">No.</th>
              <th style="width: 250px;">Judul Iuran</th>
              <th class="text-center" style="width: 150px">Jenis Iuran</th>
              <th style="width: 180px;">Tgl. Buat</th>
              <th style="width: 180px;">Jml. Iuran</th>
              <th style="width: 80px;"></th>
            </tr>
          </thead>
  
          <tbody>
            <tr v-for="(item, i) in dataDummyNoPayment" :key="item.id">
              <td>{{ i + 1 }}</td>
              <td>{{ item.judul_iuran }}</td>
              <td align="center">
                <!-- <VChip :color="'info'">
                  Bulanan
                </VChip> -->
                <VChip :color="'error'">
                  Kematian
                </VChip>
              </td>
              <td>{{ formatDateID(item.tgl_buat) }}</td>
              <td>{{ formatRupiah(item.jumlah_iuran) }}</td>
              <td>
                <div class="d-flex justify-center">
                  <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('sendNotif')">
                    <VIcon icon="ri-bell-line" />
                  </IconBtn>
                </div>
              </td>
            </tr>
  
            <!-- Loading -->
            <tr v-if="isLoading">
              <td colspan="7" rowspan="2" class="text-center py-3">
                <VProgressCircular indeterminate size="26" />
              </td>
            </tr>
          </tbody>
        </VTable>
      </div>
    </VCardItem>
  </VCard>
</template>

<style scoped>
/* .table-scroll-wrapper {
  max-height: 400px;   
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
} */
</style>

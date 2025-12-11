<script lang="ts" setup>
import qris from '@/assets/images/pages/qris.png';

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'reload'): void;
  (e: 'close'): void;
}>();

// const props = withDefaults(defineProps<{
//   isShow: boolean
//   isEdit: boolean
//   item?: object | null
// }>(), {
//   isShow: false,
//   isEdit: false,
// })

const form = ref(null)

const defaultParams = {
  warga: null,
  bulan: [],
  metode_bayar: null
}
const params = reactive({...defaultParams})

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  warga: (v: string) => {
    if (!v) return "Pilih Warga wajib diisi"
    return true
  },

  bulan: (v: string) => {
    if (!v) return "Pilih Bulan wajib diisi"
    return true
  },

  metode_bayar: (v: string) => {
    if (!v) return "Metode Pembayaran wajib dipilih"
    return true
  },
}

const currentYear = new Date().getFullYear()

const years = Array.from({ length: 31 }, (_, i) => (currentYear + i).toString())

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

const dropdownItemsWarga = dataDummy.map((item, i) => item.nama)

watch(() => params.warga, (newVal) => {
  if (!params.warga) {
    params.metode_bayar = null
    return
  }

  if (Array.isArray(params.warga) && params.warga?.length === 0) {
    params.metode_bayar = null
    return
  }
})

// const nominal = ref(40000)
const nominal = ref(5000)
const total = ref(0)

watch(() => params.metode_bayar, (newVal) => {
  if (newVal === 'QRIS') {
    total.value += 1000
    
  }

  total.value = nominal.value
})

watch(() => params.bulan, (newVal) => {
  total.value = 5000
  nominal.value = 5000
  
  if (newVal && Array.isArray(newVal) && newVal?.length === 2) {
    for(let i = newVal[0]?.month; i < newVal[1]?.month; i++) {
      nominal.value += 5000
    }

    total.value = nominal.value

    if (params.metode_bayar === 'QRIS') total.value += 1000

    return
  }
})

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm ref="form" @submit.prevent="emit('submit')">
        <VRow align="center" class="pt-1">
          <VCol cols="12">
            <VAutocomplete
              v-model="params.warga"
              placeholder="Pilih warga yang ingin dijadikan anggota"
              clearable
              :items="dropdownItemsWarga"
            >
              <template v-slot:item="{ props: itemProps, item }">
                <VListItem v-bind="itemProps" :subtitle="'Regu A'">
                  <!-- <template #prepend>
                    <VCheckbox v-model="params.warga" v-bind="itemProps" class="mr-2" />
                  </template> -->
                </VListItem>
              </template>
            </VAutocomplete>
          </VCol>
          <VCol cols="12">
            <DatePicker
              v-model="params.bulan"
              placeholder="Pilih rentang tgl. pembayaran"
              range
              month-picker
              format="MM/yyyy"
              :disabled-dates="[new Date('2025-01'), new Date('2025-02'), new Date('2025-03')]"
              :show-date-picker="false"
              :disabled="!params.warga"
              clearable
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="params.metode_bayar"
              placeholder="Masukkan metode pembayaran"
              :items="['QRIS', 'Tunai']"
              :rules="[rules.metode_bayar]"
              :disabled="!params.warga"
            >
              <template v-slot:item="{ props: itemProps, item }">
                <VListItem v-bind="itemProps" :prepend-avatar="item.raw === 'QRIS' ? qris : ''" :prepend-icon="item.raw === 'Tunai' ? 'ri-cash-line' : ''">
                  <template #prepend>
                    <VImg v-if="item.raw === 'QRIS'" :src="qris" width="24px" alt="qris logo" class="me-3" />
                    <VIcon v-if="item.raw === 'Tunai'" icon="ri-cash-line" />
                  </template>
                </VListItem>
              </template>
            </VSelect>
          </VCol>
          <VCol cols="12">
            <VDivider class="mb-3" />
            <div class="text-end">
              <!-- bulanan -->
              <p v-if="params.bulan?.length === 2" class="ma-0 text-body-2">{{ months[params.bulan[0]?.month] }} - {{ months[params.bulan[1]?.month] }} : {{ formatRupiah(nominal) }}</p>
              <!-- /bulanan -->
              <!-- qris -->
              <p v-if="params.metode_bayar === 'QRIS'" class="ma-0 text-body-2">Admin : {{ formatRupiah(1000) }}</p>
              <!-- /qris -->
              <h3 class="ma-0">Total : {{ formatRupiah(total) }}</h3>
            </div>
            <VDivider class="mt-3" />
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-end flex-wrap gap-2">
              <VBtn variant="flat" block color="success" type="submit">
                Tambah Pembayaran
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
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

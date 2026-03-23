<script lang="ts" setup>
import qris from '@/assets/images/pages/qris.png';
import type { WargaPembayaranForDropdown } from '@/types/api/dropdown';
import type { MasterInformasiIuran } from '@/types/api/master-informasi-iuran';

const emit = defineEmits<{
  (
    e: 'submit', 
    params: {
      total: number | null,
      warga: string | null,
      bulan: {month: number, year: number}[] | null,
      metode_bayar: string | null
      bukti_pembayaran: File | null
    }): void;
  (e: 'reload'): void;
  (e: 'close'): void;
  (e: 'getMonthPaid', item: string | null): void;
}>();

const props = withDefaults(defineProps<{
  item: MasterInformasiIuran | null
  isLoadingDropdownWarga: boolean
  dropdownWargaOptions: WargaPembayaranForDropdown[] | null
  monthPaidWarga?: number[] | string[]
  loadingMonthPaidWarga?: boolean
  loadingSubmit: boolean
  isClearForm: boolean
}>(), {
  isLoadingDropdownWarga: false,
  dropdownWargaOptions: null,
  item: null,
  isClearForm: false
})

const form = ref()
const dateRef = ref()

const defaultParams = {
  warga: null,
  bulan: [],
  metode_bayar: null
}
const params = reactive({...defaultParams})

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  warga: (v: string) => {
    if (!v) return "Warga yang Membayar wajib diisi"
    return true
  },

  bulan: (v: string | string[]) => {
    if (!v || v.length === 0) return "Bulan Pembayaran wajib diisi"
    return true
  },

  metode_bayar: (v: string) => {
    if (!v) return "Metode Pembayaran wajib dipilih"
    return true
  },
}

const currentYear = new Date().getFullYear()

const years = Array.from({ length: 31 }, (_, i) => (currentYear + i).toString())

const isClearErrorMessageDatePicker = ref(false)

watch(() => params.warga, (newVal) => {
  if (!params.warga) {
    params.metode_bayar = null
    params.bulan = []
    buktiPembayaran.value = null
    isErrorSubmit.value = false
    isClearErrorMessageDatePicker.value = true
    return
  }

  // if (Array.isArray(params.warga) && params.warga?.length === 0) {
  //   params.metode_bayar = null
  //   params.bulan = []
  //   buktiPembayaran.value = null
  //   return
  // }
})

const disableDates = ref<Date[]>([])

watch(() => props.monthPaidWarga, (newVal) => {
  if (newVal && newVal.length > 0) {
    disableDates.value = []

    const date = new Date()
    newVal.forEach((val: number | string) => {
      disableDates.value.push(new Date(date.getFullYear() + '-0' + val))
    }) 

    return
  }

  disableDates.value = []
})

// const nominal = ref(40000)
const total = ref(0)
const adminFee = ref(0)

// watch(() => params.metode_bayar, (newVal) => {
//   if (newVal === 'qris') {
//     total.value += 1000
    
//   }

//   total.value = nominal.value
// })

// watch(() => params.bulan, (newVal) => {
//   total.value = 5000
//   nominal.value = 5000
  
//   if (newVal && Array.isArray(newVal) && newVal?.length === 2) {
//     for(let i = newVal[0]?.month; i < newVal[1]?.month; i++) {
//       nominal.value += 5000
//     }

//     total.value = nominal.value

//     if (params.metode_bayar === 'qris') total.value += 1000

//     return
//   }
// })

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

const setAdminFeeByQris = (amount: number): number => {
  return Math.round(amount * 0.007)
}

const calculateMonthRangeTotal = (
  monthRange: { month: number }[],
  pricePerMonth: number
): number => {
  if (!monthRange || monthRange.length !== 2) return 0

  const startMonth = monthRange[0].month
  const endMonth = monthRange[1].month

  const totalMonths = endMonth - startMonth + 1

  if (totalMonths <= 0) return 0

  return totalMonths * pricePerMonth
}

const setTotalFee = (
  monthRange?: { month: number }[] | null,
  pricePerMonth?: number
) => {
  let subtotal = 0
  if (monthRange && pricePerMonth) {
    subtotal = calculateMonthRangeTotal(monthRange, pricePerMonth)
  } else {
    subtotal = pricePerMonth as number
  }

  if (params.metode_bayar === 'qris') {
    adminFee.value = setAdminFeeByQris(monthRange && monthRange.length > 0 ? subtotal as number : pricePerMonth as number)
  } else {
    adminFee.value = 0
  }

  if (!subtotal && !adminFee.value) {
    total.value = pricePerMonth as number
    return
  }

  if (props.item?.jenis_iuran === 'kematian') subtotal = pricePerMonth as number

  total.value = subtotal + adminFee.value
}

watch(() => props.item, (newVal) => {
  setTotalFee(null, newVal?.jumlah_iuran)
}, { immediate: true })

watch(() => props.isClearForm, (newVal) => {
  if (newVal) {
    form.value.reset()
    buktiPembayaran.value = null
  }
})

watch(() => params.bulan, (newVal) => {
  if (newVal) {
    setTotalFee(newVal, props.item?.jumlah_iuran)
    return
  }
  setTotalFee(params.bulan, props.item?.jumlah_iuran)
})

watch(() => params.metode_bayar, (newVal) => {
  if (newVal === 'qris') {
    setTotalFee(params.bulan, props.item?.jumlah_iuran)
    return
  }
  setTotalFee(params.bulan, props.item?.jumlah_iuran)
})

const isSubmit = ref(false)

const isErrorSubmit = ref(false)
const buktiPembayaran = ref<File | null>(null)

const handleSubmit = async () => {
  isSubmit.value = true

  const { valid: formValid } = await form.value.validate()

  if (params.metode_bayar === 'tunai' && !buktiPembayaran.value) isErrorSubmit.value = true

  if (!formValid || (params.metode_bayar === 'tunai' && !buktiPembayaran.value)) return 

  const newParams = {
    total: total.value,
    ...params
  }

  emit('submit', { ...newParams, bukti_pembayaran: buktiPembayaran.value })
}

const handleWarga = () => {
  if (!params.warga) return

  emit('getMonthPaid', params.warga)
}

watch(() => buktiPembayaran.value, (newVal) => {
  // console.log(newVal)
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm ref="form" @submit.prevent="handleSubmit">
        <VRow align="center" class="pt-1">
          <VCol cols="12">
            <VAutocomplete
              v-model="params.warga"
              placeholder="Pilih warga"
              clearable
              item-title="nama_warga"
              item-value="nik"
              :loading="isLoadingDropdownWarga"
              :items="(dropdownWargaOptions as WargaPembayaranForDropdown[])"
              :rules="[rules.warga]"
              @update:model-value="handleWarga"
            >
              <template v-slot:item="{ props: itemProps, item }">
                <VListItem v-bind="itemProps" :subtitle="(item.raw.regu as string) || '-'">
                </VListItem>
              </template>
            </VAutocomplete>
          </VCol>
          <VCol v-if="item?.jenis_iuran === 'bulanan'" cols="12">
            <DatePicker
              v-model="params.bulan"
              placeholder="Pilih rentang bulan"
              range
              month-picker
              format="MMMM"
              :disabled-dates="disableDates"
              :show-date-picker="false"
              :disabled="!params.warga && !loadingMonthPaidWarga"
              clearable
              :rules="[rules.bulan]"
              :is-submit="isSubmit"
              :is-clear-message="isClearErrorMessageDatePicker"
              @clear-error-message="isClearErrorMessageDatePicker = false"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="params.metode_bayar"
              placeholder="Masukkan metode pembayaran"
              :items="[
                {label: 'QRIS', value: 'qris'},
                {label: 'Tunai', value: 'tunai'},
              ]"
              item-title="label"
              item-value="value"
              :rules="[rules.metode_bayar]"
              :disabled="!params.warga"
              clearable
            >
              <template v-slot:item="{ props: itemProps, item }">
                <VListItem v-bind="itemProps" :prepend-avatar="item.raw.value === 'qris' ? qris : ''" :prepend-icon="item.raw.value === 'tunai' ? 'ri-cash-line' : ''">
                  <template #prepend>
                    <VImg v-if="item.raw.value === 'qris'" :src="qris" width="24px" alt="qris logo" class="me-3" />
                    <VIcon v-if="item.raw.value === 'tunai'" icon="ri-cash-line" />
                  </template>
                </VListItem>
              </template>
            </VSelect>
          </VCol>
          <VCol v-if="params.metode_bayar === 'tunai'" cols="12">
            <CameraUpload
              v-model="buktiPembayaran"
              :is-error-submit="isErrorSubmit"
              :rules="[
                v => !!v || 'Foto Bukti Pembayaran wajib diupload',
              ]"
            />
          </VCol>
          <VCol cols="12">
            <VDivider class="mb-3" />
            <div class="text-end">
              <p class="ma-0 text-body-2">Biaya Iuran : <strong>{{ formatRupiah(item?.jumlah_iuran as number) }}</strong></p>
              <!-- bulanan -->
              <p v-if="params.bulan?.length === 2" class="ma-0 text-body-2">{{ months[params.bulan[0]?.month] }} - {{ months[params.bulan[1]?.month] }} : <strong>{{ formatRupiah(calculateMonthRangeTotal(params.bulan, item?.jumlah_iuran as number)) }}</strong></p>
              <!-- /bulanan -->
              <!-- qris -->
              <p v-if="params.metode_bayar === 'qris'" class="ma-0 text-body-2">Biaya Admin : <strong>{{ formatRupiah(adminFee) }}</strong></p>

              <div class="d-flex justify-end py-2">
                <VDivider style="max-width: 150px" />
              </div>

              <!-- /qris -->
              <h3 class="ma-0">Total : {{ formatRupiah(total) }}</h3>
            </div>
            <VDivider class="mt-3" />
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-end flex-wrap gap-2">
              <VBtn variant="flat" block color="success" type="submit" :loading="loadingSubmit">
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

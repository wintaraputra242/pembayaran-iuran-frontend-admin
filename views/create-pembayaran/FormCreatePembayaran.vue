<script lang="ts" setup>
import { useApi } from '@/composables/api/useApi';
import type { WargaPembayaranForDropdown } from '@/types/api/dropdown';
import type { MasterInformasiIuran } from '@/types/api/master-informasi-iuran';

const emit = defineEmits<{
  (e: 'submit', params: {
    total: number | null
    warga: string | null
    bulan: { month: number, year: number }[] | null
    metode_bayar: string | null
    bukti_pembayaran: File | null
  }): void
  (e: 'reload'): void
  (e: 'close'): void
  (e: 'getMonthPaid', item: string | null): void
}>()

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
  isClearForm: false,
})

const pembayaranStore = usePembayaranStore()

const form = ref()
const showQrisDialog = ref(false)
const isErrorSubmit = ref(false)
const isSubmit = ref(false)
const buktiPembayaran = ref<File | null>(null)

const defaultParams = {
  warga: null as string | null,
  bulan: [] as number[],
  metode_bayar: null as string | null,
}
const params = reactive({ ...defaultParams })

const rules = {
  warga: (v: string) => !!v || 'Warga yang Membayar wajib diisi',
  bulan: (v: string | string[]) => {
    if (!v || v.length === 0) return 'Bulan Pembayaran wajib diisi'
    return true
  },
  metode_bayar: (v: string) => !!v || 'Metode Pembayaran wajib dipilih',
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const monthsWithStatus = computed(() => {
  const paidMonths = (props.monthPaidWarga ?? []).map(Number) // ✅ convert string → number

  return months.map((label, index) => {
    const monthNumber = index + 1
    return {
      label,
      value: monthNumber,
      isPaid: paidMonths.includes(monthNumber),
    }
  })
})

const disableDates = ref<Date[]>([])

// watch(() => props.monthPaidWarga, (newVal) => {
//   if (newVal && newVal.length > 0) {
//     // Auto-select bulan yang sudah dibayar (tampil as disabled chip)
//     params.bulan = newVal.map(Number)
//   } else {
//     params.bulan = []
//   }
// })

watch(() => params.warga, (newVal) => {
  if (!newVal) {
    params.metode_bayar = null
    params.bulan = []  // ✅ pastikan ini ada
    buktiPembayaran.value = null
    isErrorSubmit.value = false
  } else {
    params.bulan = []  // ✅ tambah ini — reset juga saat ganti warga
  }
})

watch(() => props.isClearForm, (newVal) => {
  if (newVal) {
    form.value.reset()
    buktiPembayaran.value = null
    isErrorSubmit.value = false
    isSubmit.value = false
    params.bulan = []      // ✅ reset manual jika DatePicker tidak ikut reset
    params.warga = null
    params.metode_bayar = null
  }
})

const total = ref(0)
const adminFee = ref(0)

// const calculateMonthRangeTotal = (monthRange: { month: number }[], pricePerMonth: number): number => {
//   if (!monthRange || monthRange.length !== 2) return 0
//   const totalMonths = monthRange[1]?.month - monthRange[0]?.month + 1
//   return totalMonths <= 0 ? 0 : totalMonths * pricePerMonth
// }

const setTotalFee = (bulan?: number[] | null, pricePerMonth?: number) => {
  if (!pricePerMonth) return

  adminFee.value = 0

  if (props.item?.jenis_iuran === 'kematian') {
    total.value = pricePerMonth
    return
  }

  // Hitung berdasarkan jumlah bulan yang dipilih (bukan range)
  const jumlahBulan = bulan && bulan.length > 0 ? bulan.length : 1
  total.value = jumlahBulan * pricePerMonth + adminFee.value
}

watch(() => props.item, (newVal) => setTotalFee(null, newVal?.jumlah_iuran), { immediate: true })
watch(() => params.bulan, (newVal) => {
  setTotalFee(newVal, props.item?.jumlah_iuran)
})
watch(() => params.metode_bayar, () => setTotalFee(params.bulan, props.item?.jumlah_iuran))

// Ketika pilih QRIS, fetch data QRIS dan tampilkan dialog
const handleMetodeChange = async (val: string | null) => {
  if (val === 'qris') {
    await pembayaranStore.fetchQris()
  }
}

const handleWarga = () => {
  if (!params.warga) return
  emit('getMonthPaid', params.warga)
}

const handleSubmit = async () => {
  isSubmit.value = true
  isErrorSubmit.value = true

  const { valid } = await form.value.validate()

  if (!valid || !buktiPembayaran.value) return

  const paidMonths = (props.monthPaidWarga ?? []).map(Number)

  // Hanya kirim bulan yang baru dipilih user, bukan yang sudah paid
  const bulanBaru = params.bulan.filter(m => !paidMonths.includes(m))

  console.log('monthPaidWarga:', props.monthPaidWarga)
  console.log('paidMonths:', paidMonths)
  console.log('params.bulan sebelum filter:', params.bulan)
  console.log('bulanBaru setelah filter:', bulanBaru)
  console.log('hasil map:', bulanBaru.map(month => ({ month, year: new Date().getFullYear() })))

  emit('submit', {
    total: total.value,
    warga: params.warga,
    bulan: bulanBaru.map(month => ({ month, year: new Date().getFullYear() })),
    metode_bayar: params.metode_bayar,
    bukti_pembayaran: buktiPembayaran.value,
  })
}

const downloadingQris = ref(false)

const handleDownloadQris = async () => {
  downloadingQris.value = true
  try {
    const { api } = useApi()
    const blob = await api<Blob>(`/qris/download/${(pembayaranStore.qrisData as any).id}`, {
      responseType: 'blob', // sesuaikan dengan cara useApi kamu handle responseType
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qris.png'
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    downloadingQris.value = false
  }
}

const authStore = useAuthStore()
const isKetuaRegu = computed(() => authStore.user?.role === 'ketua_regu')
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm ref="form" @submit.prevent="handleSubmit">
        <VRow align="center" class="pt-1">

          <!-- Pilih Warga -->
          <VCol cols="12">
            <VAutocomplete v-model="params.warga" placeholder="Pilih warga" clearable item-title="nama_warga"
              item-value="nik" :loading="isLoadingDropdownWarga"
              :items="(dropdownWargaOptions as WargaPembayaranForDropdown[])" :rules="[rules.warga]"
              @update:model-value="handleWarga">
              <template #item="{ props: itemProps, item }">
                <VListItem v-bind="itemProps" :subtitle="isKetuaRegu ? undefined : (item.raw.regu || '-')" />
              </template>
            </VAutocomplete>
          </VCol>

          <!-- Pilih Bulan -->
          <VCol v-if="item?.jenis_iuran === 'bulanan'" cols="12">
            <VSelect v-model="params.bulan" label="Pilih Bulan" placeholder="Pilih bulan yang ingin dibayar"
              :items="monthsWithStatus" item-title="label" item-value="value" multiple chips closable-chips
              :loading="loadingMonthPaidWarga" :disabled="!params.warga || loadingMonthPaidWarga" :rules="[rules.bulan]"
              @update:model-value="(val: number[]) => {
                // Guard: pastikan paid months tidak bisa masuk params.bulan
                const paidMonths = (monthPaidWarga ?? []).map(Number)
                params.bulan = val.filter(m => !paidMonths.includes(m))
              }">
              <template #item="{ props, item }">
                <VListItem v-bind="props" :disabled="item.raw.isPaid" :title="item.raw.label">
                  <template #prepend="{ isSelected }">
                    <VCheckboxBtn :model-value="isSelected || item.raw.isPaid" :disabled="item.raw.isPaid"
                      :color="item.raw.isPaid ? 'success' : 'primary'" />
                  </template>
                  <template #append>
                    <VChip v-if="item.raw.isPaid" color="success" size="x-small" label>
                      Sudah Dibayar
                    </VChip>
                  </template>
                </VListItem>
              </template>

              <template #chip="{ item, props }">
                <VChip v-bind="props" :color="item.raw.isPaid ? 'success' : 'primary'" :closable="!item.raw.isPaid">
                  {{ item.raw.label }}
                </VChip>
              </template>
            </VSelect>
          </VCol>


          <!-- Metode Bayar -->
          <VCol cols="12">
            <p class="text-body-2 font-weight-medium mb-2">Metode Pembayaran</p>
            <VRow>
              <VCol v-for="metode in [
                { label: 'Tunai', value: 'tunai', icon: 'ri-cash-line' },
                { label: 'Transfer', value: 'transfer', icon: 'ri-bank-line' },
                { label: 'QRIS', value: 'qris', icon: 'ri-qr-code-line' },
              ]" :key="metode.value" cols="4">
                <VCard :variant="params.metode_bayar === metode.value ? 'tonal' : 'outlined'"
                  :color="params.metode_bayar === metode.value ? 'primary' : undefined"
                  class="cursor-pointer pa-3 d-flex flex-column align-center" :class="{ 'opacity-50': !params.warga }"
                  @click="() => {
                    if (!params.warga) return
                    params.metode_bayar = metode.value
                    handleMetodeChange(metode.value)
                  }">
                  <VIcon size="26" class="mb-1">{{ metode.icon }}</VIcon>
                  <span class="text-caption font-weight-medium">{{ metode.label }}</span>
                </VCard>
              </VCol>
            </VRow>
            <p v-if="isErrorSubmit && !params.metode_bayar" class="text-error text-caption mt-1 ms-1">
              Metode pembayaran wajib dipilih
            </p>

            <div v-if="params.metode_bayar === 'qris'" class="d-flex justify-end">
              <VBtn variant="flat" color="primary" size="small" class="mt-3" prepend-icon="ri-qr-code-line"
                :loading="pembayaranStore.loadingQris" @click="showQrisDialog = true">
                Lihat QRIS
              </VBtn>
            </div>
          </VCol>

          <!-- Upload Bukti -->
          <VCol v-if="params.metode_bayar" cols="12">
            <p class="text-body-2 font-weight-medium mb-2">Bukti Pembayaran</p>
            <CameraUpload v-model="buktiPembayaran" :is-error-submit="isErrorSubmit"
              :rules="[v => !!v || 'Bukti pembayaran wajib diupload']" />
          </VCol>

          <!-- Ringkasan -->
          <VCol cols="12">
            <VDivider class="mb-3" />
            <div class="text-end">
              <p class="ma-0 text-body-2">
                Biaya Iuran : <strong>{{ formatRupiah(item?.jumlah_iuran as number) }}</strong>
              </p>

              <!-- Tampilkan bulan yang dipilih dan subtotalnya -->
              <p v-if="params.bulan?.length > 0" class="ma-0 text-body-2">
                {{params.bulan.map(m => months[m - 1]).join(', ')}} ({{ params.bulan.length }} bulan) :
                <strong>{{ formatRupiah(params.bulan.length * (item?.jumlah_iuran as number)) }}</strong>
              </p>

              <div class="d-flex justify-end py-2">
                <VDivider style="max-width: 150px" />
              </div>
              <h3 class="ma-0">Total : {{ formatRupiah(total) }}</h3>
            </div>
            <VDivider class="mt-3" />
          </VCol>

          <!-- Submit -->
          <VCol cols="12">
            <VBtn variant="flat" block color="success" type="submit" :loading="loadingSubmit">
              Tambah Pembayaran
            </VBtn>
          </VCol>

        </VRow>
      </VForm>
    </VCardItem>
  </VCard>

  <!-- Dialog QRIS -->
  <VDialog v-model="showQrisDialog" max-width="400">
    <VCard>
      <VCardItem>
        <VCardTitle class="mb-2">Scan QRIS</VCardTitle>

        <template v-if="pembayaranStore.qrisData">
          <p v-if="pembayaranStore.qrisData.nama_rekening" class="text-body-2 mb-1">
            <span class="font-weight-medium">Nama:</span> {{ pembayaranStore.qrisData.nama_rekening }}
          </p>
          <p v-if="pembayaranStore.qrisData.keterangan" class="text-body-2 text-medium-emphasis mb-3">
            {{ pembayaranStore.qrisData.keterangan }}
          </p>

          <VImg :src="pembayaranStore.qrisData.image" alt="QRIS" class="rounded-lg mb-3" cover />

          <VBtn variant="flat" block color="primary" class="mb-2" :loading="downloadingQris"
            @click="handleDownloadQris">
            <VIcon class="me-2">ri-download-line</VIcon>
            Download QRIS
          </VBtn>
        </template>

        <template v-else>
          <div class="d-flex justify-center align-center py-8">
            <VProgressCircular indeterminate color="primary" />
          </div>
        </template>

        <VBtn variant="text" block class="mt-1" @click="showQrisDialog = false">
          Tutup & Upload Bukti
        </VBtn>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

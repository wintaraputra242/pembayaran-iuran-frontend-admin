<script setup lang="ts">
import { onMounted, ref } from 'vue';
// import qris from '@images/pages/qris.png'
import eCommerce2 from '@images/eCommerce/2.png';
import qris from '@images/pages/qris.png';

const emit = defineEmits<{
  (e: 'showHistoryPayment', item: object): void;
  (e: 'showBuktiBayar'): void;
}>();

// Dummy data simulasi API
const allDummyData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  nama: `Warga #${i + 1}`,
  info: i % 2 === 0 ? 'Notifikasi belum dibaca' : 'Pembayaran berhasil',
  created_at: `2025-01-${String((i % 28) + 1).padStart(2, '0')}`,
}))

// State
const items = ref<any[]>([])
const page = ref(1)
const perPage = 20
const isLoading = ref(false)
const hasMore = ref(true)

const loadData = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  const start = (page.value - 1) * perPage
  const end = page.value * perPage
  const newData = allDummyData.slice(start, end)

  items.value.push(...newData)
  page.value++

  if (end >= allDummyData.length) {
    hasMore.value = false
  }

  isLoading.value = false
}

const dataDummy = [
  {
    id: 1,
    transaksi_id: "TRX-202501-001",
    warga: "I Wayan Sudarma",
    regu: "Regu A",
    judul_iuran: "Iuran Bulanan Januari",
    nominal: 25000,
    metode_bayar: "QRIS",
    tanggal_bayar: "2025-01-12T08:45:00",
    petugas: "Admin Desa",
    status: "Lunas",
  },
  {
    id: 2,
    transaksi_id: "TRX-202501-002",
    warga: "I Made Adi Putra",
    regu: "Regu B",
    judul_iuran: "Iuran Bulanan Januari",
    nominal: 25000,
    metode_bayar: "Tunai",
    tanggal_bayar: "2025-01-13T14:20:00",
    petugas: "Ketua Regu B",
    status: "Lunas",
  },
  {
    id: 3,
    transaksi_id: "TRX-202501-003",
    warga: "Ni Luh Ayu Sulastri",
    regu: "Regu C",
    judul_iuran: "Iuran Kematian",
    nominal: 100000,
    metode_bayar: "Transfer",
    tanggal_bayar: "2025-01-15T10:12:00",
    petugas: "Admin Desa",
    status: "Lunas",
  },
  {
    id: 4,
    transaksi_id: "TRX-202501-004",
    warga: "I Ketut Dwi Arta",
    regu: "Regu A",
    judul_iuran: "Iuran Bulanan Februari",
    nominal: 25000,
    metode_bayar: "QRIS",
    tanggal_bayar: "2025-01-17T18:55:00",
    petugas: "Ketua Regu A",
    status: "Pending",
  },
  {
    id: 5,
    transaksi_id: "TRX-202501-005",
    warga: "Ni Kadek Mirah Santi",
    regu: "Regu B",
    judul_iuran: "Iuran Bulanan Februari",
    nominal: 25000,
    metode_bayar: "Tunai",
    tanggal_bayar: "2025-01-20T09:30:00",
    petugas: "Admin Desa",
    status: "Lunas",
  },
  {
    id: 6,
    transaksi_id: "TRX-202501-006",
    warga: "I Putu Gede Pratama",
    regu: "Regu D",
    judul_iuran: "Iuran Kematian",
    nominal: 100000,
    metode_bayar: "Transfer",
    tanggal_bayar: "2025-01-21T11:07:00",
    petugas: "Ketua Regu D",
    status: "Lunas",
  },
  {
    id: 7,
    transaksi_id: "TRX-202501-007",
    warga: "Ni Komang Sari Dewi",
    regu: "Regu C",
    judul_iuran: "Iuran Bulanan Januari",
    nominal: 25000,
    metode_bayar: "QRIS",
    tanggal_bayar: "2025-01-22T07:55:00",
    petugas: "Admin Desa",
    status: "Lunas",
  },
  {
    id: 8,
    transaksi_id: "TRX-202501-008",
    warga: "I Nyoman Surya",
    regu: "Regu A",
    judul_iuran: "Iuran Bulanan Februari",
    nominal: 25000,
    metode_bayar: "Tunai",
    tanggal_bayar: "2025-01-23T16:45:00",
    petugas: "Ketua Regu A",
    status: "Pending",
  },
  {
    id: 9,
    transaksi_id: "TRX-202501-009",
    warga: "Ni Ketut Ayu Pertiwi",
    regu: "Regu B",
    judul_iuran: "Iuran Kematian",
    nominal: 100000,
    metode_bayar: "Transfer",
    tanggal_bayar: "2025-01-24T13:10:00",
    petugas: "Admin Desa",
    status: "Lunas",
  },
  {
    id: 10,
    transaksi_id: "TRX-202501-010",
    warga: "I Made Yoga Saputra",
    regu: "Regu D",
    judul_iuran: "Iuran Bulanan Januari",
    nominal: 25000,
    metode_bayar: "QRIS",
    tanggal_bayar: "2025-01-25T08:20:00",
    petugas: "Ketua Regu D",
    status: "Lunas",
  },
]

const statusChipsColor = {
  'pending': 'info',
  'success': 'success',
  'failed': 'error',
  'expired': 'secondary',
  'cancelled': 'secondary',
}

let observer: IntersectionObserver

onMounted(() => {
  const sentinelWarga = document.getElementById('sentinelWarga')
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadData()
    }
  })

  if (sentinelWarga) observer.observe(sentinelWarga)

  // Initial load
  loadData()
})
</script>

<template>
  <VCard class="pa-0">
    <VCardItem class="pa-2">
      <div
        class="table-scroll-wrapper"
      >
        <VTable fixed-header height="400px" class="my-table">
          <thead>
            <tr>
              <th style="width: 70px;">No.</th>
              <th style="width: 200px;">ID Transaksi</th>
              <th style="width: 180px;">Tanggal Bayar</th>
              <th style="width: 200px;">Warga</th>
              <th style="width: 180px;">Regu</th>
              <th style="width: 220px;">Judul Iuran</th>
              <th style="width: 160px;">Metode Bayar</th>
              <th style="width: 160px;">Nominal</th>
              <th style="width: 200px;">Petugas/Admin</th>
              <th class="text-center" style="width: 150px;">Status</th>
              <th class="text-center" style="width: 200px;">Bukti Pembayaran</th>
            </tr>
          </thead>
  
          <tbody>
            <tr v-for="(item, i) in dataDummy" :key="item.id">
              <td>{{ i + 1 }}</td>
              <td>{{ item.transaksi_id }}</td>
              <td>{{ formatDateID(item.tanggal_bayar) }}</td>
              <td><span class="text-info hover-text cursor-pointer" @click="emit('showHistoryPayment', item)">{{ item.warga }} <VIcon icon="ri-arrow-right-up-long-line" size="16" /></span></td>
              <td>{{ item.regu }}</td>
              <td>{{ item.judul_iuran }}</td>
              <td>
                <div class="d-flex align-center gap-1">
                  <VIcon v-if="item.metode_bayar !== 'QRIS'" :icon="item.metode_bayar === 'Transfer' ? 'ri-exchange-line' : 'ri-cash-line'" size="20" />
                  <VImg v-if="item.metode_bayar === 'QRIS'" :src="qris" max-width="20px" /> 
                  {{ item.metode_bayar }}
                </div>
              </td>
              <td>{{ formatRupiah(item.nominal) }}</td>
              <td>{{ item.petugas }}</td>
              <td align="center">
                <VChip
                  size="small"
                  :color="statusChipsColor['success']"
                >
                  <!-- Tertunda -->
                  Berhasil
                  <!-- Gagal -->
                  <!-- Batal -->
                  <!-- Expired -->
                </VChip>
              </td>
              <td>
                <div class="d-flex justify-center">
                  <div v-ripple class="pa-2 rounded-lg" @click="emit('showBuktiBayar')">
                    <VImg :src="eCommerce2" width="50" />
                  </div>
                </div>
                <!-- <div class="d-flex gap-2">
                  <IconBtn v-if="item.metode_bayar === 'Tunai'" variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('showAnggota', item)">
                    <VIcon icon="ri-image-line" />
                  </IconBtn>
                </div> -->
              </td>
            </tr>
  
            <!-- Loading -->
            <tr v-if="isLoading">
              <td colspan="7" rowspan="2" class="text-center py-3">
                <VProgressCircular indeterminate size="26" />
              </td>
            </tr>
  
            <tr v-if="hasMore">
              <td colspan="7"><div id="sentinelWarga" style="height: 1px; width: 100%;"></div></td>
            </tr>
          </tbody>
        </VTable>
      </div>
    </VCardItem>
  </VCard>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;   /* tinggi container */
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>

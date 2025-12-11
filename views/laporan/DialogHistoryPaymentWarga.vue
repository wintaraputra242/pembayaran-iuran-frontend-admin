<script lang="ts" setup>
import eCommerce2 from '@images/eCommerce/2.png';
import qris from '@images/pages/qris.png';

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

const dataDummyHistory = [
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


const statusChipsColor = {
  'pending': 'info',
  'success': 'success',
  'failed': 'error',
  'expired': 'secondary',
  'cancelled': 'secondary',
}
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard>
      <VCardTitle class="pt-3">
        <div class="d-flex align-center justify-space-between">
          <h3>Riwayat Pembayaran</h3>
          <IconBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardText>
        <div class="mb-5">
          <p class="pa-0 ma-0 text-caption">Nama Warga: {{ props.item?.nama_warga || '-' }}</p>
          <p class="pa-0 ma-0 text-caption">Regu: {{ props.item?.regu || '-' }}</p>
        </div>

        <VTabs v-model="tab" color="primary">
          <VTab value="history">Riwayat</VTab>
          <VTab value="no-payment">Belum Bayar</VTab>
        </VTabs>

        <VDivider></VDivider>

        <VTabsWindow v-model="tab">
          <VTabsWindowItem value="history">
            <VTable fixed-header height="400px" class="my-table mt-3">
              <thead>
                <tr>
                  <th style="width: 70px;">No.</th>
                  <th style="width: 200px;">ID Transaksi</th>
                  <th style="width: 180px;">Tanggal Bayar</th>
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
                <tr v-for="(item, i) in dataDummyHistory" :key="item.id">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.transaksi_id }}</td>
                  <td>{{ formatDateID(item.tanggal_bayar) }}</td>
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
          </VTabsWindowItem>
          <VTabsWindowItem value="no-payment">
            <div class="mt-3 d-flex justify-end" @click="emit('sendNotif')">
              <VBtn variant="flat" color="info">
                <VIcon icon="ri-bell-line" class="me-2" />
                Kirim Notif
              </VBtn>
            </div>
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
          </VTabsWindowItem>
        </VTabsWindow>
      </VCardText>
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

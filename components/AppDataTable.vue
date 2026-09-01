<script setup lang="ts">
import type { PaginationMeta } from '@/types/common'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

interface Header {
  key: string
  label?: string
  width?: string
  align?: 'start' | 'center' | 'end' | string
}

const props = withDefaults(defineProps<{
  headers: Header[]
  items: any[]
  loading?: boolean
  hasMore?: boolean
  hasFilter?: boolean
  noDataText?: string
  variant?: 'text' | 'elevated' | 'flat' | 'outlined' | 'tonal' | 'plain'
  perPage?: number
  // Meta pagination dari backend (Laravel-style: current_page, last_page, total, per_page, from, to).
  // Kalau diisi, tabel desktop pakai pagination server-side yang sebenarnya (bukan potongan
  // dari data yang sudah ter-load). Kalau tidak diisi, fallback ke mode lama (lihat di bawah).
  meta?: PaginationMeta | null
  limitOptions?: number[]
}>(), {
  noDataText: 'Tidak ada data',
  variant: 'elevated',
  perPage: 10,
  meta: null,
  limitOptions: () => [10, 25, 50, 100],
})

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'editPassword', item: any): void
  (e: 'loadMore'): void
  (e: 'changePage', page: number): void
  (e: 'changeLimit', limit: number): void
}>()

// ⚠️ Destructure langsung ("smAndDown", bukan "display.smAndDown") — ini penting supaya Vue
// otomatis "membuka bungkus" nilai ref-nya di template. Kalau dipakai sebagai `display.smAndDown`
// (properti bersarang di dalam objek biasa), Vue TIDAK auto-unwrap nilainya di template, sehingga
// `v-if="!display.smAndDown"` akan selalu bernilai false (objek ref dianggap truthy) — tabel
// desktop jadi tidak pernah muncul di ukuran layar berapa pun.
const { smAndDown } = useDisplay()

const hasServerMeta = computed(() => !!props.meta)

// 🔥 SENTINEL untuk infinite scroll — HANYA dipakai di tampilan mobile (kartu).
// Desktop pakai pagination (server-side kalau ada `meta`, atau fallback di bawah).
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupObserver = async () => {
  if (!smAndDown.value) return
  if (!props.hasMore || props.loading) return

  await nextTick()

  if (!sentinel.value) return

  observer?.disconnect()

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !props.loading)
        emit('loadMore')
    },
    {
      rootMargin: '150px',
    },
  )

  observer.observe(sentinel.value)
}

onMounted(setupObserver)

onBeforeUnmount(() => {
  observer?.disconnect()
})

// 🔁 PASANG ULANG JIKA DATA / MODE TAMPILAN BERUBAH
watch(
  () => props.items.length,
  () => setupObserver(),
)

watch(smAndDown, () => setupObserver())

// ================= PAGINATION SERVER-SIDE (kalau ada `meta`) =================
const currentPageFromMeta = computed(() => props.meta?.current_page ?? 1)
const totalPagesFromMeta = computed(() => props.meta?.last_page ?? 1)
const limitModel = computed({
  get: () => props.meta?.per_page ?? props.perPage,
  set: (value: number) => emit('changeLimit', value),
})

const handleChangePage = (page: number) => {
  if (page !== currentPageFromMeta.value)
    emit('changePage', page)
}

// ================= FALLBACK PAGINATION (kalau `meta` belum disediakan halaman) =================
// Tidak mengubah cara halaman/store mengambil data (masih "load more" yang mengakumulasi
// data ke `items`) — AppDataTable hanya menampilkannya per halaman. Kalau user klik ke
// halaman yang datanya belum ter-load, otomatis memicu `loadMore` yang sudah ada.
const fallbackPage = ref(1)

const fallbackTotalPages = computed(() => {
  const loadedPages = Math.max(1, Math.ceil(props.items.length / props.perPage))

  // Masih ada data lagi di server → tambah 1 halaman supaya bisa diklik untuk memuat lebih.
  return props.hasMore ? loadedPages + 1 : loadedPages
})

// Reset ke halaman 1 kalau data di-reset (mis. filter berubah/reload) — ditandai items
// tiba-tiba kosong padahal sebelumnya sudah pernah ada data.
watch(
  () => props.items.length,
  (len, prevLen) => {
    if (len === 0 && (prevLen ?? 0) > 0)
      fallbackPage.value = 1
  },
)

watch(fallbackPage, page => {
  const start = (page - 1) * props.perPage

  if (start >= props.items.length && props.hasMore && !props.loading)
    emit('loadMore')
})

// ================= GABUNGAN: dipakai di template, otomatis pilih mode yang aktif =================
const currentPage = computed(() => hasServerMeta.value ? currentPageFromMeta.value : fallbackPage.value)
const totalPages = computed(() => hasServerMeta.value ? totalPagesFromMeta.value : fallbackTotalPages.value)

// Baris pertama halaman ini bernomor urut ke berapa (0-based offset).
const startIndex = computed(() => {
  if (hasServerMeta.value)
    return ((props.meta?.from ?? 1) - 1)

  return (fallbackPage.value - 1) * props.perPage
})

const displayedItems = computed(() => {
  if (hasServerMeta.value) return props.items

  const start = startIndex.value

  return props.items.slice(start, start + props.perPage)
})

const rangeInfoText = computed(() => {
  if (hasServerMeta.value && props.meta) {
    const { from, to, total } = props.meta

    if (!total) return `0 dari 0 data`

    return `Menampilkan ${from ?? 0}–${to ?? 0} dari ${total} data`
  }

  const from = startIndex.value + 1
  const to = startIndex.value + displayedItems.value.length

  return displayedItems.value.length ? `Menampilkan ${from}–${to} data` : ''
})

const alignClass = (align?: string) => {
  if (align === 'center') return 'text-center'
  if (align === 'end') return 'text-end'

  return 'text-start'
}

// Kolom yang isinya biasanya beberapa tombol/elemen sekaligus (aksi) — atau kolom terakhir
// tanpa lebar eksplisit — dibiarkan boleh wrap ke baris berikutnya kalau tidak muat,
// supaya tidak melebar bebas dan bikin garis antar baris jadi tidak rata.
const WRAP_COLUMN_KEYS = new Set(['actions', 'aksi'])

// Kata kunci nama kolom yang biasanya berisi teks panjang (nama orang, alamat, deskripsi,
// keterangan, dst). Dicocokkan sebagai substring case-insensitive terhadap key kolom, supaya
// otomatis berlaku untuk kolom serupa di SEMUA tabel — tidak perlu didaftar satu-satu per
// halaman. Kalau suatu saat ada tabel baru dengan kolom "alamat_kantor" atau "nama_ahli_waris"
// misalnya, otomatis ikut ter-wrap tanpa perlu ubah kode lagi.
const LONG_TEXT_KEYWORDS = [
  'nama', 'name', 'alamat', 'address', 'deskripsi', 'description',
  'keterangan', 'pesan', 'message', 'catatan', 'note', 'alasan',
  'judul', 'title', 'petugas', 'warga',
]

// Kalau LABEL header-nya sendiri panjang (mis. "Jumlah Iuran yang Harus Dibayar"), tetap
// izinkan wrap juga — terlepas dari nama key kolomnya cocok kata kunci di atas atau tidak.
// Ini yang mencegah header panjang "menghancurkan" tata letak tabel (memaksa kolom
// melebar/tabrakan) karena dipaksa satu baris.
const LONG_LABEL_THRESHOLD = 20

const isLongTextColumn = (header: Header) => {
  const key = header.key.toLowerCase()

  return LONG_TEXT_KEYWORDS.some(keyword => key.includes(keyword))
    || (header.label?.length ?? 0) > LONG_LABEL_THRESHOLD
}

const isWrapColumn = (header: Header, index: number) =>
  WRAP_COLUMN_KEYS.has(header.key)
  || (index === props.headers.length - 1 && !header.width)
  || isLongTextColumn(header)

const colStyle = (header: Header, index: number) => {
  if (header.key === 'no') {
    const width = header.width ?? '60px'

    return { width, minWidth: width }
  }

  // Kolom teks panjang yang sudah punya lebar dari halaman masing-masing — pakai apa
  // adanya, cukup diizinkan wrap lewat class "cell-wrap" (lihat isWrapColumn & style di bawah).
  if (header.width)
    return { width: header.width, minWidth: header.width }

  // Kolom aksi / kolom terakhir tanpa lebar eksplisit. Diberi minWidth juga (bukan cuma
  // maxWidth) — sebelumnya tanpa minWidth, kolom ini bisa "diperas" nyaris tanpa ruang oleh
  // algoritma layout tabel saat lebar layar pas-pasan, membuat tombol aksinya tidak
  // kebagian tempat untuk tampil.
  if (WRAP_COLUMN_KEYS.has(header.key) || (index === props.headers.length - 1 && !header.width))
    return { minWidth: '110px', maxWidth: '240px' }

  // Kolom teks panjang yang BELUM punya lebar dari halaman masing-masing — beri lebar
  // default yang nyaman dibaca saat wrap (mis. "keterangan" atau "nama_rekening" di QRIS).
  if (isLongTextColumn(header))
    return { minWidth: '200px', maxWidth: '260px' }

  return {}
}
</script>

<template>
  <!-- ================= DESKTOP / TABLET (tabel) ================= -->
  <div v-if="!smAndDown" class="app-data-table-wrapper">
    <VTable hover class="app-data-table">
      <thead>
        <tr>
          <th
            v-for="(header, hi) in headers"
            :key="header.key"
            :style="colStyle(header, hi)"
            :class="[alignClass(header.align), isWrapColumn(header, hi) && 'cell-wrap']"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in displayedItems" :key="item.id ?? i">
          <td
            v-for="(header, hi) in headers"
            :key="header.key"
            :style="colStyle(header, hi)"
            :class="[alignClass(header.align), isWrapColumn(header, hi) && 'cell-wrap']"
          >
            <template v-if="header.key === 'no'">
              {{ startIndex + i + 1 }}
            </template>
            <template v-else>
              <slot :name="`cell-${header.key}`" :item="item" :index="startIndex + i">
                {{ item[header.key] ?? '-' }}
              </slot>
            </template>
          </td>
        </tr>

        <tr v-if="displayedItems.length === 0 && !loading">
          <td :colspan="headers.length" class="text-center py-6">
            {{ hasFilter ? 'Data tidak ditemukan' : noDataText }}
          </td>
        </tr>
      </tbody>
    </VTable>

    <div v-if="loading" class="text-center py-4">
      <VProgressCircular indeterminate size="26" />
    </div>

    <!-- Footer pagination: info rentang data + rows-per-page (kalau server-side) + nomor halaman -->
    <div v-if="displayedItems.length > 0 || totalPages > 1" class="app-data-table-footer">
      <span class="text-caption text-medium-emphasis">{{ rangeInfoText }}</span>

      <div class="d-flex align-center flex-wrap justify-center ga-4">
        <div v-if="hasServerMeta" class="d-flex align-center ga-2">
          <span class="text-caption text-medium-emphasis text-no-wrap">Baris per halaman</span>
          <VSelect
            v-model="limitModel"
            :items="limitOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="width: 88px;"
            :disabled="loading"
          />
        </div>

        <VPagination
          v-if="totalPages > 1"
          :model-value="currentPage"
          :length="totalPages"
          :total-visible="7"
          density="comfortable"
          :disabled="loading"
          @update:model-value="hasServerMeta ? handleChangePage($event) : (fallbackPage = $event)"
        />
      </div>
    </div>
  </div>

  <!-- ================= MOBILE (kartu) ================= -->
  <div v-else class="list-data">
    <VRow>
      <VCol v-for="(item, i) in items" :key="item.id ?? i" cols="12" sm="6">
        <VCard class="mb-0" rounded="lg" border="sm" :variant="props.variant" position="relative" height="100%">
          <VCardText class="d-flex flex-column gap-2">
            <div class="text-caption text-medium-emphasis">
              #{{ i + 1 }}
            </div>

            <div v-for="header in headers.slice(1)" :key="header.key">
              <div class="text-caption text-medium-emphasis">
                <slot :name="`label-${header.key}`" :item="item" :label="header.label">
                  {{ header.label }}
                </slot>
              </div>

              <div v-if="header.key === 'is_deleted'" class="font-weight-medium" />

              <div v-else-if="header.key !== 'actions'" class="font-weight-medium">
                <slot :name="`cell-${header.key}`" :item="item" :index="i">
                  {{ item[header.key] || '-' }}
                </slot>
              </div>

              <div v-else class="position-absolute" style="bottom: 12px; right: 12px;">
                <div class="d-flex justify-end gap-2">
                  <slot :name="`cell-${header.key}`" :item="item" :index="i">
                    {{ item[header.key] }}
                  </slot>
                </div>
              </div>

              <div v-if="header.key === 'is_deleted' && item?.is_deleted" class="d-flex justify-end gap-2 mt-2">
                <VChip class="position-absolute" variant="flat" style="top: 10px; right: 10px;" size="small" color="error">
                  Dihapus
                </VChip>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- sentinel & loading tetap sama -->
    <div v-if="hasMore" ref="sentinel" style="height: 1px" />

    <div v-if="loading" class="text-center py-4">
      <VProgressCircular indeterminate size="26" />
    </div>

    <div v-if="props.items.length === 0 && !props.loading" class="text-center py-6">
      <p class="text-center ma-0">{{ props.hasFilter ? 'Data tidak ditemukan' : props.noDataText }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.list-data {
  background-color: transparent !important;
}

.app-data-table-wrapper {
  .app-data-table {
    white-space: nowrap;

    // Kolom aksi, kolom teks panjang (nama/alamat/deskripsi/dst — lihat LONG_TEXT_KEYWORDS di
    // script), atau kolom terakhir tanpa lebar eksplisit — boleh wrap ke baris berikutnya
    // kalau kontennya tidak muat dalam satu baris, bukan overflow/kepotong.
    th.cell-wrap,
    td.cell-wrap {
      white-space: normal;
    }

    td.cell-wrap .d-flex {
      flex-wrap: wrap;
    }
  }

  .app-data-table-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-block: 12px;
    padding-inline: 4px;
  }
}
</style>

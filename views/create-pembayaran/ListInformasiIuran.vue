<script lang="ts" setup>
import type { MasterInformasiIuran } from '@/types/api/master-informasi-iuran';
import { useDisplay } from 'vuetify';

const emit = defineEmits<{
  (e: 'reload'): void
  (e: 'showFormData'): void
  (e: 'loadMore'): void
}>()

const props = defineProps<{
  items: MasterInformasiIuran[] | null
  loading: boolean
  hasMore?: boolean
  keyword?: string // ← tambah
}>()

const router = useRouter()
const display = useDisplay()

const mobileSentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupObserver = async () => {
  if (!display.smAndDown.value) return
  if (!props.hasMore || props.loading) return
  await nextTick()
  if (!mobileSentinel.value) return

  observer?.disconnect()
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !props.loading) emit('loadMore')
    },
    { rootMargin: '100px' }
  )
  observer.observe(mobileSentinel.value)
}

// Fix Bug 2 — pakai watch sentinel bukan onMounted
watch(mobileSentinel, (el) => { if (el) setupObserver() })
watch(() => props.hasMore, () => setupObserver())
watch(() => display.smAndDown.value, () => setupObserver())

onBeforeUnmount(() => observer?.disconnect())

// Highlight keyword
const highlight = (text: string | null | undefined): string => {
  if (!text) return '-'
  if (!props.keyword?.trim()) return text

  const escaped = props.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')

  return text.replace(
    regex,
    '<mark style="background: rgba(var(--v-theme-warning), 0.35); color: inherit; border-radius: 2px; padding: 0 2px;">$1</mark>'
  )
}
</script>

<template>
  <VRow>
    <template v-if="props.items?.length === 0 && loading">
      <div class="d-flex justify-center w-100 mt-4">
        <VProgressCircular indeterminate size="26" />
      </div>
    </template>

    <template v-else-if="props.items?.length === 0 && !loading">
      <div class="d-flex justify-center w-100 mt-4">
        Tidak ada data
      </div>
    </template>

    <template v-else>
      <VCol v-for="item in props.items" :key="item.id" cols="12" sm="6">
        <VCard class="mb-0 d-flex flex-column" rounded="lg" border="sm" variant="elevated" height="100%">
          <VCardTitle>
            <div class="d-flex justify-space-between gap-1">
              <div class="w-100">
                <h5 class="clamp-2" style="text-wrap: wrap;" v-html="highlight(item.judul_iuran)" />
                <p class="text-caption ma-0">{{ formatDateID(item.created_at) }}</p>
              </div>
              <div>
                <VChip size="small" :color="item.jenis_iuran === 'kematian' ? 'error' : 'info'">
                  {{ item.jenis_iuran === 'kematian' ? 'Kematian' : 'Bulanan' }}
                </VChip>
              </div>
            </div>
          </VCardTitle>

          <VCardText class="px-4 flex-grow-1">
            <div class="mb-3">
              <p v-if="item.jenis_iuran === 'bulanan'" class="text-caption ma-0">
                Periode: <span v-html="highlight(String(item.periode))" />
              </p>
              <p v-if="item.jenis_iuran === 'kematian'" class="text-body-2 ma-0">
                Alm: <strong v-html="highlight(item.nama_warga_meninggal || '-')" />
              </p>
              <p v-if="item.jenis_iuran === 'kematian'" class="text-body-2 ma-0">
                PJ: <strong v-html="highlight(item.penanggung_jawab?.nama_warga || '-')" />
              </p>
            </div>
            <p class="pa-0 ma-0 text-caption">{{ item.keterangan }}</p>
          </VCardText>

          <!-- Nominal + tombol bayar -->
          <VCardActions class="px-4 pb-3 pt-0">
            <div class="d-flex justify-space-between align-center w-100">
              <p class="pa-0 ma-0 font-weight-bold">
                Rp. {{ Number(item.jumlah_iuran).toLocaleString('id-ID') }}
              </p>
              <VBtn variant="flat" size="small" color="primary"
                @click="router.push('/create-pembayaran/form/' + item.id)">
                <VIcon icon="ri-bank-card-line" class="me-2" />
                Bayar Sekarang
              </VBtn>
            </div>
          </VCardActions>
        </VCard>
      </VCol>
    </template>
  </VRow>

  <div v-if="(props.items as []).length > 0 && hasMore" ref="mobileSentinel" style="height: 1px" />

  <div v-if="(props.items as []).length > 0 && loading" class="text-center py-4">
    <VProgressCircular indeterminate size="26" />
  </div>
</template>

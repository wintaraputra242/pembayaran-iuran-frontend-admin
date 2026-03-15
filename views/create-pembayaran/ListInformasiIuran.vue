<script lang="ts" setup>
import type { MasterInformasiIuran } from '@/types/api/master-informasi-iuran';
import { useDisplay } from 'vuetify';

const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'showFormData'): void;
  (e: 'loadMore'): void
}>();

const props = defineProps<{
  items: MasterInformasiIuran[] | null
  loading: boolean
  hasMore?: boolean
}>()

const router = useRouter()

const display = useDisplay()

// 🔥 MOBILE SENTINEL
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
      if (entry.isIntersecting && !props.loading) {
        emit('loadMore')
      }
    },
    {
      rootMargin: '100px',
    }
  )

  observer.observe(mobileSentinel.value)
}

onMounted(setupObserver)

onBeforeUnmount(() => {
  observer?.disconnect()
})

// 🔁 PASANG ULANG JIKA DATA BERUBAH
watch(
  () => props.items?.length,
  () => setupObserver()
)

watch(
  () => display.smAndDown.value,
  () => setupObserver()
)
</script>

<template>
  <VRow>
    <template v-if="props.items?.length === 0 && loading">
      <div class="d-flex justify-center w-100 mt-4">
        <VProgressCircular indeterminate size="26" />
      </div>
    </template>

    <template v-else>
      <VCol
        v-for="item in props.items"
        :key="item.id"
        cols="12"
      >
        <VCard elevation="0">
          <VCardTitle>
            <div class="d-flex justify-space-between gap-1">
              <div class="w-100">
                <h5 class="clamp-2" style="text-wrap: wrap;">{{ item.judul_iuran }}</h5>
                <p class="text-caption ma-0">
                  {{ formatDateID(item.created_at) }}
                </p>
              </div>
  
              <div>
                <VChip
                  size="small"
                  :color="item.jenis_iuran === 'kematian' ? 'error' : 'info'"
                >
                  {{ item.jenis_iuran === 'kematian' ? 'Kematian' : 'Bulanan' }}
                </VChip>
              </div>
            </div>
          </VCardTitle>
  
          <VCardText class="px-4">
            <div class="mb-3">
              <p
                v-if="item.jenis_iuran === 'bulanan'"
                class="text-caption ma-0"
              >
                Periode: {{ item.periode }}
              </p>
  
              <!-- khusus jika iuran kematian -->
              <p
                v-if="item.jenis_iuran === 'kematian'"
                class="text-body-2 ma-0"
              >
                Alm: <strong>{{ item.nama_warga_meninggal || '-' }}</strong>
              </p>
  
              <p v-if="item.jenis_iuran === 'kematian'" class="text-body-2 ma-0">
                PJ: <strong>{{ item.warga?.nama_warga || '-' }}</strong>
              </p>
            </div>
  
            <p class="pa-0 ma-0 text-caption">
              {{ item.keterangan }}
            </p>
  
            <p class="pa-0 ma-0 mt-3 text-end font-weight-bold">
              Rp. {{ Number(item.jumlah_iuran).toLocaleString('id-ID') }}
            </p>
  
            <div class="d-flex justify-end mt-4">
              <VBtn
                variant="flat"
                size="small"
                color="primary"
                @click="router.push('/create-pembayaran/form/' + item.id)"
              >
                <VIcon icon="ri-bank-card-line" class="me-2" />
                Bayar Sekarang
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </template>
  </VRow>

  <div
    v-if="(props.items as []).length > 0 && hasMore"
    ref="mobileSentinel"
    style="height: 1px"
  />

  <div v-if="(props.items as []).length > 0 && loading" class="text-center py-4">
    <VProgressCircular indeterminate size="26" />
  </div>
</template>

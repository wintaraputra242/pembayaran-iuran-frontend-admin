<script setup lang="ts">
import { useNotificationStore } from '@/stores/useNotificationStore'
import DialogDetailPembayaran from '@/views/pembayaran/DialogDetailPembayaran.vue'

const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()

const isKetuaRegu = computed(() => authStore.user?.role === 'ketua_regu')

const page = ref(1)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const loadNotifications = async (reset = false) => {
  if (reset) {
    notificationStore.reload = true
    page.value = 1
  }
  await notificationStore.fetchNotifications({ page: page.value, per_page: 10 })
}

const loadMore = async () => {
  if (!notificationStore.hasMore || notificationStore.loading) return
  page.value++
  await loadNotifications()
}

// Fix bug sentinel
const setupObserver = () => {
  if (!sentinel.value) return
  observer?.disconnect()
  observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) loadMore() },
    { rootMargin: '100px' }
  )
  observer.observe(sentinel.value)
}

watch(sentinel, (el) => { if (el) setupObserver() })
watch(() => notificationStore.hasMore, () => setupObserver())
onUnmounted(() => observer?.disconnect())

onMounted(async () => {
  notificationStore.resetState()
  page.value = 1
  await loadNotifications(true)
  await notificationStore.markAllAsRead()
})

// Config notifikasi
const notifTypeConfig: Record<string, { color: string; icon: string; label: string }> = {
  pengingat: { color: 'warning', icon: 'ri-alarm-line', label: 'Pengingat' },
  reminder: { color: 'warning', icon: 'ri-alarm-line', label: 'Pengingat' },
  pengingat_iuran: { color: 'warning', icon: 'ri-alarm-line', label: 'Pengingat Iuran' },
  manual: { color: 'info', icon: 'ri-notification-line', label: 'Informasi' },
  payment: { color: 'success', icon: 'ri-cash-line', label: 'Pembayaran' },
  kematian: { color: 'error', icon: 'ri-heart-2-line', label: 'Kematian' },
  bulanan: { color: 'info', icon: 'ri-calendar-line', label: 'Bulanan' },
  iuran_baru: { color: 'info', icon: 'ri-file-add-line', label: 'Iuran Baru' },
}

const getNotifConfig = (type: string) =>
  notifTypeConfig[type] ?? { color: 'secondary', icon: 'ri-notification-line', label: type }

// Parse data notifikasi
const getNotifData = (notif: any) => {
  return typeof notif.data === 'string' ? JSON.parse(notif.data || '{}') : (notif.data ?? {})
}

// State dialog detail pembayaran — KHUSUS ketua regu
const showDetailPembayaran = ref(false)
const selectedPembayaranId = ref<number | string | null>(null)

const handleCloseDetailPembayaran = () => {
  showDetailPembayaran.value = false
  selectedPembayaranId.value = null
}

// Handle action tombol
const handleAction = (notif: any) => {
  const data = getNotifData(notif)

  if (isKetuaRegu.value) {
    // Ketua regu + notif ada pembayaran_id → buka dialog detail, tidak pindah halaman
    if (data.pembayaran_id) {
      selectedPembayaranId.value = data.pembayaran_id
      showDetailPembayaran.value = true
      return
    }

    // Selain itu (misalnya notif tipe lain), tetap ke riwayat seperti sebelumnya
    router.push('/my-activity')
    return
  }

  // Admin — tetap pakai alur navigasi lama
  if (data.pembayaran_id) {
    router.push({
      path: '/pembayaran',
      query: { pembayaran_id: data.pembayaran_id },
    })
    return
  }

  if (notif.type === 'pengingat' || notif.type === 'pengingat_iuran') {
    router.push('/pembayaran/cek-belum-bayar')
  } else {
    router.push('/pembayaran')
  }
}

const getActionLabel = (notif: any) => {
  const data = getNotifData(notif)

  if (isKetuaRegu.value) {
    return data.pembayaran_id ? 'Lihat Pembayaran' : 'Lihat Riwayat'
  }

  if (data.pembayaran_id) return 'Lihat Pembayaran'
  if (notif.type === 'pengingat' || notif.type === 'pengingat_iuran') return 'Lihat Belum Bayar'

  return 'Lihat Pembayaran'
}

const getActionIcon = (notif: any) => {
  const data = getNotifData(notif)

  if (isKetuaRegu.value) {
    return data.pembayaran_id ? 'ri-cash-line' : 'ri-history-line'
  }

  if (data.pembayaran_id) return 'ri-cash-line'
  if (notif.type === 'pengingat' || notif.type === 'pengingat_iuran') return 'ri-user-unfollow-line'

  return 'ri-cash-line'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <!-- Tombol back hanya untuk ketua regu -->
      <div v-if="isKetuaRegu" class="mb-3">
        <VBtn class="px-0 py-1" variant="text" size="large" to="/create-pembayaran">
          <VIcon icon="ri-arrow-left-s-line" class="me-2" />
          Kembali
        </VBtn>
      </div>

      <h2>Notifikasi</h2>
      <span class="text-body-2 text-medium-emphasis">
        {{ isKetuaRegu
          ? 'Pemberitahuan pembayaran dari anggota regu Anda.'
          : 'Berisi informasi dan pemberitahuan penting yang diterima oleh pengguna.'
        }}
      </span>
    </div>

    <!-- Loading awal -->
    <div v-if="notificationStore.loading && !notificationStore.hasData" class="d-flex justify-center py-6">
      <VProgressCircular size="26" indeterminate />
    </div>

    <!-- Empty -->
    <VAlert v-else-if="!notificationStore.hasData && !notificationStore.loading" type="info" variant="tonal"
      rounded="lg">
      {{ isKetuaRegu ? 'Belum ada pembayaran dari anggota regu Anda.' : 'Tidak ada notifikasi' }}
    </VAlert>

    <!-- List -->
    <VRow v-if="notificationStore.hasData">
      <VCol v-for="notif in notificationStore.notifications" :key="notif.id" cols="12" sm="6">
        <VCard rounded="lg" border="sm" height="100%" class="d-flex flex-column" :style="!notif.is_read
          ? 'border-left: 3px solid rgb(var(--v-theme-primary)) !important;'
          : ''">
          <VCardItem class="pa-4 flex-grow-1">
            <div class="d-flex align-start gap-3">
              <!-- Icon -->
              <VAvatar :color="getNotifConfig(notif.type).color" variant="tonal" size="40" class="flex-shrink-0">
                <VIcon size="20">{{ getNotifConfig(notif.type).icon }}</VIcon>
              </VAvatar>

              <div class="flex-grow-1 min-width-0">
                <!-- Type chip & badge baru -->
                <div class="d-flex align-center justify-space-between mb-1 flex-wrap gap-1">
                  <VChip :color="getNotifConfig(notif.type).color" size="x-small" variant="tonal">
                    {{ getNotifConfig(notif.type).label }}
                  </VChip>
                  <VChip v-if="!notif.is_read" color="primary" size="x-small" variant="flat">
                    Baru
                  </VChip>
                </div>

                <!-- Title -->
                <p class="font-weight-semibold text-body-2 mb-1 mt-1">{{ notif.title }}</p>

                <!-- Message -->
                <p class="text-caption text-medium-emphasis ma-0" style="line-height: 1.5;">
                  {{ notif.message }}
                </p>

                <!-- Tanggal -->
                <p class="text-caption text-medium-emphasis ma-0 mt-2">
                  <VIcon size="12" class="me-1">ri-time-line</VIcon>
                  {{ formatDateID(notif.created_at) }}
                </p>
              </div>
            </div>
          </VCardItem>

          <!-- Action -->
          <VCardActions class="px-4 pb-3 pt-0">
            <VBtn :color="getNotifConfig(notif.type).color" variant="flat" size="small" block
              :prepend-icon="getActionIcon(notif)" @click="handleAction(notif)">
              {{ getActionLabel(notif) }}
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>

    <!-- Sentinel -->
    <div ref="sentinel" style="height: 1px;" />

    <!-- Load more loading -->
    <div v-if="notificationStore.hasMore && notificationStore.loading" class="d-flex justify-center py-4">
      <VProgressCircular indeterminate size="26" />
    </div>

    <!-- Dialog detail pembayaran — khusus ketua regu -->
    <DialogDetailPembayaran v-if="isKetuaRegu" :is-show="showDetailPembayaran" :pembayaran-id="selectedPembayaranId"
      @close="handleCloseDetailPembayaran" />
  </div>
</template>

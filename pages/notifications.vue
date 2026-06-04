<script setup lang="ts">
import { useNotificationStore } from '@/stores/useNotificationStore'

const notificationStore = useNotificationStore()
const router = useRouter()

const page = ref(1)
const sentinel = ref<HTMLElement | null>(null)

const loadNotifications = async (reset = false) => {
  if (reset) {
    notificationStore.reload = true
    page.value = 1
  }

  await notificationStore.fetchNotifications({
    page: page.value,
    per_page: 10,
  })
}

const loadMore = async () => {
  if (!notificationStore.hasMore || notificationStore.loading) return
  page.value++
  await loadNotifications()
}

const goToPayment = (notif: Notification) => {
  // asumsi backend mengirim payment_id di data notification
  if (notif.data) {
    const data = JSON.parse(notif.data)

    router.push(`/pembayaran`)
  }
}

onMounted(async () => {
  notificationStore.resetState() // ← reset bersih sebelum fetch
  page.value = 1

  await loadNotifications(true)
  await notificationStore.markAllAsRead()

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMore()
  }, { rootMargin: '100px' })

  if (sentinel.value) observer.observe(sentinel.value)
})

// Config tampilan berdasarkan type notifikasi
const notifTypeConfig: Record<string, { color: string; icon: string; label: string }> = {
  reminder: { color: 'warning', icon: 'ri-alarm-line', label: 'Pengingat' },
  pengingat: { color: 'warning', icon: 'ri-alarm-line', label: 'Pengingat' },
  manual: { color: 'info', icon: 'ri-notification-line', label: 'Informasi' },
  payment: { color: 'success', icon: 'ri-cash-line', label: 'Pembayaran' },
  kematian: { color: 'error', icon: 'ri-heart-2-line', label: 'Kematian' },
  bulanan: { color: 'info', icon: 'ri-calendar-line', label: 'Bulanan' },
}

const getNotifConfig = (type: string) =>
  notifTypeConfig[type] ?? { color: 'secondary', icon: 'ri-notification-line', label: type }
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-4">
      <h2>Notifikasi</h2>
      <span class="text-body-2 text-medium-emphasis">
        Berisi informasi dan pemberitahuan penting yang diterima oleh pengguna.
      </span>
    </div>

    <!-- Loading awal -->
    <div v-if="notificationStore.loading && !notificationStore.hasData" class="d-flex justify-center py-6">
      <VProgressCircular size="26" indeterminate />
    </div>

    <!-- Empty -->
    <VAlert v-else-if="!notificationStore.hasData && !notificationStore.loading" type="info" variant="tonal"
      rounded="lg">
      Tidak ada notifikasi
    </VAlert>

    <!-- List -->
    <VRow v-if="notificationStore.hasData">
      <VCol v-for="notif in notificationStore.notifications" :key="notif.id" cols="12" sm="6">
        <VCard rounded="lg" border="sm" height="100%" :color="!notif.is_read ? 'blue-lighten-5' : undefined"
          class="position-relative pb-10">
          <VCardItem class="pa-4">
            <div class="d-flex align-start gap-3">

              <!-- Icon -->
              <VAvatar :color="getNotifConfig(notif.type).color" variant="tonal" size="40">
                <VIcon size="20">{{ getNotifConfig(notif.type).icon }}</VIcon>
              </VAvatar>

              <div class="flex-grow-1 min-width-0">
                <!-- Type chip & badge baru -->
                <div class="d-flex align-center justify-space-between mb-1">
                  <VChip :color="getNotifConfig(notif.type).color" size="x-small" variant="tonal">
                    {{ getNotifConfig(notif.type).label }}
                  </VChip>

                  <VChip v-if="!notif.is_read" color="primary" size="x-small" variant="flat">
                    Baru
                  </VChip>
                </div>

                <!-- Title -->
                <p class="font-weight-semibold text-body-2 mb-1 mt-1">
                  {{ notif.title }}
                </p>

                <!-- Message -->
                <p class="text-caption text-medium-emphasis ma-0">
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
          <VCardActions>
            <div class="position-absolute" style="right: 10px; bottom: 10px;">
              <VBtn color="secondary" variant="flat" size="small" block prepend-icon="ri-eye-line"
                @click="goToPayment(notif)">
                Lihat Pembayaran
              </VBtn>
            </div>
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
  </div>
</template>

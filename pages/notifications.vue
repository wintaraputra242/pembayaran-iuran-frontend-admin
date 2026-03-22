<script setup lang="ts">
import { useNotificationStore } from '@/stores/useNotificationStore'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const notificationStore = useNotificationStore()
const display = useDisplay()
const router = useRouter()

const page = ref(1)

const mobileSentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const loadNotifications = async () => {
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

const setupObserver = async () => {
  if (!display.smAndDown.value) return
  if (!notificationStore.hasMore || notificationStore.loading) return

  await nextTick()

  if (!mobileSentinel.value) return

  observer?.disconnect()

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !notificationStore.loading) {
        loadMore()
      }
    },
    {
      rootMargin: '100px',
    }
  )

  observer.observe(mobileSentinel.value)
}

const goToPayment = (notif: any) => {
  // asumsi backend mengirim payment_id di data notification
  if (notif.data?.payment_id) {
    router.push(`/pembayaran/${notif.data.payment_id}`)
  }
}

onMounted(async () => {
  await loadNotifications()

  // langsung tandai semua sebagai read
  await notificationStore.markAllAsRead()

  setupObserver()
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

watch(
  () => notificationStore.notifications.length,
  () => setupObserver()
)

watch(
  () => display.smAndDown.value,
  () => setupObserver()
)
</script>

<template>
  <VRow class="mb-2" align="center" justify="space-between">
    <VCol cols="auto">
      <div>
        <h2>Notifikasi</h2>
        <span class="text-body-2">Menampilkan informasi dan pemberitahuan terkait aktivitas serta update penting dalam sistem.</span>
      </div>
    </VCol>
  </VRow>

  <!-- LOADING -->
  <div v-if="notificationStore.loading && !notificationStore.hasData" class="text-center">
    <VProgressCircular
      size="26"
      indeterminate
    />
  </div>

  <!-- EMPTY -->
  <VAlert
    v-if="!notificationStore.hasData && !notificationStore.loading"
    type="info"
    variant="tonal"
  >
    Tidak ada notifikasi
  </VAlert>

  <!-- LIST -->
  <VRow v-if="notificationStore.hasData">
    <VCol
      cols="12"
      v-for="notif in notificationStore.notifications"
      :key="notif.id"
    >
      <VCard
        elevation="1"
        rounded="lg"
        :class="{ 'bg-blue-lighten-5': !notif.is_read }"
      >
        <VCardText>

          <div class="d-flex align-start ga-4">

            <VAvatar color="success" variant="tonal">
              <VIcon>ri-cash-line</VIcon>
            </VAvatar>

            <div class="flex-grow-1">

              <div class="font-weight-medium mb-1">
                {{ notif.title }}
              </div>

              <div class="text-body-2 text-medium-emphasis mb-2">
                {{ notif.message }}
              </div>

              <div class="text-caption text-grey">
                {{ formatDateID(notif.created_at) }}
              </div>

            </div>

          </div>

        </VCardText>

        <!-- ACTION -->
        <VCardActions class="justify-end mr-2 mb-2">

          <VBtn
            color="primary"
            variant="tonal"
            size="small"
            @click="goToPayment(notif)"
          >
            <VIcon start>ri-eye-line</VIcon>
            Lihat Pembayaran
          </VBtn>

        </VCardActions>

      </VCard>
    </VCol>
  </VRow>

  <!-- SENTINEL -->
  <div
    v-if="notificationStore.hasMore"
    ref="mobileSentinel"
    style="height: 1px"
  />

  <!-- LOADING MORE -->
  <div v-if="notificationStore.hasMore && notificationStore.loading" class="text-center py-4">
    <VProgressCircular indeterminate size="26" />
  </div>
</template>

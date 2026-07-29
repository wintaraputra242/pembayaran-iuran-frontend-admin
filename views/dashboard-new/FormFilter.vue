<script lang="ts" setup>
const props = defineProps<{
  modelValue?: 'notifikasi' | 'pembayaran' | 'warga_belum_bayar' | 'activity_log'
}>()

const emit = defineEmits<{
  (e: 'change', value: 'notifikasi' | 'pembayaran' | 'warga_belum_bayar' | 'activity_log'): void
}>()

const filters = [
  { label: 'Notifikasi', value: 'notifikasi', icon: 'ri-notification-line' },
  { label: 'Pembayaran Masuk', value: 'pembayaran', icon: 'ri-money-dollar-circle-line' },
  { label: 'Belum Bayar', value: 'warga_belum_bayar', icon: 'ri-user-unfollow-line' },
  { label: 'Log Aktivitas', value: 'activity_log', icon: 'ri-history-line' },
] as const

const active = computed(() => props.modelValue ?? 'warga_belum_bayar')

const handleClick = (value: typeof active.value) => {
  emit('change', value)
}
</script>

<template>
  <div class="d-flex flex-wrap gap-2">
    <VBtn v-for="f in filters" :key="f.value" :prepend-icon="f.icon"
      :variant="active === f.value ? 'elevated' : 'tonal'" :color="active === f.value ? 'primary' : 'default'"
      size="small" rounded="lg" @click="handleClick(f.value)">
      {{ f.label }}
    </VBtn>
  </div>
</template>

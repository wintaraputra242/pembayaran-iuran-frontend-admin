<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'change', value: 'notifikasi' | 'pembayaran' | 'warga_belum_bayar' | 'activity_log'): void
}>()

const show = ref<'Notifikasi' | 'Pembayaran Masuk' | 'Warga Belum Bayar' | 'Riwayat Log'>('Notifikasi')

const typeMap = {
  'Notifikasi': 'notifikasi',
  'Pembayaran Masuk': 'pembayaran',
  'Warga Belum Bayar': 'warga_belum_bayar',
  'Riwayat Log': 'activity_log',
} as const

watch(show, (val) => {
  emit('change', typeMap[val])
})

onMounted(() => {
  emit('change', 'notifikasi')
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="() => {}">
        <VRow align="center">
          <VCol cols="12">
            <VSelect
              v-model="show"
              :items="['Notifikasi', 'Pembayaran Masuk', 'Warga Belum Bayar', 'Riwayat Log']"
              placeholder="Pilih yang ingin ditampilkan"
            />
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
</template>

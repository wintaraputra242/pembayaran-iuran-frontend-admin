<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reload'): void;
}>();

const show = ref('Notifikasi')
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="() => {}">
        <VRow align="center">
          <VCol cols="9">
            <VSelect
              v-model="show"
              :items="['Notifikasi', 'Pembayaran Masuk', 'Warga Belum Bayar', 'Riwayat Log']"
              placeholder="Pilih yang ingin ditampilkan"
            />
          </VCol>
          <VCol cols="3">
            <div class="d-flex justify-center">
              <IconBtn variant="flat" color="primary" @click="emit('reload')">
                <VIcon icon="ri-restart-line" />
              </IconBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
</template>

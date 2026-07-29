<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const modelValueLocal = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => (modelValueLocal.value = val)
)

watch(modelValueLocal, val => emit('update:modelValue', val))

const handleClose = () => {
  modelValueLocal.value = false
}
</script>

<template>
  <VDialog v-model="modelValueLocal" max-width="420" persistent>
    <VCard class="pa-1">
      <!-- Title -->
      <VCardTitle class="text-h6 px-0">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2 px-4">
            <VIcon icon="ri-close-circle-line" color="error" size="20" />
            <span>Alasan Penolakan</span>
          </div>
          <div class="px-2">
            <IconBtn variant="text" color="secondary" size="x-small" @click="handleClose">
              <VIcon icon="ri-close-line" />
            </IconBtn>
          </div>
        </div>
      </VCardTitle>

      <VDivider />

      <VCardText class="pt-4">
        <!-- Info pembayaran -->
        <div class="rounded-lg border pa-3 mb-4">
          <div class="d-flex flex-column gap-1">
            <div class="d-flex align-center gap-2">
              <VIcon icon="ri-user-line" size="14" color="secondary" />
              <span class="text-body-2 text-medium-emphasis">Warga</span>
              <span class="text-body-2 font-weight-medium ms-auto">{{ item?.nama_warga_snapshot ?? '-' }}</span>
            </div>
            <div class="d-flex align-center gap-2">
              <VIcon icon="ri-calendar-line" size="14" color="secondary" />
              <span class="text-body-2 text-medium-emphasis">Tanggal Bayar</span>
              <span class="text-body-2 font-weight-medium ms-auto">{{ formatDateID(item?.tanggal_bayar) ?? '-' }}</span>
            </div>
            <div class="d-flex align-center gap-2">
              <VIcon icon="ri-money-rupee-circle-line" size="14" color="secondary" />
              <span class="text-body-2 text-medium-emphasis">Total</span>
              <span class="text-body-2 font-weight-medium ms-auto">{{ item?.total_bayar ? `Rp
                ${Number(item.total_bayar).toLocaleString('id-ID')}` : '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Alasan penolakan -->
        <p class="text-body-2 font-weight-medium mb-2">Alasan Penolakan</p>
        <div class="rounded-lg pa-3"
          style="background: rgba(var(--v-theme-error), 0.06); border: 1px dashed rgba(var(--v-theme-error), 0.4);">
          <div class="d-flex gap-2">
            <VIcon icon="ri-error-warning-line" color="error" size="16" class="mt-1 flex-shrink-0" />
            <span class="text-body-2" style="line-height: 1.6;">
              {{ item?.rejection_reason ?? 'Tidak ada alasan yang diberikan.' }}
            </span>
          </div>
        </div>

        <!-- Note jika ada -->
        <template v-if="item?.note">
          <p class="text-body-2 font-weight-medium mb-2 mt-4">Catatan</p>
          <div class="rounded-lg pa-3"
            style="background: rgba(var(--v-theme-warning), 0.06); border: 1px dashed rgba(var(--v-theme-warning), 0.4);">
            <div class="d-flex gap-2">
              <VIcon icon="ri-sticky-note-line" color="warning" size="16" class="mt-1 flex-shrink-0" />
              <span class="text-body-2" style="line-height: 1.6;">{{ item.note }}</span>
            </div>
          </div>
        </template>
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn color="secondary" variant="text" size="small" @click="handleClose">
          <VIcon icon="ri-close-line" class="me-1" />
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  src: {
    type: String,
    required: false,
    default: '/images/no-image.png'
  },
  lazySrc: {
    type: String,
    default: '/images/placeholder.png'
  },
  item: {
    type: Object,
    default: () => ({
      transaction_id: '',
      judul_iuran: '',
      nama_warga: ''
    })
  }
})

const emit = defineEmits(["update:modelValue", "close"])

// Local state agar dialog tetap bisa dikontrol dari dalam
const modelValueLocal = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => (modelValueLocal.value = val)
)

watch(modelValueLocal, val => emit("update:modelValue", val))

const handleClose = () => {
  emit("close")
  modelValueLocal.value = false
}
const dialog = ref(false)
</script>

<template>
  <div>
    <VDialog v-model="modelValueLocal" max-width="600">
      <VCard>
        <VCardTitle class="text-h6 px-0">
          <div class="d-flex align-center justify-space-between">
            <span class="px-4">Bukti Pembayaran</span>
            <div class="px-2">
              <IconBtn variant="text" color="secondary" size="x-small"  @click="handleClose">
                <VIcon icon="ri-close-line" />
              </IconBtn>
            </div>
          </div>
        </VCardTitle>

        <VCardText>
          <div>
            <p class="pa-0 ma-0 text-caption">Judul Iuran: {{ props.item.judul_iuran || '-' }}</p>
            <p class="pa-0 ma-0 text-caption">Nama Warga: {{ props.item.warga.nama_warga || '-' }}</p>
          </div>

          <VImg
            :src="src"
            height="450"
            rounded="lg"
            :lazy-src="lazySrc"
          >
            <template #placeholder>
              <VResponsive class="w-100 h-100">
                <VSkeletonLoader type="image" />
              </VResponsive>
            </template>
          </VImg>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import warner from '@images/pages/warner.png'
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: "Announcement message" },
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
</script>

<template>
  <VDialog
    v-model="modelValueLocal"
    max-width="420"
    persistent
  >
    <VCard class="pa-1">
      <!-- Title -->
      <VCardTitle class="text-h6 px-0">
        <div class="d-flex align-center justify-end">
          <div class="px-2">
            <IconBtn variant="text" color="secondary" size="x-small"  @click="handleClose">
              <VIcon icon="ri-close-line" />
            </IconBtn>
          </div>
        </div>
      </VCardTitle>

      <VCardItem class="text-body-2">
        <VImg :src="warner" width="100%" class="mx-auto" />
      </VCardItem>

      <VCardText class="text-body-2">
        {{ message }}
      </VCardText>

      <VCardActions class="justify-end gap-2">
        <VBtn
          color="secondary"
          variant="text"
          size="small"
          @click="handleClose"
        >
          OK
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

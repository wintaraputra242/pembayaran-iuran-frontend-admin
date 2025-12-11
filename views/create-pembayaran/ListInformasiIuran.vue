<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'showFormData'): void;
}>();

const props = withDefaults(defineProps<{
  type: string
}>(), {
  type: 'kematian'
})

const filter = reactive({
  keyword: '',
})
</script>

<template>
  <VRow>
    <VCol v-for="item, i in 4" :key="i" cols="12">
      <VCard elevation="0" to="/create-pembayaran/test">
        <VCardTitle>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h4>Iuran Tahun 2025</h4>
              <p class="text-caption ma-0">31 Desember 2025</p>
            </div>
            <!-- <VChip :color="'info'">
              Bulanan
            </VChip> -->
            <VChip size="small" :color="props.type === 'kematian' ? 'error' : 'info'">
              {{ props.type === 'kematian' ? 'Kematian' : 'Bulanan' }}
            </VChip>
          </div>
        </VCardTitle>
        <VCardText class="px-4">
          <p class="pa-0 ma-0 text-caption">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae nemo assumenda tempora culpa impedit tempore iusto quibusdam nisi, error in odio corrupti blanditiis ut.</p>
          <p class="pa-0 ma-0 mt-3 text-end font-weight-bold">Rp. 40.000</p>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

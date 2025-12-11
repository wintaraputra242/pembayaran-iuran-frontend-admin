<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'showFormData'): void;
  (e: 'exportExcel'): void;
}>();

const filter = reactive({
  date: '',
  date_range: '',
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="() => {}">
        <VRow align="center">
          <VCol cols="12">
            <DatePicker
              v-model="filter.date"
              placeholder="Pilih tgl. pembayaran"
              :enable-time="false"
            />
          </VCol>
          <VCol cols="12">
            <DatePicker
              v-model="filter.date_range"
              placeholder="Pilih rentang tgl. pembayaran"
              range
              :enable-time="false"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn variant="flat" color="primary">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>
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

<script setup lang="ts">
import DataTableWarga from '@/views/warga/DataTable.vue';
import DialogFormData from '@/views/warga/DialogFormData.vue';
import FormFilterWarga from '@/views/warga/FormFilter.vue';

const showFormData = ref(false)
</script>

<template>
  <div>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterWarga @show-form-data="showFormData = true" />
      </VCol>
  
      <VCol
        cols="12"
        md="4"
      >
        <DataTableWarga />
      </VCol>
    </VRow>

    <DialogFormData :is-show="showFormData" @close="showFormData = false" />
  </div>
</template>

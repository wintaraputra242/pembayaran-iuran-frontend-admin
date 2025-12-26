<script setup lang="ts">
import DataTableAnggotaReguList from '@/views/regu-list/DataTableAnggota.vue';
import DataTableNoPaymentReguList from '@/views/regu-list/DataTableNoPayment.vue';

definePageMeta({
  middleware: ['admin']
})

const tab = ref('anggota')

const filters = reactive({
  anggota: '',
  belum_bayar: '',
})
</script>

<template>
  <div>
    <div class="mb-4">
      <h2>Regu Saya</h2>
      <span>Informasi terkait dengan anggota regu Anda, beserta anggota regu Anda yang belum bayar</span>
    </div>
    <VTabs v-model="tab" color="primary">
      <VTab value="anggota">Anggota</VTab>
      <VTab value="belum_bayar">Belum Bayar</VTab>
    </VTabs>

    <VDivider></VDivider>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem value="anggota">
        <div class="py-3">
          <VTextField
            v-model="filters.anggota"
            placeholder="Cari anggota regu Anda"
            prepend-inner-icon="ri-search-2-line"
          />
        </div>
        <DataTableAnggotaReguList />
      </VTabsWindowItem>
      <VTabsWindowItem value="belum_bayar">
        <div class="py-3">
          <VTextField
            v-model="filters.belum_bayar"
            placeholder="Cari anggota regu belum bayar"
            prepend-inner-icon="ri-search-2-line"
          />
        </div>
        <DataTableNoPaymentReguList />
      </VTabsWindowItem>
    </VTabsWindow>
  </div>
</template>

<script setup lang="ts">
import ListInformasiIuranCreatePembayaran from '@/views/create-pembayaran/ListInformasiIuran.vue';

definePageMeta({
  middleware: ['ketua-regu']
})

const uiStore = useUiStore()

const tab = ref('kematian')

const filters = reactive({
  kematian: '',
  bulanan: '',
})

onMounted(() => {
  const fromPath = useCookie('from-path')

  if (uiStore.isLoading && fromPath.value === '/login') {
      uiStore.endLoading()
      fromPath.value = null
  }
})
</script>

<template>
  <div class="mt-n5">
    <div class="mb-4">
      <div class="mb-3">
        <VBtn class="px-0 py-1" variant="text" size="large" to="/pembayaran">
          <VIcon icon="ri-arrow-left-s-line" class="me-2" />
          Keluar
        </VBtn>
      </div>
      <h2>Informasi Iuran</h2>
      <span>Pilih informasi iuran terlebih dahulu sebelum menambahkan pembayaran</span>
    </div>
    <VTabs v-model="tab" color="primary">
      <VTab value="kematian">Kematian</VTab>
      <VTab value="bulanan">Bulanan</VTab>
    </VTabs>

    <VDivider></VDivider>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem value="kematian">
        <div class="py-3">
          <VTextField
            v-model="filters.kematian"
            placeholder="Cari informasi iuran kematian"
            prepend-inner-icon="ri-search-2-line"
          />
        </div>
        <ListInformasiIuranCreatePembayaran :type="'kematian'" />
      </VTabsWindowItem>
      <VTabsWindowItem value="bulanan">
        <div class="py-3">
          <VTextField
            v-model="filters.bulanan"
            placeholder="Cari informasi iuran bulanan"
            prepend-inner-icon="ri-search-2-line"
          />
        </div>
        <ListInformasiIuranCreatePembayaran :type="'bulanan'" />
      </VTabsWindowItem>
    </VTabsWindow>
  </div>
</template>

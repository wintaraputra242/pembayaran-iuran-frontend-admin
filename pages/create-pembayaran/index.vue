<script setup lang="ts">
import ListInformasiIuranCreatePembayaran from '@/views/create-pembayaran/ListInformasiIuran.vue'

definePageMeta({
  middleware: ['role']
})

const route = useRoute()

const uiStore = useUiStore()
const masterStore = useMasterInformasiIuranStore()

const tab = ref<'kematian' | 'bulanan'>('kematian')
const page = ref(1)

const filters = reactive({
  kematian: '',
  bulanan: '',
})

const kematianItems = computed(() =>
  masterStore.informasiIuran.filter(i => i.jenis_iuran === 'kematian')
)

const bulananItems = computed(() =>
  masterStore.informasiIuran.filter(i => i.jenis_iuran === 'bulanan')
)

const loadData = async (type: 'kematian' | 'bulanan') => {
  masterStore.reload = true
  masterStore.filters.keyword = filters[type] || ''

  page.value = 1
  
  await masterStore.fetchInformasiIuran({
    page: page.value,
    limit: 10,
    mode: 'admin',
    jenis_iuran: type
  })
}

watch(tab, (val) => {
  loadData(val)
})

watch(() => filters.kematian, () => {
  if (tab.value === 'kematian') loadData('kematian')
})

watch(() => filters.bulanan, (newVal) => {
  if (!newVal && tab.value === 'bulanan') loadData('bulanan')
})

watch(() => route.query.jenis_iuran, (newVal) => {
  if (newVal) {
    tab.value = newVal as 'kematian' | 'bulanan'
  }
}, { immediate: true })

const handleLoadMore = async () => {
  page.value += 1

  await masterStore.fetchInformasiIuran({
    page: page.value,
    limit: 10,
    mode: 'admin',
    jenis_iuran: tab.value
  })
}

onMounted(() => {
  loadData('kematian')
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
      <VTabsWindowItem class="py-5" value="kematian">
        <div class="mb-3">
          <VTextField
            v-model="filters.kematian"
            placeholder="Cari informasi iuran kematian"
            prepend-inner-icon="ri-search-2-line"
          />
        </div>
        <ListInformasiIuranCreatePembayaran :has-more="masterStore.hasMore" :loading="masterStore.loading" :items="kematianItems" @load-more="handleLoadMore" />
      </VTabsWindowItem>
      <VTabsWindowItem class="py-5" value="bulanan">
        <div class="mb-3">
          <VTextField
            v-model="filters.bulanan"
            placeholder="Cari informasi iuran bulanan"
            prepend-inner-icon="ri-search-2-line"
          />
        </div>
        <ListInformasiIuranCreatePembayaran :has-more="masterStore.hasMore" :loading="masterStore.loading" :items="bulananItems" @load-more="handleLoadMore" />
      </VTabsWindowItem>
    </VTabsWindow>
  </div>
</template>

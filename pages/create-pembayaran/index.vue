<script setup lang="ts">
import ListInformasiIuranCreatePembayaran from '@/views/create-pembayaran/ListInformasiIuran.vue'

definePageMeta({ adminAndKetuaRegu: true })

const route = useRoute()

const authStore = useAuthStore()
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

  await masterStore.fetchInformasiIuranActive({
    page: page.value,
    limit: 10,
    jenis_iuran: type,
    keyword: filters[type]
  })
}

watch(tab, (val) => {
  loadData(val)
})

let debounceTimer: any

watch(() => filters.kematian, (val) => {
  if (tab.value !== 'kematian') return

  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    loadData('kematian')
  }, 500)
})

watch(() => filters.bulanan, (val) => {
  if (tab.value !== 'bulanan') return

  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    loadData('bulanan')
  }, 500)
})

watch(() => route.query.jenis_iuran, (newVal) => {
  if (newVal) {
    tab.value = newVal as 'kematian' | 'bulanan'
  }
}, { immediate: true })

const handleLoadMore = async () => {
  page.value += 1

  await masterStore.fetchInformasiIuranActive({
    page: page.value,
    limit: 10,
    jenis_iuran: tab.value
  })
}

onMounted(() => {
  const fromPath = useCookie('from-path')

  if (authStore.user?.role === 'ketua_regu' && uiStore.isLoading && fromPath.value === '/login') {
    uiStore.endLoading()
    fromPath.value = null
  }

  loadData('kematian')
})
</script>

<template>
  <div class="mt-n5">
    <div class="mb-4">
      <div v-if="authStore.user?.role === 'admin'" class="mb-3">
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
          <VTextField v-model="filters.kematian" placeholder="Cari informasi iuran kematian"
            prepend-inner-icon="ri-search-2-line" />
        </div>
        <ListInformasiIuranCreatePembayaran :has-more="masterStore.hasMore" :loading="masterStore.loading"
          :items="kematianItems" @load-more="handleLoadMore" />
      </VTabsWindowItem>
      <VTabsWindowItem class="py-5" value="bulanan">
        <div class="mb-3">
          <VTextField v-model="filters.bulanan" placeholder="Cari informasi iuran bulanan"
            prepend-inner-icon="ri-search-2-line" />
        </div>
        <ListInformasiIuranCreatePembayaran :has-more="masterStore.hasMore" :loading="masterStore.loading"
          :items="bulananItems" @load-more="handleLoadMore" />
      </VTabsWindowItem>
    </VTabsWindow>
  </div>
</template>

<script setup lang="ts">
import type { MasterUser } from '@/types/api/master-users';
import DataTableUsers from '@/views/users/DataTable.vue';
import FormFilterUsers from '@/views/users/FormFilter.vue';

definePageMeta({
  middleware: ['admin']
})

const config = useRuntimeConfig()

const masterUsersStore = useMasterUsersStore()

const showFormData = ref(false)
const isEdit = ref(false)

const handleCloseFormData = () => {
  if (isCreate.value) isCreate.value = false
  if (isEdit.value) isEdit.value = false

  showFormData.value = false
}

const itemSelected = ref<object | null>(null)

const handleEditData = (item: object) => {
  showFormData.value = true 
  isEdit.value = true
  itemSelected.value = item
}

const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)

async function deleteItem() {
  isLoadingConfirm.value = true

  // contoh request
  await new Promise(res => setTimeout(res, 1000))

  isLoadingConfirm.value = false
  showConfirmation.value = false

  console.log("Item dihapus!")
}

const confirmOptions = {
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  confirmColor: '',
  confirmIcon: '',
}

const isCreate = ref(false)

const page = ref(1)

const handleLoadMore = () => {
  page.value += 1
  masterUsersStore.fetchUsers({ limit: 10, page: page.value })
}

const handleFilter = (filters: { keyword: string, role: null | string }) => {
  page.value = 1
  masterUsersStore.reload = true
  Object.entries(filters).forEach(([key, value]) => {
    masterUsersStore.setFilter(key as 'role' | 'keyword', value as string)
  })
  masterUsersStore.fetchUsers({ limit: 10, page: page.value })
}

const handleReload = () => {
  page.value = 1
  masterUsersStore.reload = true
  masterUsersStore.resetFilter()
  masterUsersStore.fetchUsers({ limit: 10, page: page.value })
}

const handleGetPassword = (item: MasterUser) => {
  showCredential.value = true
  itemSelected.value = item
}

const showCredential = ref(false)

const handleDownloadCredentials = async () => {
  window.open(config.public.backendUrl + '/regu/credential/download', '_blank')
}

onMounted(async () => {
  await masterUsersStore.fetchUsers({ limit: 10, page: page.value })
})
</script>

<template>
  <div>
    <h2 class="mb-3">Data Pengguna</h2>
    <VRow class="match-height">
      <VCol
        cols="12"
      >
        <FormFilterUsers :loading-download="masterUsersStore.loadingDownload" @download-credentials="handleDownloadCredentials" @filter="handleFilter" @reload="handleReload" />
      </VCol>
  
      <VCol
        cols="12"
      >
        <DataTableUsers :data="masterUsersStore.users" :meta="masterUsersStore.meta" :loading="masterUsersStore.loading" :has-more="masterUsersStore.hasMore" :has-filter="masterUsersStore.hasFilter" @get-password="handleGetPassword" @load-more="handleLoadMore" />
      </VCol>
    </VRow>

    <ConfirmDialog
      v-model="showConfirmation"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor"
      :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm"
      @confirm="deleteItem"
    />
  </div>
</template>

<script setup lang="ts">
import type { MasterUser } from '@/types/api/master-users'
import DataTableUsers from '@/views/users/DataTable.vue'
import FormFilterUsers from '@/views/users/FormFilter.vue'

definePageMeta({ onlyAdmin: true })

const masterUsersStore = useMasterUsersStore()
const uiStore = useUiStore()

const showCredential = ref(false)
const showConfirmation = ref(false)
const isLoadingConfirm = ref(false)
const itemSelected = ref<MasterUser | null>(null)
const page = ref(1)

const confirmOptions = reactive({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Batal',
  confirmColor: '',
  confirmIcon: '',
})

// -------------------------------------------------------
// LOAD
// -------------------------------------------------------
onMounted(async () => {
  if (masterUsersStore.page) page.value = masterUsersStore.page
  if (masterUsersStore.page === 0) {
    await masterUsersStore.fetchUsers({ limit: 10, page: page.value })
  }
})

// -------------------------------------------------------
// FILTER & RELOAD
// -------------------------------------------------------
const handleLoadMore = () => {
  page.value++
  masterUsersStore.fetchUsers({ limit: 10, page: page.value })
}

const handleFilter = (filters: { keyword: string; role: null | string }) => {
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

// -------------------------------------------------------
// AKSI
// -------------------------------------------------------
const handleGetPassword = (item: MasterUser) => {
  itemSelected.value = item
  showCredential.value = true
}

const handleDeleteConfirm = (item: MasterUser) => {
  itemSelected.value = item
  confirmOptions.title = 'Hapus Pengguna'
  confirmOptions.message = `Apakah Anda yakin ingin menghapus akun *${item.name}*? Tindakan ini tidak dapat dibatalkan.`
  confirmOptions.confirmText = 'Hapus'
  confirmOptions.confirmColor = 'error'
  confirmOptions.confirmIcon = 'ri-delete-bin-line'
  showConfirmation.value = true
}

const handleDeleteItem = async () => {
  if (!itemSelected.value) return
  isLoadingConfirm.value = true

  try {
    const res = await masterUsersStore.deleteUser((itemSelected.value as MasterUser).id)
    if (res?.success) {
      uiStore.showSuccess('Pengguna berhasil dihapus.')
      showConfirmation.value = false
      handleReload()
    }
  } finally {
    isLoadingConfirm.value = false
  }
}

const handleDownloadCredentials = async () => {
  await masterUsersStore.downloadCredential()
}
</script>

<template>
  <div>
    <div class="mb-3">
      <h2>Data Pengguna</h2>
      <span class="text-body-2">
        Kelola data akun pengguna yang memiliki akses ke sistem beserta perannya.
      </span>
    </div>

    <VRow class="match-height">
      <VCol cols="12">
        <FormFilterUsers :loading-download="masterUsersStore.loadingDownload"
          :initial-keyword="masterUsersStore.filters?.keyword ?? ''"
          :initial-role="masterUsersStore.filters?.role ? masterUsersStore.filters?.role : null"
          @download-credentials="handleDownloadCredentials" @filter="handleFilter" @reload="handleReload" />
      </VCol>

      <VCol cols="12">
        <DataTableUsers :data="masterUsersStore.users" :meta="masterUsersStore.meta" :loading="masterUsersStore.loading"
          :has-more="masterUsersStore.hasMore" :has-filter="masterUsersStore.hasFilter"
          @get-password="handleGetPassword" @delete="handleDeleteConfirm" @load-more="handleLoadMore" />
      </VCol>
    </VRow>

    <!-- Dialog credential -->
    <VDialog v-model="showCredential" max-width="400">
      <VCard rounded="lg">
        <VCardTitle class="pa-4 d-flex align-center gap-2">
          <VIcon icon="ri-key-line" color="primary" />
          Informasi Akun
        </VCardTitle>
        <VDivider />
        <VCardText class="pa-4">
          <div class="d-flex flex-column gap-3">
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Nama</p>
              <p class="font-weight-bold mb-0">{{ (itemSelected as MasterUser)?.name }}</p>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Username</p>
              <VTextField :model-value="(itemSelected as MasterUser)?.username" readonly density="compact"
                variant="outlined" append-inner-icon="ri-file-copy-line" @click:append-inner="() => {
                  navigator.clipboard.writeText((itemSelected as MasterUser)?.username ?? '')
                  uiStore.showSuccess('Username disalin!')
                }" />
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Role</p>
              <VChip size="small" :color="(itemSelected as MasterUser)?.role === 'admin' ? 'success' : 'info'">
                {{ (itemSelected as MasterUser)?.role === 'admin' ? 'Admin' : 'Ketua Regu' }}
              </VChip>
            </div>
          </div>
        </VCardText>
        <VDivider />
        <VCardText class="pa-4">
          <VBtn block variant="tonal" color="secondary" @click="showCredential = false">
            Tutup
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog konfirmasi hapus -->
    <ConfirmDialog v-model="showConfirmation" :title="confirmOptions.title" :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText" :cancel-text="confirmOptions.cancelText"
      :confirm-color="confirmOptions.confirmColor" :confirm-icon="confirmOptions.confirmIcon"
      :loading="isLoadingConfirm" @confirm="handleDeleteItem" />
  </div>
</template>

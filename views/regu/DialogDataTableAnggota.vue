<script setup lang="ts">
import type { WargaForDropdown } from '@/types/api/dropdown';
import type { AnggotaRegu, MasterRegu } from '@/types/api/master-regu';

const emit = defineEmits<{
  (e: 'setLeader', item: AnggotaRegu): void;
  (e: 'changeLeader', item: object): void;
  (e: 'close'): void;
  (e: 'resetAnggota', item?: AnggotaRegu): void;
  (e: 'detailAnggota', item: AnggotaRegu): void;
  (e: 'fetchDropdownAddAnggota'): void;
  (e: 'submitAddAnggota', params: { warga: string[] | null }): void;
  (e: 'addAnggota', params: { niks: string[] }): void // ← tambah
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  isFetchSuccess?: boolean
  isLeaderAvailable?: boolean
  data: AnggotaRegu[]
  item: MasterRegu | null
  loading: boolean
  itemDropdownAddAnggota?: WargaForDropdown[]
  loadingDropdownAddAnggota?: boolean
}>(), {
  isShow: false,
  data: () => ([]),
  item: null,
  loading: false,
  loadingDropdownAddAnggota: false,
})

const masterWargaStore = useMasterWargaStore()

const handleClose = () => {
  tab.value = 'table'

  emit('close')
}

const tab = ref('table')

const defaultParamsAddAnggota = {
  warga: null,
}
const params = reactive({ ...defaultParamsAddAnggota })

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  warga: (v: string) => {
    if (!v) return "Pilih Warga wajib diisi"
    return true
  },
}

const itemSelected = ref<AnggotaRegu | null>(null)

// const handleDetailAnggota = (item: AnggotaRegu) => {
//   tab.value = 'detail-warga'

//   itemSelected.value = item

//   emit('detailAnggota', item)
// }

const handleCloseAddAnggota = () => {
  if (tab.value === 'form') form.value.reset()

  tab.value = 'table'
}

const btnTabStyle: any = {
  table: {
    color: 'success',
    action: () => {
      tab.value = 'form'
      emit('fetchDropdownAddAnggota')
    },
    icon: 'ri-add-line',
    content: 'Tambah Anggota',
  },
  form: {
    color: 'secondary',
    action: handleCloseAddAnggota,
    icon: 'ri-close-line',
    content: 'Batal',
  },
  'detail-warga': {
    color: 'secondary',
    action: () => { tab.value = 'table' },
    icon: 'ri-arrow-left-s-line',
    content: 'Kembali',
  },
}

const headers = [
  { key: 'no', label: 'No.' },
  { key: 'nama_anggota', label: 'Nama Anggota' },
  { key: 'status_anggota', label: 'Status Keanggotaan' },
  { key: 'actions' },
]

const form = ref()

watch(() => props.isFetchSuccess, (val) => {
  if (val) {
    formAnggota.value?.reset()
    paramsAnggota.warga = []
    tab.value = 'table'
  }
}, { immediate: false })

// const tab = ref('table')
// const itemSelected = ref<any>(null)

const handleDetailAnggota = (item: any) => {
  itemSelected.value = item

  console.log(itemSelected.value);

  tab.value = 'detail-warga'
  emit('detailAnggota', item)
}

// Reset tab saat dialog ditutup
watch(() => props.isShow, (val) => {
  if (!val) {
    tab.value = 'table'
    itemSelected.value = null
  }
})

// Tambah di script
const formAnggota = ref()
const paramsAnggota = reactive({ warga: [] as string[] })

const handleOpenFormAnggota = () => {
  tab.value = 'form'
  emit('fetchDropdownAddAnggota')
}

const handleCloseFormAnggota = () => {
  formAnggota.value?.reset()
  paramsAnggota.warga = []
  tab.value = 'table'
}

const handleSubmitAddAnggota = async () => {
  const { valid } = await formAnggota.value?.validate()
  if (!valid) return
  emit('submitAddAnggota', params as { warga: string[] | null })
}

// Reset saat isFetchSuccess
watch(() => props.isFetchSuccess, (val) => {
  if (val) handleCloseFormAnggota()
})
</script>

<template>
  <VDialog v-model="props.isShow" :max-width="500">
    <VCard style="max-height: 90dvh; display: flex; flex-direction: column;">

      <!-- Header -->
      <VCardTitle class="pa-4 flex-shrink-0">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2">
            <!-- Tombol back saat di detail -->
            <IconBtn v-if="tab !== 'table'" variant="text" color="secondary" size="small"
              @click="tab === 'form' ? handleCloseFormAnggota() : tab = 'table'">
              <VIcon icon="ri-arrow-left-s-line" />
            </IconBtn>
            <h3 class="text-truncate" style="max-width: 260px; font-size: 16px;">
              {{ tab === 'detail-warga'
                ? itemSelected?.warga?.nama_warga
                : tab === 'form'
                  ? 'Tambah Anggota'
                  : `Anggota ${props.item?.nama_regu}`
              }}
            </h3>
          </div>
          <IconBtn variant="text" color="secondary" size="small" @click="emit('close')">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>

      <VTabsWindow v-model="tab"
        style="flex: 1 1 auto; min-height: 0; overflow: hidden; display: flex; flex-direction: column;">

        <!-- TAB LIST ANGGOTA -->
        <VTabsWindowItem value="table"
          style="flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow: hidden;">

          <!-- Tombol & info -->
          <div class="px-4 pb-3 flex-shrink-0">
            <div class="d-flex flex-wrap gap-2 mb-2">
              <VBtn variant="flat" color="success" size="small" @click="handleOpenFormAnggota">
                <VIcon icon="ri-add-large-line" class="me-1" />
                Tambah Anggota
              </VBtn>
              <VBtn variant="flat" color="error" size="small" @click="emit('resetAnggota')">
                <VIcon icon="ri-user-community-line" class="me-1" />
                Reset Anggota
              </VBtn>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Jml. Anggota: <strong>{{ props.data?.length ?? 0 }}</strong>
            </p>
          </div>

          <VDivider />

          <!-- List scrollable -->
          <div class="pa-3" style="overflow-y: auto; flex: 1 1 auto; min-height: 0; max-height: 400px;">
            <div v-if="props.loading" class="d-flex justify-center py-4">
              <VProgressCircular indeterminate size="26" />
            </div>

            <div v-else-if="!props.data?.length" class="text-center py-4 text-medium-emphasis">
              Belum ada anggota
            </div>

            <div v-else class="d-flex flex-column gap-2">
              <VCard v-for="(item, index) in props.data" :key="item.id" variant="outlined" rounded="lg">
                <VCardItem class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VAvatar color="primary" variant="tonal" size="36">
                        <span class="text-body-2 font-weight-bold">{{ index + 1 }}</span>
                      </VAvatar>
                      <div>
                        <p class="font-weight-semibold mb-0" style="font-size: 14px;">
                          {{ item.warga?.nama_warga }}
                        </p>
                        <VChip size="x-small" :color="item.is_leader ? 'info' : 'default'"
                          :prepend-icon="item.is_leader ? 'ri-vip-crown-line' : ''" variant="tonal" class="mt-1">
                          {{ item.is_leader ? 'Ketua Regu' : 'Anggota' }}
                        </VChip>
                      </div>
                    </div>

                    <div class="d-flex gap-1">
                      <VTooltip v-if="!item.is_leader" text="Jadikan Ketua Regu">
                        <template #activator="{ props: tp }">
                          <IconBtn v-bind="tp" variant="outlined" size="small" color="info" class="rounded-lg"
                            @click="emit('setLeader', item)">
                            <VIcon icon="ri-vip-crown-line" />
                          </IconBtn>
                        </template>
                      </VTooltip>

                      <VTooltip text="Detail Warga">
                        <template #activator="{ props: tp }">
                          <IconBtn v-bind="tp" variant="outlined" size="small" color="secondary" class="rounded-lg"
                            @click="handleDetailAnggota(item)">
                            <VIcon icon="ri-info-card-line" />
                          </IconBtn>
                        </template>
                      </VTooltip>

                      <VTooltip text="Hapus Anggota">
                        <template #activator="{ props: tp }">
                          <IconBtn v-bind="tp" variant="outlined" size="small" color="error" class="rounded-lg"
                            @click="emit('resetAnggota', item)">
                            <VIcon icon="ri-delete-bin-line" />
                          </IconBtn>
                        </template>
                      </VTooltip>
                    </div>
                  </div>
                </VCardItem>
              </VCard>
            </div>
          </div>
        </VTabsWindowItem>

        <!-- TAB DETAIL WARGA -->
        <VTabsWindowItem value="detail-warga" style="overflow-y: auto; flex: 1 1 auto; min-height: 0;">
          <div v-if="itemSelected" class="pa-4 d-flex flex-column gap-3">

            <!-- Info dasar -->
            <VCard variant="outlined" rounded="lg">
              <VCardItem class="pa-4">
                <div class="d-flex align-center gap-3 mb-3">
                  <VAvatar color="primary" variant="tonal" size="48">
                    <VIcon icon="ri-user-line" size="24" />
                  </VAvatar>
                  <div>
                    <p class="font-weight-bold mb-0">{{ itemSelected.warga?.nama_warga }}</p>
                    <VChip size="x-small" :color="itemSelected.is_leader ? 'info' : 'default'"
                      :prepend-icon="itemSelected.is_leader ? 'ri-vip-crown-line' : ''" variant="tonal">
                      {{ itemSelected.is_leader ? 'Ketua Regu' : 'Anggota' }}
                    </VChip>
                  </div>
                </div>

                <VDivider class="mb-3" />

                <div class="d-flex flex-column gap-2">
                  <div class="d-flex justify-space-between">
                    <span class="text-caption text-medium-emphasis">NIK</span>
                    <span class="text-body-2 font-weight-medium">{{ itemSelected.warga?.nik ?? '-' }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-caption text-medium-emphasis">No. HP</span>
                    <a v-if="itemSelected.warga?.no_hp"
                      :href="`https://wa.me/${itemSelected.warga.no_hp.replace(/\D/g, '').replace(/^0/, '62')}`"
                      target="_blank" rel="noopener noreferrer"
                      class="text-decoration-none d-inline-flex align-center gap-1 px-2 py-1 rounded-lg"
                      style="background: rgba(37, 211, 102, 0.1); border: 1px solid rgba(37, 211, 102, 0.3);">
                      <VIcon icon="ri-whatsapp-line" size="13" color="success" />
                      <span class="text-caption font-weight-medium" style="color: #25d366;">
                        {{ itemSelected.warga.no_hp }}
                      </span>
                      <VIcon icon="ri-external-link-line" size="11" style="color: #25d366; opacity: 0.7;" />
                    </a>
                    <span v-else class="text-body-2 text-medium-emphasis">-</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-caption text-medium-emphasis">Alamat</span>
                    <span class="text-body-2 font-weight-medium text-right" style="max-width: 60%;">
                      {{ itemSelected.warga?.alamat ?? '-' }}
                    </span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-caption text-medium-emphasis">Status</span>
                    <VChip size="x-small"
                      :color="itemSelected.warga?.status_keaktifan === 'aktif' ? 'success' : 'error'" variant="tonal">
                      {{ itemSelected.warga?.status_keaktifan === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
                    </VChip>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="text-caption text-medium-emphasis">Bergabung</span>
                    <span class="text-body-2 font-weight-medium">
                      {{ itemSelected.warga?.created_at ? formatDateID(itemSelected.warga.created_at) : '-' }}
                    </span>
                  </div>
                </div>
              </VCardItem>
            </VCard>

          </div>
        </VTabsWindowItem>

        <VTabsWindowItem value="form" style="overflow-y: auto; flex: 1 1 auto; min-height: 0;">
          <VForm ref="formAnggota" class="pa-4" @submit.prevent="handleSubmitAddAnggota">
            <VRow>
              <VCol cols="12">
                <VAutocomplete v-model="params.warga" label="Pilih Warga"
                  placeholder="Pilih warga yang ingin dijadikan anggota" multiple item-title="nama_warga"
                  item-value="nik" :items="props.itemDropdownAddAnggota" :loading="props.loadingDropdownAddAnggota"
                  :rules="[(v: string[]) => (!!v && v.length > 0) || 'Pilih warga terlebih dahulu']" />
              </VCol>
              <VCol cols="12">
                <div class="d-flex justify-end gap-2">
                  <VBtn variant="text" color="secondary" size="small" @click="handleCloseFormAnggota">
                    <VIcon icon="ri-close-line" class="me-1" />
                    Batal
                  </VBtn>
                  <VBtn variant="flat" color="success" size="small" type="submit" :loading="props.loading">
                    <VIcon icon="ri-add-line" class="me-1" />
                    Tambah
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VTabsWindowItem>

      </VTabsWindow>
    </VCard>
  </VDialog>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>

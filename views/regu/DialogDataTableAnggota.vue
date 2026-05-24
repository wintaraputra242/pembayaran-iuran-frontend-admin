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

const handleDetailAnggota = (item: AnggotaRegu) => {
  tab.value = 'detail-warga'

  itemSelected.value = item

  emit('detailAnggota', item)
}

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

const handleSubmitAddAnggota = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  emit('submitAddAnggota', params as { warga: string[] | null })
}

watch(() => props.isFetchSuccess, (newVal) => {
  if (newVal) {
    handleCloseAddAnggota()
  }
}, { immediate: true })
</script>

<template>
  <VDialog max-width="700px" v-model="props.isShow">
    <VCard class="pa-0">
      <VCardTitle class="pt-3">
        <div class="d-flex align-center justify-space-between">
          <h4>Anggota {{ item?.nama_regu || 'Regu A' }}</h4>
          <IconBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardText class="pb-0 py-1">
        <div class="d-flex justify-end flex-wrap gap-2">
          <VBtn :disabled="props.loading && tab === 'form'" variant="flat" :color="btnTabStyle[tab].color"
            @click="btnTabStyle[tab].action">
            <VIcon :icon="btnTabStyle[tab].icon" />
            {{ btnTabStyle[tab].content }}
          </VBtn>
          <VBtn v-if="tab === 'table' && data.length > 0" variant="flat" color="error" @click="emit('resetAnggota')">
            <VIcon icon="ri-user-community-line" class="me-1" />
            Reset Anggota
          </VBtn>
        </div>
      </VCardText>
      <VCardItem class="pa-2">
        <VTabsWindow v-model="tab">
          <VTabsWindowItem value="table">
            <div class="text-center my-5 font-weight-bold">Jml. Anggota: {{ data?.length || '0' }}</div>

            <div class="table-scroll-wrapper pa-2">
              <AppDataTable :headers="headers" :items="props.data" :loading="props.loading"
                no-data-text="Tidak ada anggota" variant="outlined">
                <template #cell-nama_anggota="{ item }">
                  <span>{{ item.warga.nama_warga }}</span>
                </template>

                <template #cell-status_anggota="{ item }">
                  <VChip size="small" :color="item.is_leader ? 'info' : ''"
                    :prepend-icon="item.is_leader ? 'ri-vip-crown-line' : ''">
                    {{ item.is_leader ? 'Ketua Regu' : 'Anggota' }}
                  </VChip>
                </template>

                <template #cell-actions="{ item }">
                  <div style="width: 34px;">
                    <IconBtn v-if="item.is_leader !== 1 && props.isLeaderAvailable" variant="outlined"
                      class="rounded-lg" size="small" color="secondary" @click="emit('setLeader', item)">
                      <VIcon icon="ri-loop-left-line" />
                    </IconBtn>
                  </div>
                  <IconBtn v-if="!props.isLeaderAvailable" variant="outlined" class="rounded-lg" size="small"
                    color="secondary" @click="emit('setLeader', item)">
                    <VIcon icon="ri-vip-crown-line" />
                  </IconBtn>
                  <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary"
                    @click="handleDetailAnggota(item)">
                    <VIcon icon="ri-info-card-line" />
                  </IconBtn>
                  <IconBtn variant="outlined" class="rounded-lg" size="small" color="error"
                    @click="emit('resetAnggota', item)">
                    <VIcon icon="ri-delete-bin-line" />
                  </IconBtn>
                </template>
              </AppDataTable>
            </div>
          </VTabsWindowItem>
          <VTabsWindowItem value="form">
            <VForm ref="form" @submit.prevent="handleSubmitAddAnggota">
              <VRow align="center" class="pt-1 pa-2">
                <VCol cols="12">
                  <VAutocomplete v-model="params.warga" label="Pilih Warga"
                    placeholder="Pilih warga yang ingin dijadikan anggota" multiple item-title="nama_warga"
                    item-value="nik" :items="props.itemDropdownAddAnggota" :loading="props.loadingDropdownAddAnggota"
                    :rules="[
                      (v: string[]) => (!!v && v.length > 0) || 'Pilih warga terlebih dahulu'
                    ]"></VAutocomplete>
                </VCol>
                <VCol cols="12">
                  <div class="d-flex justify-end flex-wrap gap-2">
                    <VBtn :disabled="props.loading" variant="text" color="secondary" size="small"
                      @click="handleCloseAddAnggota">
                      <VIcon icon="ri-close-line" class="me-1" />
                      Batal
                    </VBtn>
                    <VBtn :loading="props.loading" variant="flat" color="success" size="small" type="submit">
                      <VIcon icon="ri-add-line" class="me-1" />
                      Tambah
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VForm>
          </VTabsWindowItem>
          <VTabsWindowItem value="detail-warga">
            <div class="py-2">
              <div class="d-flex justify-center">
                <div class="text-center">
                  <VIcon icon="ri-account-circle-fill" size="45" />
                  <h4>{{ itemSelected?.warga.nama_warga }}</h4>
                  <VChip size="small" :color="itemSelected?.is_leader ? 'info' : ''"
                    :prepend-icon="itemSelected?.is_leader ? 'ri-vip-crown-line' : ''">
                    {{ itemSelected?.is_leader ? 'Ketua Regu' : 'Anggota' }}
                  </VChip>
                </div>
              </div>
              <div v-if="masterWargaStore.loading" class="text-center py-4 mt-3">
                <VProgressCircular indeterminate size="26" />
              </div>
              <div v-else class="mt-2">
                <table>
                  <tbody>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">NIK :</p>
                        <p class="ma-0">{{ itemSelected?.nik }}</p>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">Alamat :</p>
                        <p class="ma-0">{{ masterWargaStore.detailWarga?.alamat }}</p>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">No. HP :</p>
                        <p class="ma-0">{{ masterWargaStore.detailWarga?.no_hp }}</p>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">Status Warga :</p>
                        <VChip size="small"
                          :color="masterWargaStore.detailWarga?.status_keaktifan === 'aktif' ? 'success' : 'error'">
                          {{ masterWargaStore.detailWarga?.status_keaktifan === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
                        </VChip>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </VTabsWindowItem>
        </VTabsWindow>
      </VCardItem>
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

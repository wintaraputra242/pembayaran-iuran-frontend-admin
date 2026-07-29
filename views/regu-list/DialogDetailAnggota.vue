<script setup lang="ts">
import type { WargaForDropdown } from '@/types/api/dropdown';
import type { AnggotaRegu } from '@/types/api/master-regu';

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
  item?: AnggotaRegu | null
  loading?: boolean
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
  emit('close')
}

const itemSelected = ref<AnggotaRegu | null>(null)

const handleCloseAddAnggota = () => {
}

watch(() => props.isFetchSuccess, (newVal) => {
  if (newVal) {
    handleCloseAddAnggota()
  }
}, { immediate: true })

const authStore = useAuthStore()
const isKetuaRegu = computed(() => authStore.user?.role === 'ketua_regu')
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard class="pa-0">
      <VCardTitle class="pt-3">
        <div class="d-flex align-center justify-space-between">
          <h4>Detail Anggota</h4>
          <IconBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardItem class="pa-2">
        <div class="py-2">
          <div class="d-flex justify-center">
            <div class="text-center">
              <VIcon icon="ri-account-circle-fill" size="45" />
              <h4>{{ item?.warga.nama_warga }}</h4>
              <VChip size="small" :color="item?.is_leader ? 'info' : ''"
                :prepend-icon="item?.is_leader ? 'ri-vip-crown-line' : ''">
                {{ item?.is_leader ? 'Ketua Regu' : 'Anggota' }}
              </VChip>
            </div>
          </div>
          <div v-if="masterWargaStore.loading" class="text-center py-4 mt-3">
            <VProgressCircular indeterminate size="26" />
          </div>
          <div v-else class="mt-2">
            <table>
              <tbody>
                <tr v-if="!isKetuaRegu">
                  <td class="font-weight">
                    <p class="ma-0 font-weight-bold">NIK :</p>
                    <p class="ma-0">{{ item?.nik }}</p>
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
                    <!-- <p class="ma-0">{{ masterWargaStore.detailWarga?.no_hp }}</p> -->
                    <a v-if="masterWargaStore.detailWarga?.no_hp"
                      :href="`https://wa.me/${masterWargaStore.detailWarga?.no_hp.replace(/\D/g, '').replace(/^0/, '62')}`"
                      target="_blank" rel="noopener noreferrer"
                      class="text-decoration-none d-inline-flex align-center gap-1 px-2 py-1 rounded-lg"
                      style="background: rgba(37, 211, 102, 0.1); border: 1px solid rgba(37, 211, 102, 0.3);">
                      <VIcon icon="ri-whatsapp-line" size="13" color="success" />
                      <p class="ma-0 text-caption font-weight-medium" style="color: #25d366;">{{
                        masterWargaStore.detailWarga?.no_hp }}</p>
                      <VIcon icon="ri-external-link-line" size="11" style="color: #25d366; opacity: 0.7;" />
                    </a>
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
      </VCardItem>
    </VCard>
  </VDialog>
</template>

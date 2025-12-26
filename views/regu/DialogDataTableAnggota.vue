<script setup lang="ts">

const emit = defineEmits<{
  (e: 'setLeader', item: object): void;
  (e: 'changeLeader', item: object): void;
  (e: 'delete', item: object): void;
  (e: 'close'): void;
  (e: 'resetAnggota', items: object[]): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  data: object[] | null
  item: object | null
  isLoading: boolean
}>(), {
  isShow: false,
  data: () => ([]),
  item: () => ({}),
  isLoading: false,
})

const handleClose = () => {
  tab.value = 'table'

  emit('close')
}

const dataDummy = [
  {
    id: 1,
    nama: "I Wayan Sudarma",
    no_hp: "081234567890",
    status: "Anggota",
  },
  {
    id: 2,
    nama: "I Made Adi Putra",
    no_hp: "081239998877",
    status: "Anggota",
  },
  {
    id: 3,
    nama: "Ni Luh Ayu Sulastri",
    no_hp: "082155443322",
    status: "Anggota",
  },
  {
    id: 4,
    nama: "I Ketut Dwi Arta",
    no_hp: "087812345678",
    status: "Anggota",
  },
  {
    id: 5,
    nama: "Ni Kadek Mirah Santi",
    no_hp: "081333221144",
    status: "Anggota",
  },
  {
    id: 6,
    nama: "I Putu Gede Pratama",
    no_hp: "081778899110",
    status: "Anggota",
  },
  {
    id: 7,
    nama: "Ni Komang Sari Dewi",
    no_hp: "082144332211",
    status: "Anggota",
  },
  {
    id: 8,
    nama: "I Nyoman Surya",
    no_hp: "087766554433",
    status: "Anggota",
  },
  {
    id: 9,
    nama: "Ni Ketut Ayu Pertiwi",
    no_hp: "081200334455",
    status: "Anggota",
  },
  // {
  //   id: 10,
  //   nama: "I Made Yoga Saputra",
  //   no_hp: "081777666555",
  //   status: "Anggota",
  // },
]

const checkLeaderIsAvailable = dataDummy.filter((item, i) => item.status === 'Ketua Regu').length > 0

const tab = ref('table')

const defaultParamsAddAnggota = {
  warga: null,
}
const params = reactive({...defaultParamsAddAnggota})

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  warga: (v: string) => {
    if (!v) return "Pilih Warga wajib diisi"
    return true
  },
}

const dropdownItemsWarga = dataDummy.map((item, i) => item.nama)

const itemSelected = ref<object | null>(null)

const handleDetailAnggota = (item: object) => {
  tab.value = 'detail-warga'

  itemSelected.value = item
}

const btnTabStyle: any = {
  table: {
    color: 'success',
    action: () => { tab.value = 'form' },
    icon: 'ri-add-line',
    content: 'Tambah Anggota',
  },
  form: {
    color: 'secondary',
    action: () => { tab.value = 'table' },
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
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard class="pa-0">
      <VCardTitle class="pt-3">
        <div class="d-flex align-center justify-space-between">
          <h3>Anggota {{ item?.nama_regu || 'Regu A' }}</h3>
          <IconBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardText class="pb-0 py-1">
        <div class="d-flex justify-end flex-wrap gap-2">
          <VBtn variant="flat" :color="btnTabStyle[tab].color" @click="btnTabStyle[tab].action">
            <VIcon :icon="btnTabStyle[tab].icon" />
            {{ btnTabStyle[tab].content }}
          </VBtn>
          <VBtn v-if="tab === 'table'" variant="flat" color="error" @click="emit('resetAnggota', dataDummy)">
            <VIcon icon="ri-user-community-line" class="me-1" />
            Reset Anggota
          </VBtn>
        </div>
      </VCardText>
      <VCardItem class="pa-2">
        <VTabsWindow v-model="tab">
          <VTabsWindowItem value="table">
            <div
              class="table-scroll-wrapper"
            >
              <VTable fixed-header height="400px" class="my-table">
                <thead>
                  <tr>
                    <th style="width: 70px">No.</th>
                    <th style="width: 250px">Nama Anggota</th>
                    <th style="width: 180px">No. HP</th>
                    <th class="text-center" style="width: 180px">Status</th>
                    <th style="width: 150px"></th>
                  </tr>
                </thead>
        
                <tbody>
                  <tr v-for="(item, i) in dataDummy" :key="item.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item?.nama }}</td>
                    <td>{{ item?.no_hp }}</td>
                    <td align="center">
                      <v-chip :color="item.status === 'Ketua Regu' ? 'info' : ''" :prepend-icon="item.status === 'Ketua Regu' ? 'ri-vip-crown-line' : ''">
                        {{ item?.status }}
                      </v-chip>
                    </td>
                    <td>
                      <div class="d-flex gap-2">
                        <div style="width: 34px;">
                          <IconBtn v-if="item.status !== 'Ketua Regu' && checkLeaderIsAvailable" variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('changeLeader', item)">
                            <VIcon icon="ri-loop-left-line" />
                          </IconBtn>
                        </div>
                        <IconBtn v-if="!checkLeaderIsAvailable" variant="outlined" class="rounded-lg" size="small" color="secondary" @click="emit('setLeader', item)">
                          <VIcon icon="ri-vip-crown-line" />
                        </IconBtn>
                        <IconBtn variant="outlined" class="rounded-lg" size="small" color="secondary" @click="handleDetailAnggota(item)">
                          <VIcon icon="ri-info-card-line" />
                        </IconBtn>
                        <IconBtn variant="outlined" class="rounded-lg" size="small" color="error" @click="emit('delete', item)">
                          <VIcon icon="ri-delete-bin-line" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
        
                  <!-- Loading -->
                  <tr v-if="isLoading">
                    <td colspan="4" rowspan="2" class="text-center py-3">
                      <VProgressCircular indeterminate size="26" />
                    </td>
                  </tr>

                  <!-- Loading -->
                  <tr v-if="props.data?.length === 0">
                    <td colspan="4" rowspan="2" class="text-center py-3">
                      Tidak ada data
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </VTabsWindowItem>
          <VTabsWindowItem value="form">
            <VForm ref="form" @submit.prevent="() => {}">
              <VRow align="center" class="pt-1 pa-2">
                <VCol cols="12">
                  <VAutocomplete
                    v-model="params.warga"
                    label="Pilih Warga"
                    placeholder="Pilih warga yang ingin dijadikan anggota"
                    multiple
                    :items="dropdownItemsWarga"
                  ></VAutocomplete>
                </VCol>
                <VCol cols="12">
                  <div class="d-flex justify-end flex-wrap gap-2">
                    <VBtn variant="text" color="secondary" size="small" @click="tab = 'table'">
                      <VIcon icon="ri-close-line" class="me-1" />
                      Batal
                    </VBtn>
                    <VBtn variant="flat" color="success" size="small" type="submit">
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
                  <h4>Gusti Putu Wintara Putra</h4>
                  <VChip color="info" prepend-icon="ri-vip-crown-line" size="small">Ketua Regu</VChip>
                </div>
              </div>
              <div class="mt-2">
                <table>
                  <tbody>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">NIK :</p>
                        <p class="ma-0">3201000000000003</p>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">Alamat :</p>
                        <p class="ma-0">Jl. Raya Mambal</p>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">No. HP :</p>
                        <p class="ma-0">081123123123</p>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight">
                        <p class="ma-0 font-weight-bold">Status Warga :</p>
                        <p class="ma-0 text-success">Aktif</p>
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
/* .table-scroll-wrapper {
  max-height: 400px;   
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
} */
</style>

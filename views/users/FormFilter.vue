<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'showFormData'): void;
}>();

const filter = reactive({
  name: '',
  username: '',
  role: null,
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VForm @submit.prevent="() => {}">
        <VRow align="center">
          <VCol cols="12">
            <VTextField
              v-model="filter.name"
              placeholder="Masukkan nama pengguna"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="filter.username"
              placeholder="Masukkan username pengguna"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="filter.role"
              placeholder="Masukkan pencaharian"
              :items="['Admin', 'Ketua Regu']"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-2">
              <VBtn variant="flat" color="primary">
                <VIcon icon="ri-search-line" class="me-2" />
                Filter
              </VBtn>
              <IconBtn variant="flat" color="primary" @click="emit('reload')">
                <VIcon icon="ri-restart-line" />
              </IconBtn>
              <VBtn variant="flat" color="success" @click="emit('showFormData')">
                <VIcon icon="ri-add-large-line" class="me-2" />
                Tambah Data
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
  </VCard>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'close'): void;
}>();

const props = withDefaults(defineProps<{
  isShow: boolean
  isEdit: boolean
  item?: object | null
}>(), {
  isShow: false,
  isEdit: false,
})

const form = ref(null)

const defaultParams = {
  name: '',
  username: '',
  role: null,
  password: '',
  c_password: '',
}
const params = reactive({...defaultParams})

const rules = {
  required: (v: any) => !!v || "Field wajib diisi",

  name: (v: string) => {
    if (!v) return "Nama wajib diisi"
    if (v.length < 3) return "Nama minimal 3 karakter"
    return true
  },

  username: (v: string) => {
    if (!v) return "Username wajib diisi"
    if (v.length < 3) return "Username minimal 3 karakter"
    if (!/^[a-zA-Z0-9._]+$/.test(v)) return "Username hanya boleh huruf, angka, titik, dan underscore"
    return true
  },

  role: (v: string) => {
    if (!v) return "Role wajib dipilih"
    return true
  },

  password: (v: string) => {
    if (!v) return "Password wajib diisi"
    return true
  },

  c_password: (v: string, password: string) => {
    if (!v) return "Konfirmasi password wajib diisi"
    if (v !== password) return "Konfirmasi password tidak cocok"
    return true
  }
}

watch(
  () => params.nama_regu,
  newVal => {
    if (!newVal) return
    params.nama_regu = newVal.toUpperCase()
  }
)

const handleClose = () => {
  form.value?.reset()
  
  emit('close')
}

watch(
  () => props.isEdit,
  newVal => {
    if (!newVal) return

    params.name = props.item?.nama
    params.username = props.item?.nama
    params.role = props.item?.nama
  }
)

const isPasswordFocused = ref(false)
const passwordStrength = ref(0)
const passwordStatus = ref("")
const passwordColor = ref("red")
const progressColor = ref("error")

function checkPasswordStrength(pw: string) {
  let score = 0

  if (pw.length >= 8) score += 25
  if (/[a-z]/.test(pw)) score += 25
  if (/[A-Z]/.test(pw)) score += 25
  if (/[0-9]/.test(pw)) score += 25

  passwordStrength.value = score

  // Tentukan status + warna
  if (score <= 25) {
    passwordStatus.value = "Lemah"
    passwordColor.value = "red"
    progressColor.value = "error"
  } else if (score <= 50) {
    passwordStatus.value = "Kurang Kuat"
    passwordColor.value = "orange"
    progressColor.value = "warning"
  } else if (score <= 75) {
    passwordStatus.value = "Kuat"
    passwordColor.value = "#2563EB"
    progressColor.value = "info"
  } else {
    passwordStatus.value = "Sangat Kuat"
    passwordColor.value = "green"
    progressColor.value = "success"
  }
}

const handleJumpFromUsers = () => {
  localStorage.setItem('from', 'create-user')
}
</script>

<template>
  <VDialog v-model="props.isShow">
    <VCard class="position-relative">
      <VCardTitle class="pt-3 position-sticky top-0" style="background-color: #fff !important; z-index: 10;">
        <div class="d-flex align-center justify-space-between">
          <h3>{{ props.isEdit ? 'Edit' : 'Tambah' }}</h3>
          <IconBtn variant="text" color="secondary" size="small" @click="handleClose">
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </div>
      </VCardTitle>
      <VCardText v-if="!props.isEdit" class="pb-0 pt-2">
        <NuxtLink class="text-info" to="/master-data/regu" @click="handleJumpFromUsers">
          Ingin menambahkan pengguna dengan role <b>Ketua Regu</b>? 
        </NuxtLink>
      </VCardText>
      <VCardItem>
        <VForm ref="form" @submit.prevent="() => {}">
          <VRow align="center" class="pt-1">
            <VCol cols="12">
              <VTextField
                v-model="params.name"
                label="Nama"
                placeholder="Masukkan nama pengguna"
                :rules="[rules.name]"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="params.username"
                label="Username"
                placeholder="Masukkan username pengguna"
                :rules="[rules.username]"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="params.role"
                label="Role"
                placeholder="Masukkan role pengguna"
                :items="['Admin']"
                :rules="[rules.role]"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="params.password"
                label="Password"
                placeholder="Masukkan password pengguna"
                :rules="[rules.password]"
                @focus="isPasswordFocused = true"
                @blur="isPasswordFocused = false"
                @update:model-value="checkPasswordStrength(params.password)"
              />

              <div v-if="isPasswordFocused || params.password" class="mt-3">

                <VProgressLinear
                  :model-value="passwordStrength"
                  :color="progressColor"
                  height="10"
                  striped
                  class="rounded-pill"
                />

                <span :style="{ color: passwordColor }" class="font-weight-medium">
                  {{ passwordStatus }}
                </span>

                <div class="mt-3">
                  <span class="text-body-2">Password yang kuat disarankan menggunakan minimal 8 karakter dengan variasi huruf besar, huruf kecil, dan angka.</span>
                </div>
              </div>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="params.c_password"
                label="Konfirmasi Password"
                placeholder="Masukkan konfirmasi password"
                :rules="[rules.c_password(params.c_password, params.password)]"
              />
            </VCol>
            <VCol cols="12">
              <div class="d-flex justify-end flex-wrap gap-2">
                <VBtn variant="text" color="secondary" size="small" @click="handleClose">
                  <VIcon icon="ri-close-line" class="me-1" />
                  Batal
                </VBtn>
                <VBtn variant="flat" :color="props.isEdit ? 'info' : 'success'" size="small" type="submit">
                  <VIcon :icon="props.isEdit ? 'ri-save-2-line' : 'ri-add-line'" class="me-1" />
                  {{ props.isEdit ? 'Simpan' : 'Tambah'}}
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

<style>
.dropzone {
  width: 100%;
  padding: 30px;
  border: 2px dashed #888;
  border-radius: 10px;
  text-align: center;
}
</style>

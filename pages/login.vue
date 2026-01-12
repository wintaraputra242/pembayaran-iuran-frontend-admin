<script setup lang="ts">
import { useAuth } from '@/composables/api/useAuth'

definePageMeta({ layout: 'blank', middleware: 'guest', public: true })

const router = useRouter()
const route = useRoute()

const { login } = useAuth()
const uiStore = useUiStore()

const form = ref({
  username: '',
  password: '',
})


const isPasswordVisible = ref(false)

const formComp = ref()

const isLoadingSubmit = ref(false)
const onSubmit = async () => {
  const { valid } = await formComp.value.validate() 

  if (!valid) return

  isLoadingSubmit.value = true
  
  try {
    const res = await login({
      username: form.value.username,
      password: form.value.password,
    })

    uiStore.startLoading()
    const fromPath = useCookie('from-path')
    fromPath.value = route.path

    router.push(
      res.data.role === 'admin'
        ? '/'
        : '/create-pembayaran'
    )
    
  } catch (e: any) {
    uiStore.showError(e.errors ?? 'Terjadi kesalahan saat login', 'Gagal Login')
  } finally {
    isLoadingSubmit.value = false
  }
}

onMounted(() => {
  const fromPath = useCookie('from-path')

  if (uiStore.isLoading && (fromPath.value === '/' || fromPath.value === '/dashboard' || fromPath.value === '/create-pembayaran')) {
    uiStore.endLoading()
    fromPath.value = null
  }
})
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div style="max-width: 448px; width: 100%">
      <div class="d-flex align-center flex-column gap-3 mb-4">
        <!-- <div
          class="d-flex"
          v-html="logo"
        /> -->
        <VImg src="/logo.png" width="3rem" />
        <h2 class="text-center font-weight-medium text-xl text-uppercase ">
          Pembayaran Iuran Banjar Trijata
        </h2>
      </div>
      <VCard
        class="auth-card pa-4 pt-7"
        max-width="448"
        width="100%"
      >
        <VCardItem class="justify-center">
          <h2 class="font-weight-medium text-2xl text-capitalize text-center">
            Admin
          </h2>
        </VCardItem>
  
        <VCardText>
          <VForm ref="formComp" @submit.prevent="onSubmit">
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <VTextField
                  v-model="form.username"
                  label="Username"
                  type="username"
                  :rules="[
                    (v: string) => !!v || 'Username harus diisi'
                  ]"
                />
              </VCol>
  
              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :rules="[
                    (v: string) => !!v || 'Password harus diisi'
                  ]"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
  
                <!-- remember me checkbox -->
                <!-- <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox
                    v-model="form.remember"
                    label="Remember me"
                  />
  
                  <a
                    class="text-primary"
                    href="javascript:void(0)"
                  >
                    Forgot Password?
                  </a>
                </div> -->
  
                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                  class="mt-6"
                  :loading="isLoadingSubmit"
                >
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>

<script setup lang="ts">
import { useAuth } from '@/composables/api/useAuth'

definePageMeta({ layout: 'blank', guest: true })

const router = useRouter()
const route = useRoute()

const { login } = useAuth()
const uiStore = useUiStore()
const { requestPermissionAndGetToken } = useFirebaseMessaging()

const form = ref({
  username: '',
  password: '',
})


const isPasswordVisible = ref(false)

const formComp = ref()

const isLoadingSubmit = ref(false)
const errorMessage = ref<string | null>(null)
const onSubmit = async () => {
  const { valid } = await formComp.value.validate()
  if (!valid) return

  errorMessage.value = null
  isLoadingSubmit.value = true

  try {
    const fcmToken = await requestPermissionAndGetToken().catch(() => null)

    const res = await login({
      username: form.value.username,
      password: form.value.password,
      fcm_token: fcmToken ?? undefined,
      platform: 'web',
    })

    const redirect = import.meta.client
      ? localStorage.getItem('redirect_after_login')
      : null

    localStorage.removeItem('redirect_after_login')

    const defaultRoute = res.data.user.role === 'admin' ? '/' : '/create-pembayaran'

    router.push(redirect ?? defaultRoute)

  } catch (e: any) {
    errorMessage.value = e.errors ?? 'Terjadi kesalahan saat login'
  } finally {
    isLoadingSubmit.value = false
  }
}

const adminPhone = useRuntimeConfig().public.adminPhone

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
      <VCard class="auth-card pa-4 pt-7" max-width="448" width="100%">
        <VCardItem class="justify-center">
          <h2 class="font-weight-medium text-2xl text-capitalize text-center">
            Admin
          </h2>
        </VCardItem>

        <VCardText>
          <VAlert v-if="errorMessage" type="error" class="mb-4" density="compact">
            {{ errorMessage }}
          </VAlert>

          <VForm ref="formComp" @submit.prevent="onSubmit">
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <VTextField v-model="form.username" label="Username" type="username" :rules="[
                  (v: string) => !!v || 'Username harus diisi'
                ]" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField v-model="form.password" label="Password" placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'" autocomplete="password" :rules="[
                    (v: string) => !!v || 'Password harus diisi'
                  ]" :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="text-end mt-1">
                  <a :href="`https://wa.me/${adminPhone}?text=${encodeURIComponent('Halo, saya lupa password akun iuran warga. Mohon bantu reset password saya.')}`"
                    target="_blank" class="text-caption text-primary" style="text-decoration: none;">
                    Lupa kata sandi?
                  </a>
                </div>

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
                <VBtn block type="submit" class="mt-6" :loading="isLoadingSubmit">
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

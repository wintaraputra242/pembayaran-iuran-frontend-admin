<script setup lang="ts">
import { useAuth } from '@/composables/api/useAuth'
import { useDisplay } from 'vuetify'

definePageMeta({ layout: 'blank', guest: true })

const router = useRouter()
const route = useRoute()

const { login } = useAuth()
const uiStore = useUiStore()
const { requestPermissionAndGetToken } = useFirebaseMessaging()

const { mdAndDown } = useDisplay()

const form = ref({
  username: '',
  password: '',
})


const isPasswordVisible = ref(false)

// Dua instance form (desktop & mobile) dipakai bergantian lewat v-if/v-else di template —
// supaya cuma SATU yang benar-benar ter-mount di DOM sesuai ukuran layar saat ini. Kalau
// keduanya dipasang sekaligus (mis. pakai d-none), ref="formComp" akan bentrok karena cuma
// bisa menunjuk ke satu elemen, jadi validasi bisa salah sasaran.
const formCompDesktop = ref()
const formCompMobile = ref()

const isLoadingSubmit = ref(false)
const errorMessage = ref<string | null>(null)
const onSubmit = async () => {
  const activeForm = mdAndDown.value ? formCompMobile.value : formCompDesktop.value

  const { valid } = await activeForm.validate()
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

  <div class="auth-wrapper-v2">
    <!-- ================= DESKTOP: dua kolom (kiri gambar, kanan form) ================= -->
    <div v-if="!mdAndDown" class="auth-split">
      <div class="auth-split-image">
        <div class="auth-split-image-overlay" />
        <div class="auth-split-image-brand">
          <VImg src="/logo.png" width="3.5rem" class="mb-3" />
          <h2 class="text-white font-weight-bold text-uppercase auth-title-on-photo">
            Pembayaran Iuran <br> Banjar Trijata
          </h2>
        </div>
      </div>

      <div class="auth-split-form d-flex align-center justify-center pa-8">
        <div style="max-width: 400px; width: 100%;">
          <div class="mb-6">
            <h2 class="text-h5 font-weight-bold mb-1">
              Selamat Datang
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Masuk ke akun admin untuk mengelola iuran banjar.
            </p>
          </div>

          <VAlert v-if="errorMessage" type="error" class="mb-4" density="compact">
            {{ errorMessage }}
          </VAlert>

          <VForm ref="formCompDesktop" @submit.prevent="onSubmit">
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

                <!-- login button -->
                <VBtn block type="submit" class="mt-6" :loading="isLoadingSubmit">
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </div>
      </div>
    </div>

    <!-- ================= MOBILE: banner foto + kartu form ================= -->
    <div v-else class="auth-mobile pa-4">
      <div class="auth-mobile-banner mb-4">
        <div class="auth-mobile-banner-overlay" />
        <div class="auth-mobile-banner-content">
          <VAvatar size="64" color="primary" class="auth-mobile-badge mb-3">
            <VImg src="/logo.png" />
          </VAvatar>
          <h2 class="text-center font-weight-bold text-white text-uppercase auth-title-on-photo auth-mobile-title">
            Pembayaran Iuran Banjar Trijata
          </h2>
        </div>
      </div>

      <VCard class="auth-mobile-card pa-4 pt-6" rounded="lg">
        <VCardItem class="justify-center">
          <h2 class="font-weight-medium text-2xl text-capitalize text-center">
            Admin
          </h2>
        </VCardItem>

        <VCardText>
          <VAlert v-if="errorMessage" type="error" class="mb-4" density="compact">
            {{ errorMessage }}
          </VAlert>

          <VForm ref="formCompMobile" @submit.prevent="onSubmit">
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

<style scoped>
.auth-wrapper-v2 {
  min-height: 100dvh;
  background: #f4f5fa;
}

.auth-title-on-photo {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
}

/* ================= DESKTOP: split kiri-kanan ================= */
.auth-split {
  display: flex;
  min-height: 100dvh;
}

.auth-split-image {
  position: relative;
  flex: 1 1 50%;
  min-width: 0;
  background-image: url('/banjar.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.auth-split-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(20, 12, 6, 0.15) 0%, rgba(20, 12, 6, 0.75) 100%);
}

.auth-split-image-brand {
  position: relative;
  z-index: 1;
  padding: 48px;
}

.auth-split-form {
  flex: 1 1 50%;
  min-width: 0;
  background: #ffffff;
}

/* ================= MOBILE: banner + kartu ================= */
.auth-mobile-banner {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 180px;
  background-image: url('/banjar.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-mobile-banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(20, 12, 6, 0.35) 0%, rgba(20, 12, 6, 0.72) 100%);
}

.auth-mobile-banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.auth-mobile-badge {
  border: 3px solid rgba(255, 255, 255, 0.55);
}

.auth-mobile-title {
  font-size: 1.05rem;
  line-height: 1.4;
}

.auth-mobile-card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
}
</style>

<script setup lang="ts">
import { useTheme } from 'vuetify'

import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const isPasswordVisible = ref(false)

definePageMeta({ layout: 'blank', middleware: 'after-auth' })
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
        <h2 class="font-weight-medium text-xl text-uppercase ">
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
          <VForm @submit.prevent="() => {}">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  :id="useId()"
                  v-model="form.email"
                  label="Email"
                  type="email"
                />
              </VCol>
  
              <!-- password -->
              <VCol cols="12">
                <VTextField
                  :id="useId()"
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
  
                <!-- remember me checkbox -->
                <!-- <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox
                    :id="useId()"
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
                  to="/"
                  class="mt-6"
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

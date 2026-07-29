<script setup lang="ts">
import misc404 from '@images/pages/404.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'
import tree from '@images/pages/tree.png'
import type { NuxtError } from 'nuxt/app'
import { useTheme } from 'vuetify'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  error: NuxtError
}>()

const vuetifyTheme = useTheme()
const authStore = useAuthStore()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? miscMaskLight
    : miscMaskDark
})

const isDev = process.dev

const errToShow = computed(() => {
  const is404 = props.error?.statusCode === 404 || props.error?.message?.includes('404')

  if (is404) {
    return {
      title: 'Halaman tidak ditemukan',
      description: 'Kami tidak dapat menemukan halaman yang Anda cari.',
    }
  }

  if (isDev) {
    return {
      title: props.error?.statusMessage,
      description: props.error?.message,
    }
  }

  return {
    title: 'Terjadi Kesalahan',
    description: 'Sistem sedang mengalami kendala. Silakan coba kembali beberapa saat lagi.',
  }
})

const roles: Record<'admin' | 'ketua_regu', string> = {
  'admin': '/',
  'ketua_regu': '/create-pembayaran',
}

const handleError = () => clearError({ redirect: authStore.isLoggedIn ? roles[authStore.role] : '/login' })
</script>

<template>
  <NuxtLayout name="blank">
    <div class="misc-wrapper">
      <ErrorHeader
        :status-code="props.error?.statusCode"
        :title="errToShow?.title"
        :description="errToShow?.description"
      />

      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="isDev"
        style="max-inline-size: 80dvw; overflow-x: scroll;"
        v-html="error?.stack"
      />
      <!-- eslint-enable -->

      <!-- 👉 Image -->
      <div class="misc-avatar w-100 text-center">
        <VImg
          :src="misc404"
          alt="Coming Soon"
          :max-width="800"
          class="mx-auto"
        />
        <VBtn
          class="mt-10"
          @click="handleError"
        >
          Back to Home
        </VBtn>
      </div>

      <!-- 👉 Footer -->
      <VImg
        :src="tree"
        class="misc-footer-tree d-none d-md-block"
      />

      <VImg
        :src="authThemeMask"
        class="misc-footer-img d-none d-md-block"
      />
    </div>
  </NuxtLayout>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";

.misc-footer-tree {
  inline-size: 15.625rem;
  inset-block-end: 3.5rem;
  inset-inline-start: 0.375rem;
}
</style>

<script lang="ts" setup>
import NavItems from '@/layouts/components/NavItems.vue';
import logo from '@images/logo.svg?raw';
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue';

// Components
import UserProfile from '@/layouts/components/UserProfile.vue';

import { useScrollStatus } from '@/composables/useScrollNavbar';

const authStore = useAuthStore()

const { isMobile } = useDevice()
const { isScrolled } = useScrollStatus(20)
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="transition" :class="{ 'position-fixed w-100 top-0 left-0 py-3 px-5': isMobile, 'h-100': !isMobile, 'bg-surface elevation-1': isScrolled && isMobile }">
        <div class="d-flex h-100 align-center">
          <!-- 👉 Vertical nav toggle in overlay mode -->
          <IconBtn
            v-if="authStore.user?.role === 'admin'"
            class="d-lg-none"
            :class="{ 'ms-n3': !isMobile }"
            @click="toggleVerticalOverlayNavActive(true)"
          >
            <VIcon icon="ri-menu-line" />
          </IconBtn>
  
          <VSpacer />
  
          <IconBtn class="me-2" to="/notifications">
            <VIcon icon="ri-notification-line" />
          </IconBtn>
  
          <!-- <NavbarThemeSwitcher class="me-2" /> -->
  
          <UserProfile />
        </div>
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <NuxtLink
        to="/"
        class="app-logo app-title-wrapper"
      >
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="d-flex"
          v-html="logo"
        />
        <!-- eslint-enable -->

        <h1 class="font-weight-medium leading-normal text-body-2 text-uppercase">
          Pembayaran Iuran <br> Admin
        </h1>
      </NuxtLink>

      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="ri-close-line" />
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <!-- <Footer /> -->
    </template>

    
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}

.transition {
  transition: all 0.2s ease-in !important;
}
</style>

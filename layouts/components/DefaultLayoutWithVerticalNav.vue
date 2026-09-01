<script lang="ts" setup>
import NavItems from '@/layouts/components/NavItems.vue';
import logo from '@images/logo.svg?raw';
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue';

// Components
import UserProfile from '@/layouts/components/UserProfile.vue';

import { useScrollStatus } from '@/composables/useScrollNavbar';

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const { isMobile } = useDevice()
const { isScrolled } = useScrollStatus(20)
</script>

<template>
  <VerticalNavLayout>
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="transition" :class="{
        'w-100 top-0 left-0 py-3 px-5': isMobile,
        'h-100 px-5': !isMobile,
        'bg-surface elevation-3': isScrolled && isMobile  // ← elevation lebih tinggi saat scroll
      }" :style="isMobile ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgb(var(--v-theme-surface))' : 'rgb(var(--v-theme-surface))',
        transition: 'box-shadow 0.2s ease',
        boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
      } : {}">
        <div class="d-flex h-100 align-center">
          <IconBtn v-if="authStore.user?.role === 'admin'"
            @click="toggleVerticalOverlayNavActive(true)">
            <VIcon icon="ri-menu-line" />
          </IconBtn>

          <VSpacer />

          <VBadge :content="notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount"
            :model-value="notificationStore.unreadCount > 0" color="error" location="top end" offset-x="10"
            offset-y="5">
            <IconBtn class="me-2" to="/notifications">
              <VIcon icon="ri-notification-line" />
            </IconBtn>
          </VBadge>

          <UserProfile />
        </div>
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <NuxtLink to="/" class="app-logo app-title-wrapper">
        <div class="d-flex" v-html="logo" />

        <h1 class="font-weight-medium leading-normal text-body-2 text-uppercase">
          Pembayaran Iuran <br> Admin
        </h1>
      </NuxtLink>

      <IconBtn @click="toggleIsOverlayNavActive(false)">
        <VIcon icon="ri-close-line" />
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems />
    </template>

    <slot />

    <template #footer>
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

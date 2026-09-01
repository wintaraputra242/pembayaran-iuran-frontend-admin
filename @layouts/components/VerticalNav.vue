<script lang="ts" setup>
import logo from '@images/logo.svg?raw'
import type { Component } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'

interface Props {
  tag?: string | Component
  isOverlayNavActive: boolean
  toggleIsOverlayNavActive: (value: boolean) => void
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'aside',
})

const { mdAndDown } = useDisplay()

const refNav = ref()

const route = useRoute()

// Auto-close sidebar saat pindah halaman HANYA di mode overlay (mobile/tablet, <1280px).
// Di desktop sidebar tampil menetap, jadi tidak perlu (dan tidak masuk akal) ikut tertutup
// setiap kali navigasi.
watch(
  () => route.path,
  () => {
    if (mdAndDown.value)
      props.toggleIsOverlayNavActive(false)
  })

const isVerticalNavScrolled = ref(false)
const updateIsVerticalNavScrolled = (val: boolean) => isVerticalNavScrolled.value = val

const handleNavScroll = (evt: Event) => {
  isVerticalNavScrolled.value = (evt.target as HTMLElement).scrollTop > 0
}

const navLeft = ref('0px')

// const updateNavPosition = () => {
//   const wrapper = document.querySelector('.layout-wrapper')
//   if (wrapper) {
//     const rect = wrapper.getBoundingClientRect()
//     navLeft.value = `${rect.left}px`
//   }
// }

// onMounted(() => {
//   updateNavPosition()
//   window.addEventListener('resize', updateNavPosition)
// })

// onUnmounted(() => {
//   window.removeEventListener('resize', updateNavPosition)
// })

const updateNavLeft = () => {
  const wrapper = document.querySelector('.layout-wrapper')
  if (wrapper) {
    const rect = wrapper.getBoundingClientRect()
    document.documentElement.style.setProperty('--nav-left', `${rect.left}px`)
  }
}

onMounted(() => {
  updateNavLeft()
  window.addEventListener('resize', updateNavLeft)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateNavLeft)
})

</script>

<template>
  <Component :is="props.tag" ref="refNav" data-allow-mismatch class="layout-vertical-nav"
    :style="{ insetInlineStart: navLeft }" :class="[{
      'visible': isOverlayNavActive,
      'scrolled': isVerticalNavScrolled,
      'overlay-nav': mdAndDown,
    }]">

    <div class="nav-header">
      <slot name="nav-header">
        <NuxtLink to="/" class="app-logo app-title-wrapper">
          <div class="d-flex" v-html="logo" />

          <h1 class="font-weight-medium leading-normal text-xl text-uppercase">
            Materio
          </h1>
        </NuxtLink>
      </slot>
    </div>
    <slot name="before-nav-items">
      <div class="vertical-nav-items-shadow" />
    </slot>
    <slot name="nav-items" :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled">
      <PerfectScrollbar tag="ul" class="nav-items" :options="{ wheelPropagation: false }"
        @ps-scroll-y="handleNavScroll">
        <slot />
      </PerfectScrollbar>
    </slot>
    <slot name="after-nav-items" />
  </Component>
</template>

<style lang="scss" scoped>
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
</style>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

.layout-vertical-nav {
  // position: fixed;
  // z-index: variables.$layout-vertical-nav-z-index;
  // display: flex;
  // flex-direction: column;
  // block-size: 100%;
  // inline-size: variables.$layout-vertical-nav-width;
  // inset-block-start: 0;
  // inset-inline-start: 0;
  // transition: inline-size 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  // will-change: transform, inline-size;

  position: fixed !important;
  inset-inline-start: var(--nav-left, 0px) !important;
  inset-block-start: 0 !important;
  block-size: 100dvh !important; // pastikan full height

  // Mobile/tablet (<1280px): harus di atas navbar mobile yang fixed (z-index 1000 di
  // DefaultLayoutWithVerticalNav.vue) supaya drawer tetap tampil penuh/ter-highlight saat dibuka.
  z-index: 1005;

  // Desktop (>=1280px): sidebar tampil menetap, jadi harus di BAWAH z-index default
  // overlay/dialog Vuetify (2000). Sebelumnya nilainya 9999 di semua ukuran layar — membuat
  // sidebar selalu tampil DI ATAS overlay gelap setiap dialog (Tambah Informasi Iuran, dst di
  // semua halaman), jadi sidebar tidak ikut ter-dim saat dialog terbuka di desktop.
  @media (min-width: 1280px) {
    z-index: 200;
  }

  // Senada dengan bingkai 768px di .layout-wrapper (VerticalNavLayout.vue) — hanya untuk layar kecil
  @media (max-width: 767px) {
    max-width: 768px;
    margin-inline: auto;
  }

  .nav-header {
    display: flex;
    align-items: center;

    .header-action {
      cursor: pointer;

      @at-root {
        #{variables.$selector-vertical-nav-mini} .nav-header .header-action {

          &.nav-pin,
          &.nav-unpin {
            display: none !important;
          }
        }
      }
    }
  }

  .app-title-wrapper {
    margin-inline-end: auto;
  }

  .nav-items {
    block-size: 100%;


  }

  .nav-item-title {
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .layout-vertical-nav-collapsed & {
    &:not(.hovered) {
      inline-size: variables.$layout-vertical-nav-collapsed-width;
    }
  }
}

// Sidebar disembunyikan (translateX ke luar layar) kalau sedang tidak "visible" — berlaku di
// semua ukuran layar, supaya tombol close/hamburger benar-benar berfungsi di desktop maupun mobile.
// Status defaultnya sendiri sudah diatur berbeda per breakpoint di script VerticalNavLayout.vue
// (terbuka di desktop, tertutup di mobile/tablet).
.layout-vertical-nav {
  &:not(.visible) {
    transform: translateX(calc(-#{variables.$layout-vertical-nav-width} - var(--nav-left, 0px))) !important;

    @include mixins.rtl {
      transform: translateX(variables.$layout-vertical-nav-width);
    }
  }

  transition: transform 0.25s ease-in-out;
}
</style>

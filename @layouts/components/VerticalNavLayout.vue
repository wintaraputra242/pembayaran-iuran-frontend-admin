<script lang="ts">
import VerticalNav from '@layouts/components/VerticalNav.vue';
import { useDisplay } from 'vuetify';

export default defineComponent({
  setup(props, { slots }) {
    const route = useRoute()
    const { mdAndDown } = useDisplay()
    const authStore = useAuthStore()

    // Sidebar cuma diperuntukkan untuk admin — ketua regu tidak boleh melihatnya sama sekali,
    // di ukuran layar manapun (bukan cuma disembunyikan tombol togglenya).
    const isAdmin = computed(() => authStore.user?.role === 'admin')

    // Default: terbuka (menetap) di desktop, tertutup (overlay) di mobile/tablet — tapi hanya
    // untuk admin. Untuk role lain, selalu tertutup apa pun ukuran layarnya.
    const isOverlayNavActive = ref(isAdmin.value && !mdAndDown.value)
    const isLayoutOverlayVisible = ref(false)
    const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)

    // Kalau breakpoint berpindah (mis. window di-resize melewati 1280px), sinkronkan ulang
    // ke default masing-masing mode supaya tidak "nyangkut" di state mode sebelumnya.
    watch(mdAndDown, isNowMdAndDown => {
      isOverlayNavActive.value = isAdmin.value && !isNowMdAndDown
    })

    // ℹ️ This is alternative to below two commented watcher
    // We want to show overlay if overlay nav is visible and want to hide overlay if overlay is hidden and vice versa.
    syncRef(isOverlayNavActive, isLayoutOverlayVisible)

    return () => {
      // 👉 Vertical nav
      const verticalNav = h(
        VerticalNav,
        { isOverlayNavActive: isOverlayNavActive.value, toggleIsOverlayNavActive },
        {
          'nav-header': () => slots['vertical-nav-header']?.({ toggleIsOverlayNavActive }),
          'before-nav-items': () => slots['before-vertical-nav-items']?.(),
          'default': () => slots['vertical-nav-content']?.(),
          'after-nav-items': () => slots['after-vertical-nav-items']?.(),
        },
      )

      // 👉 Navbar
      const navbar = h(
        'header',
        { class: ['layout-navbar navbar-blur'] },
        [
          h(
            'div',
            { class: 'navbar-content-container' },
            slots.navbar?.({
              toggleVerticalOverlayNavActive: toggleIsOverlayNavActive,
            }),
          ),
        ],
      )

      const main = h(
        'main',
        { class: 'layout-page-content' },
        h('div', { class: 'page-content-container' }, slots.default?.()),
      )

      // 👉 Footer
      const footer = h(
        'footer',
        { class: 'layout-footer' },
        [
          h(
            'div',
            { class: 'footer-content-container' },
            slots.footer?.(),
          ),
        ],
      )

      // 👉 Overlay
      const layoutOverlay = h(
        'div',
        {
          class: ['layout-overlay', { visible: isLayoutOverlayVisible.value }],
          onClick: () => { isLayoutOverlayVisible.value = !isLayoutOverlayVisible.value },
        },
      )

      return h(
        'div',
        {
          class: [
            'layout-wrapper layout-nav-type-vertical layout-navbar-static layout-footer-static layout-content-width-fluid',
            mdAndDown.value && 'layout-overlay-nav',
            isOverlayNavActive.value ? 'layout-nav-open' : 'layout-nav-closed',
            route.meta.layoutWrapperClasses,
          ],
        },
        [
          h(
            'div',
            { class: 'layout-center-wrapper' },
            [
              verticalNav,
              h(
                'div',
                { class: 'layout-content-wrapper' },
                [
                  navbar,
                  main,
                  footer,
                ],
              ),
            ],
          ),
          layoutOverlay,
        ],
      )
    }
  },
})
</script>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-wrapper.layout-nav-type-vertical {
  // TODO(v2): Check why we need height in vertical nav & min-height in horizontal nav
  min-height: 100dvh;
  background-color: #ffffff; // warna dalam
  position: relative;
  overflow: hidden; // penting agar sidebar tidak overflow keluar
  block-size: 100%;

  // Bingkai ala aplikasi mobile (max-width 768px, di-center) HANYA untuk layar kecil (HP).
  // Sebelumnya diterapkan tanpa media query sehingga desktop pun ikut terjepit ke 768px.
  @media (max-width: 767px) {
    max-width: 768px;
    margin-inline: auto;
  }

  .layout-content-wrapper {
    overflow: hidden !important;
    padding-inline-start: 0;
    transition: padding-inline-start 0.2s ease-in-out;
  }

  // Beri ruang untuk sidebar HANYA selama sidebar sedang terbuka & di layar desktop.
  // Kalau sidebar ditutup (tombol silang), konten kembali memakai lebar penuh.
  &.layout-nav-open {
    @media screen and (min-width: 1280px) {
      .layout-content-wrapper {
        padding-inline-start: variables.$layout-vertical-nav-width;
      }
    }
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;
    padding: 0;

    .navbar-content-container {
      block-size: variables.$layout-vertical-nav-navbar-height;
    }

    @at-root {
      .layout-wrapper.layout-nav-type-vertical {
        .layout-navbar {
          @if variables.$layout-vertical-nav-navbar-is-contained {
            @include mixins.boxed-content;
          }

          // else
          @else {
            .navbar-content-container {
              @include mixins.boxed-content;
            }
          }
        }
      }
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @extend %layout-navbar-sticky;
  }

  &.layout-navbar-hidden .layout-navbar {
    @extend %layout-navbar-hidden;
  }

  // 👉 Footer
  .layout-footer {
    @include mixins.boxed-content;
  }

  // 👉 Layout overlay
  .layout-overlay {
    position: fixed;
    z-index: variables.$layout-overlay-z-index;
    background-color: rgb(0 0 0 / 60%);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease-in-out;
    will-change: transform;

    // Ikut dibatasi 768px hanya di layar kecil, senada dengan .layout-wrapper di atas
    @media (max-width: 767px) {
      max-width: 768px;
      margin-inline: auto;
    }

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }

    // Di desktop sidebar sudah tampil menetap (bukan overlay), jadi backdrop gelap ini
    // tidak relevan lagi — cegah muncul kalau tombol hamburger tetap dipencet dari kebiasaan.
    @media (min-width: 1280px) {
      display: none;
    }
  }

  // Adjust right column pl when vertical nav is collapsed
  &.layout-vertical-nav-collapsed .layout-content-wrapper {
    padding-inline-start: variables.$layout-vertical-nav-collapsed-width;
  }

  // 👉 Content height fixed
  &.layout-content-height-fixed {
    .layout-content-wrapper {
      max-block-size: 100dvh;
    }

    .layout-page-content {
      display: flex;
      overflow: hidden;
      position: relative;

      .page-content-container {
        inline-size: 100%;

        > :first-child {
          max-block-size: 100%;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>

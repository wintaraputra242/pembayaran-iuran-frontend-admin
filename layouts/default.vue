<script lang="ts" setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue';

const uiStore = useUiStore()

// import { useAuth } from '@/composables/api/useAuth';

// const router = useRouter()

// const authStore = useAuthStore()
// const { fetchUser } = useAuth()

// const getUser = async () => {
//   const ok = await fetchUser()
//   // if (ok) {
//   //   router.push(authStore.role === 'admin' ? '/' : '/create-pembayaran')
//   // }
// }

// if (authStore.isLoggedIn && !authStore.user) {
//   getUser()
// }
</script>

<template>
  <div>
    <DefaultLayoutWithVerticalNav>
      <!-- <GetUser /> -->
      <slot />
    </DefaultLayoutWithVerticalNav>
    <ErrorDialog :show="uiStore.errorDialog.show" :title="uiStore.errorDialog.title" :message="uiStore.errorDialog.message" @close="uiStore.closeError" />
  </div>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>

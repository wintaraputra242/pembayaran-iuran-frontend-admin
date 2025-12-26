<script setup lang="ts">

const ui = useUiStore()

// import { useAuth } from '@/composables/api/useAuth';

// const router = useRouter()

// const authStore = useAuthStore()
// const { fetchUser } = useAuth()

// const getUser = async () => {
//   const ok = await fetchUser()
//   console.log(authStore.role);
  
//   // if (ok) {
//   //   router.push(authStore.role === 'admin' ? '/' : '/create-pembayaran')
//   // }
// }

// if (authStore.isLoggedIn && !authStore.user) {
//   getUser()
// }
</script>

<template>
  <div
    class="layout-wrapper layout-blank"
    data-allow-mismatch
  >
    <!-- <GetUser /> -->
    <slot />
    <ErrorDialog :show="ui.errorDialog.show" :title="ui.errorDialog.title" :message="ui.errorDialog.message" @close="ui.closeError" />
  </div>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>

<script lang="ts" setup>
import ChatbotWidget from '@/components/ChatbotWidget.vue';
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue';

const uiStore = useUiStore()
const notificationStore = useNotificationStore()

const { isScrolled, scrollToTop } = useScrollStatus(20)

// watch(() => uiStore.errorDialog.message, (val) => {
//   console.log(val.informasi_iuran?.[0]);
// })

onMounted(async () => {
  await notificationStore.fetchUnreadCount()
})
</script>

<template>
  <div>
    <DefaultLayoutWithVerticalNav>
      <!-- <GetUser /> -->
      <slot />
    </DefaultLayoutWithVerticalNav>

    <ErrorDialog :show="uiStore.errorDialog.show" :title="uiStore.errorDialog.title"
      :message="(uiStore.errorDialog.message as any)?.informasi_iuran?.[0] ?? uiStore.errorDialog.message"
      @close="uiStore.closeError" />
    <SuccessDialog v-model="uiStore.successDialog.show" :title="uiStore.successDialog.title"
      :message="uiStore.successDialog.message" @close="uiStore.closeSuccess" />
    <InfoDialog v-model="uiStore.infoDialog.show" :title="uiStore.infoDialog.title"
      :message="uiStore.infoDialog.message" @close="uiStore.closeInfo" />

    <VFab :active="isScrolled" icon="ri-arrow-up-s-line" size="large"
      style="z-index: 10; position: fixed; bottom: 30px; right: 50px;" @click="scrollToTop()"></VFab>

    <ChatbotWidget />
  </div>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>

<script setup lang="ts">
import { useAuth } from '@/composables/api/useAuth';
import avatar1 from '@images/avatars/avatar-1.png';

const router = useRouter()
const route = useRoute()

const { logout } = useAuth()

const uiStore = useUiStore()
const authStore = useAuthStore()

const isLoadingLogout = ref(false)
const logoutUser = async () => {
  isLoadingLogout.value = true
  
  try {
    await logout()

    uiStore.startLoading()
    const fromPath = useCookie('from-path')
    fromPath.value = route.path
    
    router.push('/login')
  } catch (e: any) {
    uiStore.showError(e.errors ?? 'Terjadi kesalahan saat logout', 'Gagal Logout')
  } finally {
    isLoadingLogout.value = false
  }
}

</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ authStore.user?.name }}
            </VListItemTitle>
            <VListItemSubtitle class="text-capitalize">{{ authStore.user?.role }}</VListItemSubtitle>
          </VListItem>
          <VDivider v-if="authStore.user?.role !== 'admin'" class="my-2" />

          <!-- 👉 Profile -->
          <VListItem v-if="authStore.user?.role !== 'admin'" link to="/regu-list">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-team-line"
                size="22"
              />
            </template>

            <VListItemTitle>Regu Saya</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem v-if="authStore.user?.role !== 'admin'" link to="/my-activity">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-time-line"
                size="22"
              />
            </template>

            <VListItemTitle>Aktivitas Saya</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <!-- <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-money-dollar-circle-line"
                size="22"
              />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem> -->

          <!-- 👉 FAQ -->
          <!-- <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-question-line"
                size="22"
              />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem> -->

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logoutUser">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="ri-logout-box-r-line"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/api/useAuth'

  const router = useRouter()

  const { user, role } = useAuthStore()
  const { fetchUser } = useAuth()

  const getUser = async () => {
    const ok = await fetchUser()
    if (ok) {
      router.push(role === 'admin' ? '/' : '/create-pembayaran')
    }
  }

  if (!user) {
    getUser()
  }
</script>

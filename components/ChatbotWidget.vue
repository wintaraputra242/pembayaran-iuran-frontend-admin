<script setup lang="ts">
const authStore = useAuthStore()
const isKetuaRegu = computed(() => (authStore.user as any)?.role === 'ketua_regu')

const chatbotStore = useChatbotStore()
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const lastCategory = ref<string | null>(null)

const categoryKeywords: Record<string, string[]> = {
  'Statistik': ['persentase', 'persen', 'rata-rata', 'rata rata', 'tertinggi', 'statistik'],
  'Pembayaran': ['bayar', 'pemasukan', 'tunggakan', 'pembayaran', 'transaksi'],
  'Warga': ['warga', 'kk', 'jumlah', 'aktif'],
  'Ringkasan': ['ringkasan', 'ringkas', 'terlambat', 'notifikasi', 'reminder'],
}

const detectCategory = (message: string): string | null => {
  const lower = message.toLowerCase()
  for (const [kategori, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => lower.includes(k))) return kategori
  }
  return null
}

const suggestedFollowUp = computed(() => {
  if (!lastCategory.value) return []
  return (
    chatbotStore.suggestedQuestions
      .find(k => k.kategori === lastCategory.value)
      ?.questions.filter(q => askedQuestion.value !== q) ?? []
  )
})

onMounted(async () => {
  await chatbotStore.fetchSuggestedQuestions()
})

watch(
  () => chatbotStore.messages.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }

    const lastUserMsg = [...chatbotStore.messages]
      .reverse()
      .find(m => m.role === 'user')

    if (lastUserMsg) {
      lastCategory.value = detectCategory(lastUserMsg.message)
    }
  }
)

const askedQuestion = ref<string>('')

// Update handleSuggestion
const handleSuggestion = async (question: string) => {
  if (chatbotStore.loading) return
  askedQuestion.value = question
  await chatbotStore.sendMessage(question)
}

// Update handleSend juga
const handleSend = async () => {
  const msg = inputMessage.value.trim()
  if (!msg || chatbotStore.loading) return
  inputMessage.value = ''
  askedQuestion.value = msg
  await chatbotStore.sendMessage(msg)
}


const formatMessage = (text: string) => {
  return text.replace(/\*(.+?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
}

watch(
  () => chatbotStore.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }
)

const chatbotTitle = computed(() => isKetuaRegu.value ? 'Asisten Ketua Regu' : 'AI Assistant')
const chatbotSubtitle = computed(() => isKetuaRegu.value ? 'Informasi seputar regu Anda' : 'Asisten Admin Banjar')
const chatbotGreeting = computed(() => isKetuaRegu.value ? 'Halo, Ketua Regu! 👋' : 'Halo, Admin! 👋')

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
</script>

<template>
  <div>
    <!-- Floating Button -->
    <VBtn icon size="large" color="primary" style="position: fixed; bottom: 10px; left: 10px; z-index: 999;"
      elevation="6" @click="chatbotStore.toggleChat()">
      <VIcon :icon="chatbotStore.isOpen ? 'ri-close-line' : 'ri-robot-line'" size="24" />
      <VTooltip activator="parent" location="left">AI Assistant</VTooltip>
    </VBtn>

    <!-- Teleport ke body agar tidak terpengaruh parent CSS -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="chatbotStore.isOpen" style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 997;
      " @click="chatbotStore.closeChat()" />
      </Transition>

      <Transition name="chat-slide">
        <div v-if="chatbotStore.isOpen" style="
            position: fixed;
            bottom: 100px;
            right: 16px;
            width: 380px;
            max-width: calc(100vw - 32px);
            height: 560px;
            max-height: calc(100vh - 120px);
            z-index: 998;
            display: flex;
            flex-direction: column;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            background: #ffffff;
          ">
          <!-- Header -->
          <div class="d-flex align-center justify-space-between pa-4 flex-shrink-0"
            style="background: rgb(var(--v-theme-primary));">
            <div class="d-flex align-center gap-3">
              <VAvatar color="white" size="36">
                <VIcon icon="ri-robot-line" color="white" size="36" />
              </VAvatar>
              <div>
                <p class="text-white font-weight-bold mb-0" style="font-size: 14px;">
                  {{ chatbotTitle }}
                </p>
                <p class="text-white mb-0" style="font-size: 11px; opacity: 0.8;">
                  {{ chatbotSubtitle }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-1">
              <IconBtn size="small" @click="chatbotStore.clearMessages(); lastCategory = null; askedQuestion = ''">
                <VIcon icon="ri-refresh-line" color="white" size="18" />
                <VTooltip activator="parent">Reset Percakapan</VTooltip>
              </IconBtn>
              <IconBtn size="small" @click="chatbotStore.closeChat()">
                <VIcon icon="ri-close-line" color="white" size="18" />
              </IconBtn>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" style="
              overflow-y: auto;
              flex: 1 1 0;
              min-height: 0;
              display: flex;
              flex-direction: column;
              gap: 12px;
              padding: 12px;
              background: #f8f9fa;
            ">
            <!-- Welcome + Suggested Questions -->
            <template v-if="chatbotStore.messages.length === 0">
              <div style="text-align: center; padding: 8px 0;">
                <VAvatar color="primary" size="48" style="margin-bottom: 8px;">
                  <VIcon icon="ri-robot-line" size="28" color="white" />
                </VAvatar>
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #1a1a2e;">
                  {{ chatbotGreeting }}
                </p>
                <p style="font-size: 12px; color: #888; margin: 0;">
                  Apa yang ingin Anda ketahui?
                </p>
              </div>

              <div v-if="chatbotStore.loadingSuggestions" style="text-align: center; padding: 8px 0;">
                <VProgressCircular indeterminate color="primary" size="24" />
              </div>

              <template v-else>
                <div v-for="kategori in chatbotStore.suggestedQuestions" :key="kategori.kategori">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                    <VIcon :icon="kategori.icon" size="13" color="primary" />
                    <span style="font-size: 11px; font-weight: 600; color: rgb(var(--v-theme-primary));">
                      {{ kategori.kategori }}
                    </span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <button v-for="question in kategori.questions" :key="question" style="
                        text-align: left;
                        padding: 8px 12px;
                        border-radius: 8px;
                        border: 1px solid rgba(var(--v-theme-primary), 0.3);
                        background: rgba(var(--v-theme-primary), 0.06);
                        color: rgb(var(--v-theme-primary));
                        font-size: 12px;
                        cursor: pointer;
                        transition: background 0.2s;
                        width: 100%;
                      " @click="handleSuggestion(question)"
                      @mouseover="(e) => (e.target as HTMLElement).style.background = 'rgba(var(--v-theme-primary), 0.12)'"
                      @mouseleave="(e) => (e.target as HTMLElement).style.background = 'rgba(var(--v-theme-primary), 0.06)'">
                      {{ question }}
                    </button>
                  </div>
                </div>
              </template>
            </template>

            <!-- Chat Messages -->
            <template v-else>
              <div v-for="msg in chatbotStore.messages" :key="msg.id" style="display: flex; flex-direction: column;"
                :style="msg.role === 'user' ? 'align-items: flex-end;' : 'align-items: flex-start;'">
                <!-- User Message -->
                <div v-if="msg.role === 'user'" style="
                    background: rgb(var(--v-theme-primary));
                    border-radius: 16px 16px 4px 16px;
                    padding: 10px 14px;
                    max-width: 85%;
                  ">
                  <p style="color: #fff; font-size: 13px; margin: 0;">{{ msg.message }}</p>
                </div>

                <!-- Bot Message -->
                <div v-else style="max-width: 85%; display: flex; flex-direction: column; gap: 6px;">
                  <div style="
                      background: #ffffff;
                      border-radius: 16px 16px 16px 4px;
                      padding: 10px 14px;
                      border: 1px solid rgba(0,0,0,0.08);
                      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
                    ">
                    <p style="font-size: 13px; line-height: 1.6; color: #1a1a2e; margin: 0;"
                      v-html="formatMessage(msg.message)" />

                    <!-- Data List -->
                    <div v-if="msg.data && msg.data.length > 0" style="margin-top: 8px;">
                      <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.08); margin-bottom: 8px;" />
                      <div v-for="(item, index) in msg.data" :key="index"
                        style="display: flex; align-items: center; gap: 8px; padding: 4px 0;">
                        <VAvatar color="primary" size="20">
                          <span style="font-size: 9px; color: white;">{{ index + 1 }}</span>
                        </VAvatar>
                        <div>
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #1a1a2e;">
                            {{ item.nama_warga }}
                          </p>
                          <p v-if="item.no_hp || item.total_bayar || item.jumlah_bayar"
                            style="margin: 0; font-size: 11px; color: #666;">
                            {{ item.no_hp || item.total_bayar || `${item.jumlah_bayar}x bayar` }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Suggested follow-up -->
                  <div v-if="suggestedFollowUp.length > 0">
                    <p style="font-size: 10px; color: #999; margin: 0 0 4px;">
                      Pertanyaan lainnya:
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      <VChip v-for="q in suggestedFollowUp" :key="q" size="x-small" variant="tonal" color="primary"
                        class="cursor-pointer"
                        style="font-size: 10px; height: auto; padding: 4px 8px; white-space: normal;"
                        @click="handleSuggestion(q)">
                        {{ q }}
                      </VChip>
                    </div>
                  </div>
                </div>

                <!-- Timestamp -->
                <p style="font-size: 10px; color: #999; margin: 4px 0 0;"
                  :style="msg.role === 'user' ? 'text-align: right;' : 'text-align: left;'">
                  {{ new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                </p>
              </div>

              <!-- Loading -->
              <div v-if="chatbotStore.loading" style="align-self: flex-start;">
                <div style="
                    background: #ffffff;
                    border-radius: 16px 16px 16px 4px;
                    padding: 10px 14px;
                    border: 1px solid rgba(0,0,0,0.08);
                  ">
                  <div style="display: flex; gap: 4px; align-items: center;">
                    <span class="typing-dot" />
                    <span class="typing-dot" style="animation-delay: 0.2s" />
                    <span class="typing-dot" style="animation-delay: 0.4s" />
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Input -->
          <!-- <div style="
              padding: 12px;
              background: #ffffff;
              border-top: 1px solid rgba(0,0,0,0.08);
              flex-shrink: 0;
            ">
            <div style="display: flex; gap: 8px; align-items: center;">
              <VTextField v-model="inputMessage" placeholder="Ketik pertanyaan Anda..." variant="outlined"
                density="compact" hide-details style="font-size: 13px;" @keyup.enter="handleSend" />
              <VBtn icon color="primary" size="small" :disabled="!inputMessage.trim() || chatbotStore.loading"
                @click="handleSend">
                <VIcon icon="ri-send-plane-fill" size="18" />
              </VBtn>
            </div>
          </div> -->
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s ease;
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  animation: typing 1s infinite;
  display: inline-block;
}

@keyframes typing {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

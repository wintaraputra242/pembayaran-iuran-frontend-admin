import { useChatbot } from '@/composables/api/useChatbot'
import { defineStore } from 'pinia'

interface ChatMessage {
  id: number
  role: 'user' | 'bot'
  message: string
  data?: any[] | null
  timestamp: Date
}

interface SuggestedCategory {
  kategori: string
  icon: string
  questions: string[]
}

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    messages: [] as ChatMessage[],
    suggestedQuestions: [] as SuggestedCategory[],
    loading: false,
    loadingSuggestions: false,
  }),

  actions: {
    toggleChat() {
      this.isOpen = !this.isOpen
    },

    openChat() {
      this.isOpen = true
    },

    closeChat() {
      this.isOpen = false
    },

    addMessage(role: 'user' | 'bot', message: string, data?: any[] | null) {
      this.messages.push({
        id: Date.now(),
        role,
        message,
        data,
        timestamp: new Date(),
      })
    },

    async sendMessage(message: string) {
      const chatbot = useChatbot()

      this.addMessage('user', message)
      this.loading = true

      try {
        const res = await chatbot.sendMessage(message)
        this.addMessage('bot', res.message, res.data)
      } catch {
        this.addMessage('bot', 'Maaf, terjadi kesalahan. Silakan coba lagi.')
      } finally {
        this.loading = false
      }
    },

    async fetchSuggestedQuestions() {
      if (this.suggestedQuestions.length > 0) return

      const chatbot = useChatbot()
      this.loadingSuggestions = true

      try {
        const res = await chatbot.getSuggestedQuestions()
        this.suggestedQuestions = res.data
      } finally {
        this.loadingSuggestions = false
      }
    },

    clearMessages() {
      this.messages = []
    },
  },
})

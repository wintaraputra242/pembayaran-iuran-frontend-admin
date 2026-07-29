import { useApi } from "./useApi"

export const useChatbot = () => {
  const { api } = useApi()

  const sendMessage = async (message: string) => {
    return await api<{
      status: boolean
      intent: string
      message: string
      data: any[] | null
    }>('/chatbot/chat', {
      method: 'POST',
      body: { message },
    })
  }

  const getSuggestedQuestions = async () => {
    return await api<{
      status: boolean
      data: {
        kategori: string
        icon: string
        questions: string[]
      }[]
    }>('/chatbot/suggested-questions')
  }

  return { sendMessage, getSuggestedQuestions }
}

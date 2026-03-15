import type {
  GetNotificationsResponse,
  GetUnreadNotificationCountResponse,
  MarkNotificationReadResponse,
} from '@/types/api/notification'

import { useApi } from './useApi'

export const useNotification = () => {
  const { api } = useApi()

  const getNotifications = async (params?: {
    page?: number
    per_page?: number
    type?: string
  }): Promise<GetNotificationsResponse> => {
    return await api<GetNotificationsResponse>('/notifications', {
      method: 'GET',
      params,
    })
  }

  const getUnreadCount = async (): Promise<GetUnreadNotificationCountResponse> => {
    return await api<GetUnreadNotificationCountResponse>('/notifications/unread-count', {
      method: 'GET',
    })
  }

  const markAsRead = async (id: number): Promise<MarkNotificationReadResponse> => {
    return await api<MarkNotificationReadResponse>(`/notifications/${id}/read`, {
      method: 'PATCH',
    })
  }

  const markAllAsRead = async (): Promise<MarkNotificationReadResponse> => {
    return await api<MarkNotificationReadResponse>('/notifications/read-all', {
      method: 'PATCH',
    })
  }

  return {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
  }
}

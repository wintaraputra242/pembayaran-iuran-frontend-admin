import type { PaginatedResponse } from "../common"

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface GetNotificationsResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<Notification>
}

export interface GetUnreadNotificationCountResponse {
  code: number
  success: boolean
  message: string
  data: {
    unread_count: number
  }
}

export interface MarkNotificationReadResponse {
  code: number
  success: boolean
  message: string
  data: Notification | null
}

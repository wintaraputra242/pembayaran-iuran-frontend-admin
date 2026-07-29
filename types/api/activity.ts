import type { PaginatedResponse } from "../common"

export interface ActivityLog {
  id: number
  id_user: number
  action: string
  description: string
  ip_address: string
  user_agent: string
  created_at: string
  updated_at: string
}

export interface GetActivityLogsResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<ActivityLog>
}

export interface GetActivityLogDetailResponse {
  code: number
  success: boolean
  message: string
  data: ActivityLog
}

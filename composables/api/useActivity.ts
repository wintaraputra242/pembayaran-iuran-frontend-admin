import type {
  GetActivityLogDetailResponse,
  GetActivityLogsResponse
} from '@/types/api/activity'

import { useApi } from './useApi'

export const useActivity = () => {
  const { api } = useApi()

  const getActivityLogs = async (params?: {
    page?: number
    limit?: number
    action?: string
    id_user?: number
    start_date?: string
    end_date?: string
  }): Promise<GetActivityLogsResponse> => {
    return await api<GetActivityLogsResponse>('/activity-logs', {
      method: 'GET',
      params,
    })
  }

  const getActivityLogDetail = async (id: number): Promise<GetActivityLogDetailResponse> => {
    return await api<GetActivityLogDetailResponse>(`/activity-logs/${id}`, {
      method: 'GET',
    })
  }

  return {
    getActivityLogs,
    getActivityLogDetail,
  }
}

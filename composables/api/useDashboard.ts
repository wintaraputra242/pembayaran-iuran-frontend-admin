import type { ActivityLog } from '@/types/api/activity'
import type { GetDashboardResponse } from '@/types/api/dashboard'
import type { MasterWarga } from '@/types/api/master-warga'
import type { Notification } from '@/types/api/notification'
import type { Pembayaran } from '@/types/api/pembayaran'
import { useApi } from './useApi'

export interface DashboardResponse {
  total_warga: number
  total_pembayaran_hari_ini: number
  data: any[]
}

export const useDashboard = () => {
  const { api } = useApi()

  const getDashboard = async (params?: {
    type?: 'notifikasi' | 'pembayaran' | 'warga_belum_bayar' | 'activity_log'
  }): Promise<GetDashboardResponse<Notification | Pembayaran | MasterWarga | ActivityLog>> => {
    return await api<GetDashboardResponse<Notification | Pembayaran | MasterWarga | ActivityLog>>('/dashboard', {
      method: 'GET',
      params,
    })
  }

  return {
    getDashboard,
  }
}

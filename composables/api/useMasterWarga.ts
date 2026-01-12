import type { GetMasterWargaResponse } from '@/types/api/master-warga'
import { useApi } from './useApi'

export const useMasterWarga = () => {
  const { api } = useApi()

  const getWarga = async (params?: {
    page?: number
    limit?: number
    keyword?: string
    status?: string
  }): Promise<GetMasterWargaResponse> => {
    return await api<GetMasterWargaResponse>('/warga', {
      method: 'GET',
      params,
    })
  }

  return {
    getWarga,
  }
}

import type { GetMasterUsersResponse } from '@/types/api/master-users'
import { useApi } from './useApi'

export const useMasterUsers = () => {
  const { api } = useApi()

  const getUsers = async (params?: {
    page?: number
    limit?: number
    keyword?: string
    role?: string
  }): Promise<GetMasterUsersResponse> => {
    return await api<GetMasterUsersResponse>('/users', {
      method: 'GET',
      params,
    })
  }

  return {
    getUsers,
  }
}

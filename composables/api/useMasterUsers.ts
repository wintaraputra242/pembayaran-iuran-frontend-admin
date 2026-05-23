import type { GetDetailMasterUsersResponse, GetMasterUsersResponse, UpdateUserPayload, UpdateUserResponse } from '@/types/api/master-users'
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
      query: params,
    })
  }

  const getDetailUser = async (id: number): Promise<GetDetailMasterUsersResponse> => {
    return await api<GetDetailMasterUsersResponse>(`/users/${id}`)
  }

  const updateUser = async (body: UpdateUserPayload, id: number): Promise<UpdateUserResponse> => {
    return await api<UpdateUserResponse>(`/users/${id}`, {
      method: 'PUT',
      body,
    })
  }

  const downloadCredentialPdf = async (): Promise<Blob> => {
    return await api<Blob>('/users/credential/download', {
      responseType: 'blob',
    })
  }

  return {
    getUsers,
    getDetailUser,
    updateUser,
    downloadCredentialPdf,
  }
}

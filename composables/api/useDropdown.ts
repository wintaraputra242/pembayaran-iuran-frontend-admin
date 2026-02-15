import type { GetWargaForDropdownAddAnggotaResponse, GetWargaForDropdownResponse } from '@/types/api/dropdown'
import { useApi } from './useApi'

export const useDropdown = () => {
  const { api } = useApi()

  const getWargaForDropdown = async (): Promise<GetWargaForDropdownResponse> => {
    return await api<GetWargaForDropdownResponse>('/dropdown/warga', {
      method: 'GET',
    })
  }

  const getWargaForDropdownAddAnggota = async (): Promise<GetWargaForDropdownAddAnggotaResponse> => {
    return await api<GetWargaForDropdownAddAnggotaResponse>('/dropdown/warga-for-anggota', {
      method: 'GET',
    })
  }

  return {
    getWargaForDropdownAddAnggota,
    getWargaForDropdown
  }
}

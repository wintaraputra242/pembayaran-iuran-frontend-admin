import type { GetWargaForDropdownAddAnggotaResponse } from '@/types/api/dropdown'
import { useApi } from './useApi'

export const useDropdown = () => {
  const { api } = useApi()

  const getWargaForDropdownAddAnggota = async (): Promise<GetWargaForDropdownAddAnggotaResponse> => {
    return await api<GetWargaForDropdownAddAnggotaResponse>('/dropdown/warga-for-anggota', {
      method: 'GET',
    })
  }

  return {
    getWargaForDropdownAddAnggota
  }
}

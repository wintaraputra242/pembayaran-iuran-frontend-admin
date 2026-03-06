import type { GetWargaForDropdownAddAnggotaResponse, GetWargaForDropdownInformasiIuranResponse, GetWargaForDropdownPembayaranResponse, GetWargaForDropdownReguResponse, GetWargaForDropdownResponse } from '@/types/api/dropdown'
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

  const getWargaForDropdownPembayaran = async (params: {
    regu_id?: number | string
    id_informasi_iuran: number
  }): Promise<GetWargaForDropdownPembayaranResponse> => {
    return await api<GetWargaForDropdownPembayaranResponse>('/dropdown/warga-for-pembayaran', {
      method: 'GET',
      params
    })
  }

  const getInformasiIuranForDropdown = async (): Promise<GetWargaForDropdownInformasiIuranResponse> => {
    return await api<GetWargaForDropdownInformasiIuranResponse>('/dropdown/informasi-iuran', {
      method: 'GET',
    })
  }

  const getReguForDropdown = async (): Promise<GetWargaForDropdownReguResponse> => {
    return await api<GetWargaForDropdownReguResponse>('/dropdown/regu', {
      method: 'GET',
    })
  }

  return {
    getWargaForDropdownAddAnggota,
    getWargaForDropdown,
    getWargaForDropdownPembayaran,
    getInformasiIuranForDropdown,
    getReguForDropdown
  }
}

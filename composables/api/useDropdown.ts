import type { GetDropdownAnggotaReguResponse, GetWargaForDropdownAddAnggotaResponse, GetWargaForDropdownInformasiIuranResponse, GetWargaForDropdownPembayaranResponse, GetWargaForDropdownReguResponse, GetWargaForDropdownResponse } from '@/types/api/dropdown'
import { useApi } from './useApi'

export const useDropdown = () => {
  const { api } = useApi()

  const getWargaForDropdown = async (): Promise<GetWargaForDropdownResponse> => {
    return await api<GetWargaForDropdownResponse>('/dropdown/warga')
  }

  const getWargaForDropdownAddAnggota = async (): Promise<GetWargaForDropdownAddAnggotaResponse> => {
    return await api<GetWargaForDropdownAddAnggotaResponse>('/dropdown/warga-for-anggota')
  }

  const getWargaForDropdownPembayaran = async (params: {
    regu_id?: number | string
    id_informasi_iuran: number
  }): Promise<GetWargaForDropdownPembayaranResponse> => {
    return await api<GetWargaForDropdownPembayaranResponse>('/dropdown/warga-for-pembayaran', {
      query: params, // UBAH: params → query
    })
  }

  const getInformasiIuranForDropdown = async (): Promise<GetWargaForDropdownInformasiIuranResponse> => {
    return await api<GetWargaForDropdownInformasiIuranResponse>('/dropdown/informasi-iuran')
  }

  const getReguForDropdown = async (): Promise<GetWargaForDropdownReguResponse> => {
    return await api<GetWargaForDropdownReguResponse>('/dropdown/regu')
  }

  const getAnggotaReguForDropdown = async (): Promise<GetDropdownAnggotaReguResponse> => {
    return await api<GetDropdownAnggotaReguResponse>('/dropdown/anggota-regu')
  }

  return {
    getWargaForDropdown,
    getWargaForDropdownAddAnggota,
    getWargaForDropdownPembayaran,
    getInformasiIuranForDropdown,
    getReguForDropdown,
    getAnggotaReguForDropdown,
  }
}

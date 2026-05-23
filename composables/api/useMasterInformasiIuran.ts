import type { AddInformasiIuranPayload, AddInformasiIuranResponse, DeleteInformasiIuranResponse, GetDetailMasterInformasiIuranResponse, GetMasterInformasiIuranResponse, UpdateInformasiIuranResponse, UpdateStatusInformasiIuranResponse } from '@/types/api/master-informasi-iuran'
import { useApi } from './useApi'

export const useMasterInformasiIuran = () => {
  const { api } = useApi()

  const getInformasiIuran = async (params?: {
    page?: number
    limit?: number
    nama_regu?: string
    status_keaktifan?: number
    jenis_iuran?: string
    mode?: string
  }): Promise<GetMasterInformasiIuranResponse> => {
    return await api<GetMasterInformasiIuranResponse>('/informasi-iuran', {
      query: params,
    })
  }

  const getInformasiIuranActive = async (params?: {
    page?: number
    limit?: number
    jenis_iuran?: string
    keyword?: string
  }): Promise<GetMasterInformasiIuranResponse> => {
    return await api<GetMasterInformasiIuranResponse>('/informasi-iuran/active', { // UBAH: /informasi-iuran-active → /informasi-iuran/active
      query: params,
    })
  }

  const getDetailInformasiIuran = async (id: number | string): Promise<GetDetailMasterInformasiIuranResponse> => {
    return await api<GetDetailMasterInformasiIuranResponse>(`/informasi-iuran/${id}`)
  }

  const addInformasiIuran = async (body: AddInformasiIuranPayload): Promise<AddInformasiIuranResponse> => {
    return await api<AddInformasiIuranResponse>('/informasi-iuran', {
      method: 'POST',
      body,
    })
  }

  const updateInformasiIuran = async (body: AddInformasiIuranPayload, id: number): Promise<UpdateInformasiIuranResponse> => {
    return await api<UpdateInformasiIuranResponse>(`/informasi-iuran/${id}`, {
      method: 'PUT',
      body,
    })
  }

  const updateStatusInformasiIuran = async (payload: { id: number; status_aktif: number }): Promise<UpdateStatusInformasiIuranResponse> => {
    const { id, status_aktif } = payload

    return await api<UpdateStatusInformasiIuranResponse>(`/informasi-iuran/${id}/status`, {
      method: 'PATCH',
      body: { status_aktif },
    })
  }

  const deleteInformasiIuran = async (id: number): Promise<DeleteInformasiIuranResponse> => {
    return await api<DeleteInformasiIuranResponse>(`/informasi-iuran/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    getInformasiIuran,
    getInformasiIuranActive,
    getDetailInformasiIuran,
    addInformasiIuran,
    updateInformasiIuran,
    updateStatusInformasiIuran,
    deleteInformasiIuran,
  }
}

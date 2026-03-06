import type { AddInformasiIuranPayload, AddInformasiIuranResponse, DeleteInformasiIuranResponse, GetDetailMasterInformasiIuranResponse, GetMasterInformasiIuranResponse, UpdateInformasiIuranResponse, UpdateStatusInformasiIuranResponse } from '@/types/api/master-informasi-iuran'
import { useApi } from './useApi'

export const useMasterInformasiIuran = () => {
  const { api, fetchCsrf } = useApi()

  const getInformasiIuran = async (params?: {
    page?: number
    limit?: number
    nama_regu?: string
    status_keaktifan?: number
    jenis_iuran?: string
    mode?: string
  }): Promise<GetMasterInformasiIuranResponse> => {
    return await api<GetMasterInformasiIuranResponse>('/informasi-iuran', {
      method: 'GET',
      params,
    })
  }
  
  const getDetailInformasiIuran = async (id: number | string): Promise<GetDetailMasterInformasiIuranResponse> => {
    return await api<GetDetailMasterInformasiIuranResponse>('/informasi-iuran/' + id, {
      method: 'GET',
    })
  }

  const addInformasiIuran = async (body: AddInformasiIuranPayload): Promise<AddInformasiIuranResponse> => {
    await fetchCsrf()

    return await api<AddInformasiIuranResponse>('/informasi-iuran', {
      method: 'POST',
      body,
    })
  }

  const updateInformasiIuran = async (body: AddInformasiIuranPayload, id: number): Promise<UpdateInformasiIuranResponse> => {
    await fetchCsrf()
    
    return await api<UpdateInformasiIuranResponse>('/informasi-iuran/' + id, {
      method: 'PUT',
      body,
    })
  }

  const updateStatusInformasiIuran = async (payload: { id: number, status_aktif: number }): Promise<UpdateStatusInformasiIuranResponse> => {
    await fetchCsrf()

    const { id, status_aktif } = payload

    const res = await api<UpdateStatusInformasiIuranResponse>(`/informasi-iuran/${id}/status`, {
      method: 'PATCH',
      body: { status_aktif },
    })

    return res
  }

  const deleteInformasiIuran = async (id: number): Promise<DeleteInformasiIuranResponse> => {
    await fetchCsrf()

    const res = await api<DeleteInformasiIuranResponse>(`/informasi-iuran/${id}`, {
      method: 'DELETE',
    })

    return res
  }

  return {
    getInformasiIuran,
    getDetailInformasiIuran,
    addInformasiIuran,
    updateInformasiIuran,
    updateStatusInformasiIuran,
    deleteInformasiIuran
  }
}

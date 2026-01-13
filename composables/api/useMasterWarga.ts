import type { AddWargaPayload, AddWargaResponse, DeleteWargaResponse, GetMasterWargaResponse, ImportAddWargaResponse, UpdateStatusWargaResponse, UpdateWargaResponse } from '@/types/api/master-warga'
import { useApi } from './useApi'

export const useMasterWarga = () => {
  const { api, fetchCsrf } = useApi()

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

  const addWarga = async (payload: AddWargaPayload): Promise<AddWargaResponse> => {
    await fetchCsrf()

    const res = await api<AddWargaResponse>('/warga', {
      method: 'POST',
      body: payload,
    })

    return res
  }

  const importAddDataWarga = async (file: File): Promise<ImportAddWargaResponse> => {
    await fetchCsrf()

    const formData = new FormData
    formData.append('file', file)

    const res = await api<ImportAddWargaResponse>('/warga/import-excel', {
      method: 'POST',
      body: formData,
    })

    return res
  }

  const updateStatusWarga = async (payload: { nik: string, status_keaktifan: 'aktif' | 'tidak_aktif' }): Promise<UpdateStatusWargaResponse> => {
    await fetchCsrf()

    const { nik, status_keaktifan } = payload

    const res = await api<UpdateStatusWargaResponse>(`/warga/${nik}/status`, {
      method: 'PATCH',
      body: { status_keaktifan },
    })

    return res
  }

  const updateWarga = async (payload: AddWargaPayload, nik: string): Promise<UpdateWargaResponse> => {
    await fetchCsrf()

    const res = await api<UpdateWargaResponse>(`/warga/${nik}`, {
      method: 'PUT',
      body: payload,
    })

    return res
  }

  const deleteWarga = async (nik: string): Promise<DeleteWargaResponse> => {
    await fetchCsrf()

    const res = await api<DeleteWargaResponse>(`/warga/${nik}`, {
      method: 'DELETE',
    })

    return res
  }

  return {
    getWarga,
    addWarga,
    importAddDataWarga,
    updateStatusWarga,
    updateWarga,
    deleteWarga
  }
}

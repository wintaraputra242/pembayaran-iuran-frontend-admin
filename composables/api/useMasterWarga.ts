import type { AddWargaPayload, AddWargaResponse, DeleteWargaResponse, GetDetailMasterWargaResponse, GetMasterWargaResponse, ImportAddWargaResponse, UpdateStatusWargaResponse, UpdateWargaResponse } from '@/types/api/master-warga'
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
      query: params,
    })
  }

  const addWarga = async (payload: AddWargaPayload): Promise<AddWargaResponse> => {
    return await api<AddWargaResponse>('/warga', {
      method: 'POST',
      body: payload,
    })
  }

  const importAddDataWarga = async (file: File): Promise<ImportAddWargaResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return await api<ImportAddWargaResponse>('/warga/import-excel', {
      method: 'POST',
      body: formData,
      headers: {
        // Hapus Accept: application/json — sesuai catatan route
        // $fetch otomatis set Content-Type multipart/form-data saat body FormData
      },
    })
  }

  const detailWarga = async (nik: string): Promise<GetDetailMasterWargaResponse> => {
    return await api<GetDetailMasterWargaResponse>(`/warga/${nik}`)
  }

  const updateWarga = async (payload: AddWargaPayload, nik: string): Promise<UpdateWargaResponse> => {
    return await api<UpdateWargaResponse>(`/warga/${nik}`, {
      method: 'PUT',
      body: payload,
    })
  }

  const updateStatusWarga = async (payload: { nik: string; status_keaktifan: 'aktif' | 'tidak_aktif' }): Promise<UpdateStatusWargaResponse> => {
    const { nik, status_keaktifan } = payload

    return await api<UpdateStatusWargaResponse>(`/warga/${nik}/status`, {
      method: 'PATCH',
      body: { status_keaktifan },
    })
  }

  const deleteWarga = async (nik: string): Promise<DeleteWargaResponse> => {
    return await api<DeleteWargaResponse>(`/warga/${nik}`, {
      method: 'DELETE',
    })
  }

  const downloadTemplateImport = async (): Promise<Blob> => {
    return await api<Blob>('/warga/template-import', {
      responseType: 'blob',
    })
  }


  return {
    getWarga,
    addWarga,
    importAddDataWarga,
    detailWarga,
    updateWarga,
    updateStatusWarga,
    deleteWarga,
    downloadTemplateImport
  }
}

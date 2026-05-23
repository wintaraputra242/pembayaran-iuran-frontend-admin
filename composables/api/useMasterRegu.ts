import type { AddAnggotaPayload, AddAnggotaResponse, CreateReguPayload, CreateReguResponse, DeleteReguResponse, GetAnggotaReguResponse, GetMasterReguResponse, ResetAnggotaAllResponse, ResetAnggotaByReguResponse, ResetAnggotaResponse, SetLeaderAnggotaResponse, UpdateReguResponse, UpdateStatusReguResponse } from '@/types/api/master-regu'
import { useApi } from './useApi'

export const useMasterRegu = () => {
  const { api } = useApi()

  const getRegu = async (params?: {
    page?: number
    limit?: number
    nama_regu?: string
    status_keaktifan?: string
  }): Promise<GetMasterReguResponse> => {
    return await api<GetMasterReguResponse>('/regu', {
      query: params,
    })
  }

  const createRegu = async (body: CreateReguPayload): Promise<CreateReguResponse> => {
    return await api<CreateReguResponse>('/regu', {
      method: 'POST',
      body,
    })
  }

  const updateRegu = async (body: CreateReguPayload, id: number): Promise<UpdateReguResponse> => {
    return await api<UpdateReguResponse>(`/regu/${id}`, {
      method: 'PUT',
      body,
    })
  }

  const deleteRegu = async (id: number): Promise<DeleteReguResponse> => {
    return await api<DeleteReguResponse>(`/regu/${id}`, {
      method: 'DELETE',
    })
  }

  const updateStatusRegu = async (payload: { id: number; status_keaktifan: 'aktif' | 'tidak_aktif' }): Promise<UpdateStatusReguResponse> => {
    const { id, status_keaktifan } = payload

    return await api<UpdateStatusReguResponse>(`/regu/${id}/status`, {
      method: 'PATCH',
      body: { status_keaktifan },
    })
  }

  const getAnggotaRegu = async (params?: {
    id_regu?: number
  }): Promise<GetAnggotaReguResponse> => {
    return await api<GetAnggotaReguResponse>('/anggota-regu', {
      query: params,
    })
  }

  const addAnggotaRegu = async (body: AddAnggotaPayload): Promise<AddAnggotaResponse> => {
    return await api<AddAnggotaResponse>('/anggota-regu', {
      method: 'POST',
      body: {
        id_regu: body.id_regu,
        niks: body.niks,
      },
    })
  }

  const resetAnggota = async (id: number): Promise<ResetAnggotaResponse> => {
    return await api<ResetAnggotaResponse>(`/anggota-regu/reset/${id}`, {
      method: 'DELETE',
    })
  }

  const resetAnggotaByRegu = async (id_regu: number): Promise<ResetAnggotaByReguResponse> => {
    return await api<ResetAnggotaByReguResponse>(`/anggota-regu/reset-regu/${id_regu}`, {
      method: 'DELETE',
    })
  }

  const resetAnggotaAll = async (): Promise<ResetAnggotaAllResponse> => {
    return await api<ResetAnggotaAllResponse>('/anggota-regu/reset-all', { // UBAH: /anggota-regu-reset-all → /anggota-regu/reset-all
      method: 'DELETE',
    })
  }

  const setLeaderAnggota = async (body: { id_regu: number; nik: string }): Promise<SetLeaderAnggotaResponse> => {
    return await api<SetLeaderAnggotaResponse>('/anggota-regu/set-leader', {
      method: 'PUT',
      body,
    })
  }

  return {
    getRegu,
    createRegu,
    updateRegu,
    deleteRegu,
    updateStatusRegu,
    getAnggotaRegu,
    addAnggotaRegu,
    resetAnggota,
    resetAnggotaByRegu,
    resetAnggotaAll,
    setLeaderAnggota,
  }
}

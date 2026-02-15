import type { AddAnggotaPayload, AddAnggotaResponse, CreateReguPayload, CreateReguResponse, DeleteReguResponse, GetAnggotaReguResponse, GetMasterReguResponse, ResetAnggotaAllResponse, ResetAnggotaByReguResponse, ResetAnggotaResponse, SetLeaderAnggotaResponse, UpdateReguResponse, UpdateStatusReguResponse } from '@/types/api/master-regu'
import { useApi } from './useApi'

export const useMasterRegu = () => {
  const { api, fetchCsrf } = useApi()

  const createRegu = async (body: CreateReguPayload): Promise<CreateReguResponse> => {
    await fetchCsrf()

    return await api<CreateReguResponse>('/regu', {
      method: 'POST',
      body,
    })
  }

  const getRegu = async (params?: {
    page?: number
    limit?: number
    nama_regu?: string
    status_keaktifan?: string
  }): Promise<GetMasterReguResponse> => {
    return await api<GetMasterReguResponse>('/regu', {
      method: 'GET',
      params,
    })
  }

  const updateRegu = async (body: CreateReguPayload, id: number): Promise<UpdateReguResponse> => {
    await fetchCsrf()
    
    return await api<UpdateReguResponse>('/regu/' + id, {
      method: 'PUT',
      body,
    })
  }

  const deleteRegu = async (id: number): Promise<DeleteReguResponse> => {
    await fetchCsrf()

    const res = await api<DeleteReguResponse>(`/regu/${id}`, {
      method: 'DELETE',
    })

    return res
  }
  
  const updateStatusRegu = async (payload: { id: number, status_keaktifan: 'aktif' | 'tidak_aktif' }): Promise<UpdateStatusReguResponse> => {
    await fetchCsrf()

    const { id, status_keaktifan } = payload

    const res = await api<UpdateStatusReguResponse>(`/regu/${id}/status`, {
      method: 'PATCH',
      body: { status_keaktifan },
    })

    return res
  }

  // Anggota Regu

  const getAnggotaRegu = async (params?: {
    id_regu: number
  }): Promise<GetAnggotaReguResponse> => {
    return await api<GetAnggotaReguResponse>('/anggota-regu', {
      method: 'GET',
      params,
    })
  }

  const addAnggotaRegu = async (body: AddAnggotaPayload): Promise<AddAnggotaResponse> => {
    await fetchCsrf()

    const { id_regu, niks } = body

    const formData = new FormData()
    formData.append('id_regu', id_regu.toString())
    niks.forEach((val, i) => {
      formData.append(`niks[${i}]`, val)
    })

    return await api<AddAnggotaResponse>('/anggota-regu', {
      method: 'POST',
      body: formData,
    })
  }

  const resetAnggota = async (id: number): Promise<ResetAnggotaResponse> => {
    await fetchCsrf()

    const res = await api<ResetAnggotaResponse>(`/anggota-regu/reset/${id}`, {
      method: 'DELETE',
    })

    return res
  }

  const resetAnggotaByRegu = async (id_regu: number): Promise<ResetAnggotaByReguResponse> => {
    await fetchCsrf()

    const res = await api<ResetAnggotaByReguResponse>(`/anggota-regu/reset-regu/${id_regu}`, {
      method: 'DELETE',
    })

    return res
  }

  const resetAnggotaAll = async (): Promise<ResetAnggotaAllResponse> => {
    await fetchCsrf()

    const res = await api<ResetAnggotaAllResponse>(`/anggota-regu-reset-all`, {
      method: 'DELETE',
    })

    return res
  }

  const setLeaderAnggota = async (body: { id_regu: number, nik: string }): Promise<SetLeaderAnggotaResponse> => {
    return await api<SetLeaderAnggotaResponse>('/anggota-regu/set-leader', {
      method: 'PUT',
      body,
    })
  }

  return {
    createRegu,
    getRegu,
    updateRegu,
    deleteRegu,
    updateStatusRegu,
    getAnggotaRegu,
    addAnggotaRegu,
    resetAnggota,
    resetAnggotaByRegu,
    resetAnggotaAll,
    setLeaderAnggota
  }
}

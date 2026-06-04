import { useApi } from './useApi'

export interface QrSetting {
  id: number
  image: string
  nama_rekening: string | null
  nomor_rekening: string | null
  keterangan: string | null
  is_active: boolean
  uploaded_by: string | null
  created_at: string | null
}

export interface QrSettingActiveDetail {
  image: string
  nama_rekening: string | null
  nomor_rekening: string | null
  keterangan: string | null
}

export interface GetQrSettingsResponse {
  data: QrSetting[]
}

export interface QrSettingResponse {
  data: QrSetting
}

export interface QrSettingActiveResponse {
  data: QrSettingActiveDetail
}

export interface BaseResponse {
  message: string
}

export const useQrSetting = () => {
  const { api } = useApi()

  const getQrSettings = async (): Promise<GetQrSettingsResponse> => {
    return await api<GetQrSettingsResponse>('/qris')
  }

  const storeQrSetting = async (payload: FormData): Promise<QrSettingResponse> => {
    return await api<QrSettingResponse>('/qris', {
      method: 'POST',
      body: payload,
    })
  }

  const setActive = async (id: number): Promise<BaseResponse> => {
    return await api<BaseResponse>(`/qris/set-active/${id}`, {
      method: 'PATCH',
    })
  }

  const destroyQrSetting = async (id: number): Promise<BaseResponse> => {
    return await api<BaseResponse>(`/qris/${id}`, {
      method: 'DELETE',
    })
  }

  const getActiveQrSetting = async (): Promise<QrSettingActiveResponse> => {
    return await api<QrSettingActiveResponse>('/qris/active')
  }

  return {
    getQrSettings,
    storeQrSetting,
    setActive,
    destroyQrSetting,
    getActiveQrSetting,
  }
}

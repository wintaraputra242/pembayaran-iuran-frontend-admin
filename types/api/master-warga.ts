import type { PaginatedResponse } from "../common"

export interface MasterWarga {
  nik: string
  id_user: number | null
  nama_warga: string
  alamat: string
  no_hp: string
  status_keaktifan: 'aktif' | 'tidak_aktif'
  tanggal_nonaktif: string | null
  is_deleted: boolean
  deleted_at: string
  created_at: string
  updated_at: string
}

export interface GetMasterWargaResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<MasterWarga>
}

export interface AddWargaPayload {
  nik: string
  nama_warga: string
  alamat: string
  no_hp: string
}

export interface AddWargaResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<MasterWarga>
}

export interface ImportAddWargaResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface UpdateStatusWargaResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface UpdateWargaResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface DeleteWargaResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface GetDetailMasterWargaResponse {
  code: number
  success: boolean
  message: string
  data: MasterWarga
}

import type { PaginatedResponse } from "../common"
import type { MasterWarga } from "./master-warga"

export interface CreateReguPayload {
  nama_regu: string
}

export interface CreateReguResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

export interface MasterRegu {
  id: number
  id_user: number | null
  nama_regu: string
  status_keaktifan: 'aktif' | 'tidak_aktif'
  tanggal_nonaktif: string | null
  is_deleted: boolean
  deleted_at: string
  created_at: string
  updated_at: string
}

export interface GetMasterReguResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<MasterRegu>
}

export interface UpdateReguResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

export interface DeleteReguResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

export interface UpdateStatusReguResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

// Anggota Regu

export interface AnggotaRegu {
  id: number
  id_regu: number
  nik: string
  status_keaktifan: 'aktif' | 'nonaktif'
  is_leader: number
  created_at: string
  updated_at: string
  warga: MasterWarga
  regu: MasterRegu
}

export interface GetAnggotaReguResponse {
  code: number
  success: boolean
  message: string
  data: {
    data: AnggotaRegu[]
    leader_available: boolean
  }
}

export interface AddAnggotaPayload {
  id_regu: number,
  niks: string[]
}

export interface AddAnggotaResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

export interface ResetAnggotaResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

export interface ResetAnggotaByReguResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

export interface ResetAnggotaAllResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

export interface SetLeaderAnggotaResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}

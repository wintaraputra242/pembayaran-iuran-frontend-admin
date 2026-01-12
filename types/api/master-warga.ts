import type { PaginatedResponse } from "../common"

export interface MasterWarga {
  id: number
  username: string
  role: 'admin' | 'ketua_regu' | 'warga'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GetMasterWargaResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<MasterWarga>
}

import type { PaginatedResponse } from "../common"

export interface MasterUser {
  id: number
  username: string
  role: 'admin' | 'ketua_regu' | 'warga'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GetMasterUsersResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<MasterUser>
}

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

export interface GetDetailMasterUsersResponse {
  code: number
  success: boolean
  message: string
  data: MasterUser
}

export interface UpdateUserPayload {
  name: string
  username: string
  password: string
  role: 'admin' | 'ketua_regu'
  is_active: boolean
}

export interface UpdateUserResponse {
  success: boolean,
  code: number,
  message: string,
  data: null
}


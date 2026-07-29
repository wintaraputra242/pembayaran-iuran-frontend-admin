export interface LoginResponse {
  code: number
  success: boolean
  message: string
  data: {
    user: AuthUser,
    access_token: string,
    token_type: string,
  }
}

export interface MeResponse {
  code: number
  success: boolean
  message: string
  data: AuthUser
}

export interface AuthUser {
  id: number
  email_verified_at: string | null
  role: string
  name: string
  email: string
  updated_at: string
  username: string
}

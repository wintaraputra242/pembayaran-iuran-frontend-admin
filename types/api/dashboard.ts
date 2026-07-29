export interface DashboardData<T> {
  total_warga: number
  total_pembayaran_hari_ini: number
  data: T[]
}

export interface GetDashboardResponse<T = any> {
  code: number
  success: boolean
  message: string
  data: DashboardData<T>
}

export interface WargaForDropdown {
    nik: string,
    nama_warga: string,
  }

export interface GetWargaForDropdownResponse {
  code: number
  success: boolean
  message: string
  data: WargaForDropdown[]
}

export interface GetWargaForDropdownAddAnggotaResponse {
  code: number
  success: boolean
  message: string
  data: WargaForDropdown[]
}

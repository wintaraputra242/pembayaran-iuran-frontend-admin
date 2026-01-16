export interface WargaForDropdownAddAnggota {
    nik: string,
    nama_warga: string,
  }

export interface GetWargaForDropdownAddAnggotaResponse {
  code: number
  success: boolean
  message: string
  data: WargaForDropdownAddAnggota[]
}

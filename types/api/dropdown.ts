export interface WargaForDropdown {
  nik: string,
  nama_warga: string,
}

export interface WargaPembayaranForDropdown {
  nik: string
  nama_warga: string
  regu: string | null
  regu_id: number | null
}

export interface InformasiIuranForDropdown {
  id: number,
  judul_iuran: string,
  jenis_iuran: string,
  jumlah_iuran: string,
}

export interface ReguForDropdown {
  id: number,
  nama_regu: string,
}

export interface AnggotaReguForDropdown {
  id: number,
  nik: string,
  nama_warga: string,
  is_leader: string
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

export interface GetWargaForDropdownPembayaranResponse {
  code: number
  success: boolean
  message: string
  data: WargaPembayaranForDropdown[]
}

export interface GetWargaForDropdownInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: InformasiIuranForDropdown[]
}

export interface GetWargaForDropdownReguResponse {
  code: number
  success: boolean
  message: string
  data: ReguForDropdown[]
}

export interface GetDropdownAnggotaReguResponse {
  code: number
  success: boolean
  message: string
  data: AnggotaReguForDropdown[]
}

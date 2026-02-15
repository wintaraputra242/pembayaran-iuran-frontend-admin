import type { PaginatedResponse } from "../common"

export interface MasterInformasiIuran {
  id: number
  is_deleted: boolean | number
  judul_iuran: string
  jenis_iuran: string
  periode: number | null
  nik_penanggung_jawab: string | null
  nama_warga_meninggal: string | null
  jumlah_iuran: number
  keterangan: string
  status_aktif: boolean | number
  tanggal_nonaktif: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface GetMasterInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<MasterInformasiIuran>
}

export interface AddInformasiIuranPayload {
  judul_iuran: string
  jenis_iuran: string | null
  periode: number | null
  jumlah_iuran: number | string
  keterangan: string
  nama_warga_meninggal: string
  nik_penanggung_jawab: string | null
}

export interface AddInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface UpdateInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface UpdateStatusInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface DeleteInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: null
}

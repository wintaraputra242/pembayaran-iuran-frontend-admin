import type { PaginatedResponse } from "../common"

export interface MasterInformasiIuran {
  id: number
  is_deleted: number
  judul_iuran: string
  nama_warga_meninggal: string | null
  nik_penanggung_jawab: string
  jenis_iuran: 'bulanan' | 'kematian'
  periode: string
  jumlah_iuran: number
  keterangan: string
  status_aktif: number
  tanggal_nonaktif: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  warga?: {
    nik: string
    nama_warga: string
  }
  penanggung_jawab?: {
    nik: string
    nama_warga: string
  }
}

export interface GetMasterInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<MasterInformasiIuran>
}

export interface GetDetailMasterInformasiIuranResponse {
  code: number
  success: boolean
  message: string
  data: MasterInformasiIuran
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

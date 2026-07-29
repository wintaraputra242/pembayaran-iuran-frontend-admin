import type { PaginatedResponse } from "../common"

export interface Pembayaran {
  id: number
  nik: string
  nik_snapshot: string
  nama_warga_snapshot: string | null
  jumlah_iuran_snapshot: number
  bulan: number[]
  id_informasi_iuran: number
  tanggal_bayar: string
  total_bayar: number
  metode_bayar: string
  status_bayar: 'pending' | 'success' | 'failed'
  midtrans_order_id: string | null
  midtrans_transaction_id: string | null
  midtrans_va_number: string | null
  midtrans_qr_string: string | null
  midtrans_payment_type: string | null
  midtrans_raw_response: unknown | null
  bukti_pembayaran: string | null
  created_at: string
  updated_at: string
  warga: {
    nik: string
    id_user: number | null
    nama_warga: string
    alamat: string
    no_hp: string
    status_keaktifan: 'aktif' | 'tidak_aktif'
    is_deleted: number
    deleted_at: string | null
    tanggal_nonaktif: string | null
    created_at: string
    updated_at: string
  }
  informasi_iuran: {
    id: number
    is_deleted: number
    judul_iuran: string
    nama_warga_meninggal: string | null
    nik_penanggung_jawab: string | null
    jenis_iuran: string
    periode: string
    jumlah_iuran: number
    keterangan: string
    status_aktif: number
    tanggal_nonaktif: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
  }
}


export interface GetPembayaranResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<Pembayaran>
}

export interface GetDetailPembayaranResponse {
  code: number
  success: boolean
  message: string
  data: Pembayaran
}

export type MetodeBayar = 'tunai' | 'transfer' | 'qris'

export interface AddPembayaranPayload {
  nik: string
  id_informasi_iuran: number
  tanggal_bayar: string // format: YYYY-MM-DD
  total_bayar: number | string
  bulan?: number[] | null
  metode_bayar: MetodeBayar
  bukti_pembayaran?: File | string | null
}

export interface AddPembayaranResponse {
  code: number
  success: boolean
  message: string
  data: {
    pembayaran: Pembayaran
    snap_token: string
  }
}

export interface UnpaidWarga {
  nik: string
  nik_penanggung_jawab: string
  id_user: number | null
  nama_warga: string
  alamat: string
  no_hp: string
  status_keaktifan: 'aktif' | 'tidak_aktif'
  is_deleted: number
  deleted_at: string | null
  tanggal_nonaktif: string | null
  created_at: string
  updated_at: string
}


export interface GetUnpaidPembayaranResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<UnpaidWarga>
}

export interface GetPaidMonthPembayaranResponse {
  code: number
  success: boolean
  message: string
  data: number[] | string[]
}

export interface NotifyUnpaidPayload {
  id_informasi_iuran: number
  month?: number
}

export interface NotifyUnpaidResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface NotifyResidentPayload {
  id_informasi_iuran: number
  nik: string
  month: number | null
  // title: string
  // message: string
}

export interface NotifyResidentResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface GetUnpaidPembayaranResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<UnpaidWarga>
}

export interface GetPaidPembayaranByWargaResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<Pembayaran>
}

export interface GetUnpaidInformasiIuranByWargaResponse {
  code: number
  success: boolean
  message: string
  data: PaginatedResponse<UnpaidWarga>
}

export interface NotifyResponse {
  code: number
  success: boolean
  message: string
  data: null
}

export interface PembayaranByRegu {
  id: number
  transaction_id: string
  nik: string
  nama_warga: string
  regu: string | null
  regu_id: number | null
  informasi_iuran: {
    id: number
    nama: string
    jenis_iuran: string
  } | null
  bulan: number[] | null
  jumlah_iuran_snapshot: number
  total_bayar: number
  tanggal_bayar: string | null
  metode_bayar: string | null
  status_bayar: string
  processed_by: string | null
  bukti_pembayaran: string | null
}

export interface GetPembayaranByReguResponse {
  data: {
    data: PembayaranByRegu[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  message: string
}

export interface GetQrisResponse {
  code: number
  success: boolean
  message: string
  data: {
    image: string,
    nama_rekening: string,
    nomor_rekening: string,
    keterangan: string,
  }
}

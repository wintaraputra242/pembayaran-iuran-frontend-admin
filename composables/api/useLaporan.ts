import type {
  GetPembayaranResponse
} from '@/types/api/pembayaran'

import { useApi } from './useApi'

export const useLaporan = () => {
  const { api } = useApi()

  const getLaporan = async (params?: {
    page?: number
    limit?: number
    jenis_iuran?: string
    metode_bayar?: string
    status_bayar?: string
    regu?: string
    nama_warga?: string
    start_date?: string
    end_date?: string
  }): Promise<GetPembayaranResponse> => {
    return await api<GetPembayaranResponse>('/laporan', {
      query: params,
    })
  }

  const exportPdfLaporan = async (params: {
    id_informasi_iuran: number
  }): Promise<Blob> => {
    return await api<Blob>('/laporan/export-pdf', {
      query: params,
      responseType: 'blob',
    })
  }

  return {
    getLaporan,
    exportPdfLaporan,
  }
}

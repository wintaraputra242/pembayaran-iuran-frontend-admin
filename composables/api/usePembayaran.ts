import type {
  AddPembayaranResponse,
  GetDetailPembayaranResponse,
  GetPaidMonthPembayaranResponse,
  GetPaidPembayaranByWargaResponse,
  GetPembayaranResponse,
  GetUnpaidPembayaranResponse,
  NotifyResidentPayload,
  NotifyResidentResponse,
  NotifyResponse,
  NotifyUnpaidPayload,
  NotifyUnpaidResponse
} from '@/types/api/pembayaran'

import { useApi } from './useApi'

export const usePembayaran = () => {
  const { api, fetchCsrf } = useApi()

  const getPembayaran = async (params?: {
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
    return await api<GetPembayaranResponse>('/pembayaran', {
      method: 'GET',
      params,
    })
  }

  const getDetailPembayaran = async (id: number): Promise<GetDetailPembayaranResponse> => {
    return await api<GetDetailPembayaranResponse>(`/pembayaran/${id}`, {
      method: 'GET',
    })
  }

  const addPembayaran = async (body: FormData): Promise<AddPembayaranResponse> => {
    await fetchCsrf()

    return await api<AddPembayaranResponse>('/pembayaran', {
      method: 'POST',
      body,
    })
  }

  const getUnpaidPembayaran = async (params: {
    id_informasi_iuran: number
    bulan?: number
    nama_warga?: string
    per_page?: number
    page?: number
  }): Promise<GetUnpaidPembayaranResponse> => {
    return await api<GetUnpaidPembayaranResponse>(
      '/pembayaran-unpaid-payment',
      {
        method: 'GET',
        params, // kirim sebagai query string
      }
    )
  }

  const getMonthPaidPembayaran = async (params: {
    id_informasi_iuran: number
    nik: string
  }): Promise<GetPaidMonthPembayaranResponse> => {
    return await api<GetPaidMonthPembayaranResponse>(
      '/pembayaran-paid-month',
      {
        method: 'GET',
        params,
      }
    )
  }

  const notifyUnpaidResidents = async (body: NotifyUnpaidPayload): Promise<NotifyUnpaidResponse> => {
    await fetchCsrf()

    return await api<NotifyUnpaidResponse>('/pembayaran-notify-unpaid', {
      method: 'POST',
      body
    })
  }

  const notifyResident = async (body: NotifyResidentPayload): Promise<NotifyResidentResponse> => {
    await fetchCsrf()

    return await api<NotifyResidentResponse>('/pembayaran-notify-resident', {
      method: 'POST',
      body,
    })
  }

  const getHistoryAlreadyPaid = async (params: {
    nik: string
    per_page?: number
    page?: number
  }): Promise<GetPaidPembayaranByWargaResponse> => {
    return await api<GetPaidPembayaranByWargaResponse>(
      '/pembayaran-history-paid',
      {
        method: 'GET',
        params,
      }
    )
  }

  const getHistoryNotYetPaid = async (params: {
    nik: string
    per_page?: number
    page?: number
  }): Promise<GetUnpaidPembayaranResponse> => {
    return await api<GetUnpaidPembayaranResponse>(
      '/pembayaran-history-unpaid',
      {
        method: 'GET',
        params,
      }
    )
  }

  const notifyResidentAllUnpaid = async (
    body: { nik: string }
  ): Promise<NotifyResponse> => {
    await fetchCsrf()

    return await api<NotifyResponse>(
      '/pembayaran-notify-resident-all-unpaid',
      {
        method: 'POST',
        body,
      }
    )
  }

  const notifyResidentUnpaidOneByOne = async (
    body: { nik: string }
  ): Promise<NotifyResponse> => {
    await fetchCsrf()

    return await api<NotifyResponse>(
      '/pembayaran-notify-resident-one-by-one',
      {
        method: 'POST',
        body,
      }
    )
  }

  return {
    getPembayaran,
    getDetailPembayaran,
    addPembayaran,
    getUnpaidPembayaran,
    getMonthPaidPembayaran,
    notifyUnpaidResidents,
    notifyResident,
    getHistoryAlreadyPaid,
    getHistoryNotYetPaid,
    notifyResidentAllUnpaid,
    notifyResidentUnpaidOneByOne,
  }
}

import type {
  AddPembayaranResponse,
  GetDetailPembayaranResponse,
  GetPaidMonthPembayaranResponse,
  GetPaidPembayaranByWargaResponse,
  GetPembayaranByReguResponse,
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
  const { api } = useApi()

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
      query: params,
    })
  }

  const getDetailPembayaran = async (id: number): Promise<GetDetailPembayaranResponse> => {
    return await api<GetDetailPembayaranResponse>(`/pembayaran/${id}`)
  }

  const addPembayaran = async (body: FormData): Promise<AddPembayaranResponse> => {
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
    return await api<GetUnpaidPembayaranResponse>('/pembayaran/unpaid', { // UBAH: /pembayaran-unpaid-payment
      query: params,
    })
  }

  const getMonthPaidPembayaran = async (params: {
    id_informasi_iuran: number
    nik: string
  }): Promise<GetPaidMonthPembayaranResponse> => {
    return await api<GetPaidMonthPembayaranResponse>('/pembayaran/paid-month', { // UBAH: /pembayaran-paid-month
      query: params,
    })
  }

  const getHistoryAlreadyPaid = async (params: {
    nik: string
    per_page?: number
    page?: number
  }): Promise<GetPaidPembayaranByWargaResponse> => {
    return await api<GetPaidPembayaranByWargaResponse>('/pembayaran/history-paid', { // UBAH: /pembayaran-history-paid
      query: params,
    })
  }

  const getHistoryNotYetPaid = async (params: {
    nik: string
    per_page?: number
    page?: number
  }): Promise<GetUnpaidPembayaranResponse> => {
    return await api<GetUnpaidPembayaranResponse>('/pembayaran/history-unpaid', { // UBAH: /pembayaran-history-unpaid
      query: params,
    })
  }

  const getUnpaidPembayaranKetuaRegu = async (params: {
    nama_warga?: string
    per_page?: number
    page?: number
  }): Promise<GetUnpaidPembayaranResponse> => {
    return await api<GetUnpaidPembayaranResponse>('/pembayaran/unpaid-by-leader', { // UBAH: /pembayaran-unpaid-payment-ketua-regu
      query: params,
    })
  }

  const getPembayaranByRegu = async (params: {
    id_informasi_iuran?: number
    id_regu?: number
    status_bayar?: string
    nama_warga?: string
    per_page?: number
    page?: number
  }): Promise<GetPembayaranByReguResponse> => {
    return await api<GetPembayaranByReguResponse>('/pembayaran/by-regu', {
      query: params,
    })
  }

  const notifyUnpaidResidents = async (body: NotifyUnpaidPayload): Promise<NotifyUnpaidResponse> => {
    return await api<NotifyUnpaidResponse>('/pembayaran/notify-unpaid', { // UBAH: /pembayaran-notify-unpaid
      method: 'POST',
      body,
    })
  }

  const notifyResident = async (body: NotifyResidentPayload): Promise<NotifyResidentResponse> => {
    return await api<NotifyResidentResponse>('/pembayaran/notify-resident', { // UBAH: /pembayaran-notify-resident
      method: 'POST',
      body,
    })
  }

  const notifyResidentAllUnpaid = async (body: { nik: string }): Promise<NotifyResponse> => {
    return await api<NotifyResponse>('/pembayaran/notify-all-unpaid', { // UBAH: /pembayaran-notify-resident-all-unpaid
      method: 'POST',
      body,
    })
  }

  const notifyResidentUnpaidOneByOne = async (body: { nik: string }): Promise<NotifyResponse> => {
    return await api<NotifyResponse>('/pembayaran/notify-one-by-one', { // UBAH: /pembayaran-notify-resident-one-by-one
      method: 'POST',
      body,
    })
  }

  return {
    getPembayaran,
    getDetailPembayaran,
    addPembayaran,
    getUnpaidPembayaran,
    getMonthPaidPembayaran,
    getHistoryAlreadyPaid,
    getHistoryNotYetPaid,
    getUnpaidPembayaranKetuaRegu,
    getPembayaranByRegu,
    notifyUnpaidResidents,
    notifyResident,
    notifyResidentAllUnpaid,
    notifyResidentUnpaidOneByOne,
  }
}

import type { CreateReguPayload, CreateReguResponse } from '@/types/api/master-regu'
import { useApi } from './useApi'

export const useMasterRegu = () => {
  const { api, fetchCsrf } = useApi()

  const createRegu = async (body: CreateReguPayload): Promise<CreateReguResponse> => {
    await fetchCsrf()

    return await api<CreateReguResponse>('/regu', {
      method: 'POST',
      body,
    })
  }

  return {
    createRegu,
  }
}

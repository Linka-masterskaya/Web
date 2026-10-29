import { apiClient } from '@shared/lib/api'

export const verifyEmailApi = async (token: string): Promise<void> => {
  await apiClient.post('auth/verify-email', { json: { token } })
}

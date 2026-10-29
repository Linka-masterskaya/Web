import { sessionApiClient } from '@shared/lib/api'

export const logoutApi = async (): Promise<void> => {
  await sessionApiClient.post('auth/logout')
}

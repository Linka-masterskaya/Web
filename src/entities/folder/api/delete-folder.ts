import { apiClient } from '@shared/lib/api'

export const deleteFolder = async (id: string): Promise<void> => {
  await apiClient.delete(`folders/${id}`)
}

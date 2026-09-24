import { apiClient } from '@shared/lib/api'

/** PUT /packs/{id}/favorite — добавить набор в избранное (идемпотентно). */
export const addSetFavorite = async (setId: string): Promise<void> => {
  await apiClient.put(`packs/${setId}/favorite`)
}

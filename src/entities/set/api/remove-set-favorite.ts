import { apiClient } from '@shared/lib/api'

/** DELETE /packs/{id}/favorite — убрать набор из избранного (идемпотентно). */
export const removeSetFavorite = async (setId: string): Promise<void> => {
  await apiClient.delete(`packs/${setId}/favorite`)
}

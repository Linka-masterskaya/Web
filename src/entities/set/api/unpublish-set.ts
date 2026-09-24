import { apiClient } from '@shared/lib/api'
import { type TUnpublishSetParams, unpublishSetParamsSchema } from '../model/publish-set.schema'

/** DELETE /packs/{id}/publication — снять публикацию, исходный набор остаётся на месте */
export const unpublishSet = async (params: TUnpublishSetParams): Promise<void> => {
  const data = unpublishSetParamsSchema.parse(params)

  await apiClient.delete(`packs/${data.setId}/publication`)
}

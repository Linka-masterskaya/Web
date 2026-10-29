import { apiClient } from '@shared/lib/api'

import { moveSetParamsSchema, type TMoveSetParams } from '../model/move-set.schema'

export const moveSet = async (params: TMoveSetParams) => {
  const { setId, folderId } = moveSetParamsSchema.parse(params)

  return apiClient
    .post(`packs/${setId}/move`, {
      json: {
        folder_id: folderId,
      },
    })
    .json()
}

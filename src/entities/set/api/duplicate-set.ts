import { apiClient } from '@shared/lib/api'
import { duplicateSetParamsSchema, type TDuplicateSetParams } from '../model/duplicate-set.schema'
import { setSchema, type TSet } from '../model/set.schema'

export const duplicateSet = async (params: TDuplicateSetParams): Promise<TSet> => {
  const data = duplicateSetParamsSchema.parse(params)

  return apiClient
    .post(`packs/${data.setId}/duplicate`, {
      ...(data.folderId ? { json: { folder_id: data.folderId } } : {}),
    })
    .json(setSchema)
}

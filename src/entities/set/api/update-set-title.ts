import { apiClient } from '@shared/lib/api'
import { setSchema, type TSet } from '../model/set.schema'
import {
  type TUpdateSetTitleParams,
  updateSetTitleParamsSchema,
} from '../model/update-set-title.schema'

/** PATCH /packs/{id} — изменить название набора. */
export const updateSetTitle = async (params: TUpdateSetTitleParams): Promise<TSet> => {
  const data = updateSetTitleParamsSchema.parse(params)

  return apiClient
    .patch(`packs/${data.setId}`, {
      json: { title: data.title },
    })
    .json(setSchema)
}

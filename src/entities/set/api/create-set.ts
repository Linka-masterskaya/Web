import { apiClient } from '@shared/lib/api'
import {
  createSetParamsSchema,
  createSetResponseSchema,
  type TCreateSetParams,
  type TCreateSetResponse,
} from '../model/create-set.schema'

/** POST /packs — создать пустой набор (черновик) с названием. */
export const createSet = async (params: TCreateSetParams): Promise<TCreateSetResponse> => {
  const data = createSetParamsSchema.parse(params)

  return apiClient
    .post('packs', {
      json: {
        title: data.title,
        folder_id: data.folderId,
      },
    })
    .json(createSetResponseSchema)
}

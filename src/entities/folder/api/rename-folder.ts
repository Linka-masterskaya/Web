import { apiClient } from '@shared/lib/api'
import {
  renameFolderParamsSchema,
  renameFolderResponseSchema,
  type TRenameFolderParams,
  type TRenameFolderResponse,
} from '../model/rename-folder.schema'

/** PATCH /folders/{id} — переименовать папку. */
export const renameFolder = async (params: TRenameFolderParams): Promise<TRenameFolderResponse> => {
  const data = renameFolderParamsSchema.parse(params)

  return apiClient
    .patch(`folders/${data.id}`, {
      json: {
        name: data.name,
      },
    })
    .json(renameFolderResponseSchema)
}

import { apiClient } from '@shared/lib/api'
import { publishSetParamsSchema, type TPublishSetParams } from '../model/publish-set.schema'
import { setSchema, type TSet } from '../model/set.schema'

/** POST /packs/{id}/publication — публикация набора ссылкой в папку Библиотеки */
export const publishSet = async (params: TPublishSetParams): Promise<TSet> => {
  const data = publishSetParamsSchema.parse(params)

  return apiClient
    .post(`packs/${data.setId}/publication`, {
      json: { library_folder_id: data.libraryFolderId },
    })
    .json(setSchema)
}

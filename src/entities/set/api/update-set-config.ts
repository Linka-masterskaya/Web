import { apiClient } from '@shared/lib/api'
import { setSchema, type TSet } from '../model/set.schema'
import type { TSetConfig } from '../model/set-config.schema'
import { setConfigPayloadSchema } from '../model/set-config-payload.schema'

/** PUT /packs/{id}/config — полностью сохранить Linka Config 2.0. */
export const updateSetConfig = async (setId: string, config: TSetConfig): Promise<TSet> => {
  const payload = setConfigPayloadSchema.parse(config)

  return apiClient.put(`packs/${setId}/config`, { json: payload }).json(setSchema)
}

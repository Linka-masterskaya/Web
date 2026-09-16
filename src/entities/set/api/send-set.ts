import { apiClient } from '@shared/lib/api'
import {
  sendSetParamsSchema,
  sendSetResponseSchema,
  type TSendSetParams,
  type TSendSetResponse,
} from '../model/send-set.schema'

export const sendSet = async (params: TSendSetParams): Promise<TSendSetResponse> => {
  const data = sendSetParamsSchema.parse(params)

  return apiClient
    .post(`packs/${data.setId}/share`, {
      json: {
        target_type: 'student',
        target_id: data.targetId,
      },
    })
    .json(sendSetResponseSchema)
}

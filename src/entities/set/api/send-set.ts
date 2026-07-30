import {
  sendSetParamsSchema,
  sendSetResponseSchema,
  type TSendSetParams,
  type TSendSetResponse,
} from '../model/send-set.schema'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const sendSet = async (params: TSendSetParams): Promise<TSendSetResponse> => {
  const payload = sendSetParamsSchema.parse(params)

  await delay(300)

  return sendSetResponseSchema.parse(payload)
}

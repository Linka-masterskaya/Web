import { setResponseSchema, type TSetResponse } from '../model/set.schema'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getSet = async (id: string): Promise<TSetResponse> => {
  await delay(300)

  return setResponseSchema.parse({ id })
}

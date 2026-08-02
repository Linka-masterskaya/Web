import { moveSetParamsSchema, type TMoveSetParams } from '../model/move-set.schema'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const moveSet = async (params: TMoveSetParams): Promise<void> => {
  moveSetParamsSchema.parse(params)

  await delay(300)
}

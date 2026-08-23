import { createSetParamsSchema, type TCreateSetParams } from '../model/create-set.schema'
import type { TSet } from '../model/set.schema'

export const createSet = async (params: TCreateSetParams): Promise<TSet> => {
  const data = createSetParamsSchema.parse(params)
  const id = `set-${crypto.randomUUID()}`

  // biome-ignore lint/suspicious/noConsole: debug only
  console.log('[API] createSet', {
    id,
    title: data.title,
    folderId: data.folderId ?? null,
  })

  return {
    id,
    folderId: data.folderId ?? null,
  }
}

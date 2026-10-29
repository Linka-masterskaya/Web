import { apiClient } from '@shared/lib/api'
import { setSchema, type TSet } from '../model/set.schema'

/** GET /packs/{id} — набор с config (страницы = blocks). */
export const getSet = async (id: string): Promise<TSet> =>
  apiClient.get(`packs/${id}`).json(setSchema)

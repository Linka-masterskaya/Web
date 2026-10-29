import { apiClient } from '@shared/lib/api'
import { deleteSetSchema, type TDeleteSetParams } from '../model/delete-set.schema'

export const deleteSet = async (params: TDeleteSetParams): Promise<void> => {
  const data = deleteSetSchema.parse(params)

  await apiClient.delete(`packs/${data.setId}`)
}

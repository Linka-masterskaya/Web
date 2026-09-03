import { apiClient } from '@shared/lib/api'
import { setSchema, type TSet } from '../model/set.schema'
import { type TUpdateSetParams, updateSetParamsSchema } from '../model/update-set.schema'

// PATCH /packs/:id — сохраняет настройки созданного набора.
// Вызывается после создания набора через POST /packs.
export const updateSet = async (params: TUpdateSetParams): Promise<TSet> => {
  const data = updateSetParamsSchema.parse(params)

  return apiClient
    .patch(`packs/${data.id}`, {
      json: {
        title: data.title,
        folder_id: data.folderId,
        age: data.age,
        difficulty: data.difficulty,
        goals: data.goals,
        notes: data.notes,
      },
    })
    .json(setSchema)
}

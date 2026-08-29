import { resizeSetPageStructure } from '../lib/set-page-structure'
import type { TSet } from '../model/set.schema'
import {
  type TUpdateSetPageStructureParams,
  updateSetPageStructureParamsSchema,
} from '../model/update-set-page-structure.schema'
import { getSet } from './get-set'
import { updateSetConfig } from './update-set-config'

export const updateSetPageStructure = async (
  setId: string,
  params: TUpdateSetPageStructureParams,
): Promise<TSet> => {
  const data = updateSetPageStructureParamsSchema.parse(params)
  const set = await getSet(setId)
  const pageIndex = set.config.blocks.findIndex((page) => page.id === data.pageId)

  if (pageIndex === -1) {
    throw new Error('Страница не найдена в наборе')
  }

  const nextBlocks = [...set.config.blocks]
  nextBlocks[pageIndex] = resizeSetPageStructure(
    nextBlocks[pageIndex],
    data.primaryCount,
    data.secondaryCount,
  )

  return updateSetConfig(setId, { ...set.config, blocks: nextBlocks })
}

import { createEmptySetPage } from '../lib/create-empty-set-page'
import type { TSet } from '../model/set.schema'
import type { TSetPageType } from '../model/set-config.schema'
import { getSet } from './get-set'
import { updateSetConfig } from './update-set-config'

/** Изменить тип существующей страницы (block) в config набора. */
export const updateSetPageType = async (
  setId: string,
  pageId: string,
  type: TSetPageType,
): Promise<TSet> => {
  const set = await getSet(setId)
  const pageIndex = set.config.blocks.findIndex((block) => block.id === pageId)

  if (pageIndex === -1) {
    throw new Error('Страница не найдена в наборе')
  }

  const currentPage = set.config.blocks[pageIndex]

  if (currentPage.type === type) {
    return set
  }

  const nextBlocks = [...set.config.blocks]
  nextBlocks[pageIndex] = createEmptySetPage(type, pageId)

  return updateSetConfig(setId, {
    ...set.config,
    blocks: nextBlocks,
  })
}

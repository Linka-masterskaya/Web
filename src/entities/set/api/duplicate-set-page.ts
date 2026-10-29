import { cloneSetPage } from '../lib/clone-set-page'
import type { TSet } from '../model/set.schema'
import { getSet } from './get-set'
import { updateSetConfig } from './update-set-config'

/** Дублирует страницу набора: копия с новыми id встаёт сразу после оригинала. */
export const duplicateSetPage = async (setId: string, pageId: string): Promise<TSet> => {
  const set = await getSet(setId)
  const pageIndex = set.config.blocks.findIndex((block) => block.id === pageId)

  if (pageIndex === -1) {
    throw new Error('Страница не найдена в наборе')
  }

  const nextBlocks = [...set.config.blocks]
  nextBlocks.splice(pageIndex + 1, 0, cloneSetPage(nextBlocks[pageIndex]))

  return updateSetConfig(setId, { ...set.config, blocks: nextBlocks })
}

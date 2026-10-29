import type { TSet } from '../model/set.schema'
import { getSet } from './get-set'
import { updateSetConfig } from './update-set-config'

/** Удаляет страницу (block) из config набора. */
export const deleteSetPage = async (setId: string, pageId: string): Promise<TSet> => {
  const set = await getSet(setId)
  const nextBlocks = set.config.blocks.filter((block) => block.id !== pageId)

  if (nextBlocks.length === set.config.blocks.length) {
    return set
  }

  return updateSetConfig(setId, { ...set.config, blocks: nextBlocks })
}

import type { TSetConfig } from '../model/set-config.schema'
import type { TSetPageType } from '../model/set-config.schema'
import { createEmptySetPage } from '../lib/create-empty-set-page'
import { getSet } from './get-set'
import { updateSetConfig } from './update-set-config'
import type { TSet } from '../model/set.schema'

/** Добавить страницу (block) в config набора. */
export const createSetPage = async (setId: string, type: TSetPageType): Promise<TSet> => {
  const set = await getSet(setId)

  const nextConfig: TSetConfig = {
    ...set.config,
    blocks: [...set.config.blocks, createEmptySetPage(type)],
  }

  return updateSetConfig(setId, nextConfig)
}

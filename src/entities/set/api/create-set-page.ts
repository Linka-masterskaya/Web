import { createEmptySetPage } from '../lib/create-empty-set-page'
import type { TSet } from '../model/set.schema'
import type { TSetConfig, TSetPageType } from '../model/set-config.schema'
import { getSet } from './get-set'
import { updateSetConfig } from './update-set-config'

/** Добавить страницу (block) в config набора. */
export const createSetPage = async (setId: string, type: TSetPageType): Promise<TSet> => {
  const set = await getSet(setId)

  const nextConfig: TSetConfig = {
    ...set.config,
    blocks: [...set.config.blocks, createEmptySetPage(type)],
  }

  return updateSetConfig(setId, nextConfig)
}

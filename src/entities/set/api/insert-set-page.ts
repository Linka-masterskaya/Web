import {
  insertSetPageParamsSchema,
  type TInsertSetPageParams,
} from '../model/insert-set-page.schema'
import type { TSet } from '../model/set.schema'
import type { TSetPage } from '../model/set-config.schema'
import { getSet } from './get-set'
import { updateSetConfig } from './update-set-config'

/** Порядок блоков сравнивается по ссылкам: массив новый, но элементы те же. */
const isSameBlockOrder = (current: TSetPage[], next: TSetPage[]) =>
  current.length === next.length && current.every((block, index) => block === next[index])

/**
 * Вставляет страницу в config набора — операция «Вставить» из буфера обмена.
 *
 * Вставка и удаление выполняются одним PUT: при перемещении страницы внутри набора
 * нельзя удалять оригинал отдельным запросом, иначе позиция вставки сдвинется.
 */
export const insertSetPage = async (setId: string, params: TInsertSetPageParams): Promise<TSet> => {
  const data = insertSetPageParamsSchema.parse(params)
  const set = await getSet(setId)
  const blocks = set.config.blocks.filter((block) => block.id !== data.removePageId)
  const afterIndex =
    data.afterPageId === null ? -1 : blocks.findIndex((block) => block.id === data.afterPageId)
  const insertIndex = afterIndex === -1 ? blocks.length : afterIndex + 1
  const nextBlocks = [...blocks.slice(0, insertIndex), data.page, ...blocks.slice(insertIndex)]

  if (isSameBlockOrder(set.config.blocks, nextBlocks)) {
    return set
  }

  return updateSetConfig(setId, { ...set.config, blocks: nextBlocks })
}

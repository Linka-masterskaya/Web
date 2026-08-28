import { env } from '@shared/lib/env'

import type {
  TGetSectionContentsParams,
  TSectionContentsResponse,
} from '../model/content-item.schema'

import { getSectionContentsMock } from './get-section-contents.mock'

import { getSectionContentsRemote } from './get-section-contents.remote'

/**
 * Выбирает источник данных.
 *
 * В режиме моков HTTP-запрос вообще не выполняется.
 * В обычном режиме используется настоящий бэкенд.
 */
export const getSectionContents = (
  params: TGetSectionContentsParams,
): Promise<TSectionContentsResponse> => {
  if (env.useSectionContentMock()) {
    // biome-ignore lint/suspicious/noConsole: логируем падение в dev для отладки
    console.debug('[section contents] mock', params)

    return getSectionContentsMock(params)
  }
  // biome-ignore lint/suspicious/noConsole: логируем падение в dev для отладки
  console.debug('[section contents] remote', params)

  return getSectionContentsRemote(params)
}

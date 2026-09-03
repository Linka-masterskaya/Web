import { HTTPError } from 'ky'
import { useCallback, useEffect, useState } from 'react'
import { getSectionContents } from '../api/get-section-content'
import type {
  TSection,
  TSectionContentItem,
  TSectionContentOrder,
  TSectionContentResponse,
  TSectionContentSort,
} from './types'

type TUseSectionContentsParams = {
  section: TSection
  parentId?: string
  sort?: TSectionContentSort
  order?: TSectionContentOrder
  limit?: number
  offset?: number
}

type TSectionContentsState = {
  data: TSectionContentResponse | null
  isLoading: boolean
  error: Error | null
}

const EMPTY_ITEMS: TSectionContentItem[] = []

const initalState: TSectionContentsState = {
  data: null,
  isLoading: true,
  error: null,
}

// преобразование номера ошибки в сообщение для интерфейса
const normalizeSectionContentsError = (error: unknown): Error => {
  if (error instanceof HTTPError) {
    switch (error.response.status) {
      case 400:
        return new Error('Переданы некорректные параметры запроса')

      case 401:
        return new Error('Не удалось подтвердить авторизацию')

      case 403:
        return new Error('У вас нет доступа к этой папке')

      case 404:
        return new Error('Папка не найдена или недоступна')

      default:
        return new Error(`Не удалось загрузить содержимое. Код ошибки: ${error.response.status}`)
    }
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Не удалось загрузить содержимое папки')
}

/**
 * Загрузка содержимого текущего раздела или папки
 *
 * При изменеии section или parentId автоматически делает новый запрос
 * Предыдущий запрос отменяется через AbortController, чтобы
 * его запоздалый ответ не перезаписал содержимое открытой папки
 */

export const useSectionContents = ({
  section,
  parentId,
  sort = 'name',
  order = 'asc',
  limit = 50,
  offset = 0,
}: TUseSectionContentsParams) => {
  const [state, setState] = useState<TSectionContentsState>(initalState)

  // изменение версии запускает запрос повторно
  const [reloadVersion, setReloadVersion] = useState(0)

  useEffect(() => {
    // reloadVersion намеренно в deps: refetch() инкрементирует версию и перезапускает эффект
    void reloadVersion

    const controller = new AbortController()

    setState({
      data: null,
      isLoading: true,
      error: null,
    })

    void getSectionContents({
      section,
      parentId,
      sort,
      order,
      limit,
      offset,
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          data,
          isLoading: false,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          data: null,
          isLoading: false,
          error: normalizeSectionContentsError(error),
        })
      })

    return () => {
      controller.abort()
    }
  }, [section, parentId, sort, order, limit, offset, reloadVersion])

  // для принудительного повторения запроса текущей папки
  const refetch = useCallback(() => {
    setReloadVersion((currentVersion) => currentVersion + 1)
  }, [])

  return {
    items: state.data?.items ?? EMPTY_ITEMS,
    response: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch,
  }
}

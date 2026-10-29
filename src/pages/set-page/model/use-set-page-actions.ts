import {
  cloneSetPage,
  deleteSetPage,
  getSetPageTitle,
  setQueryKeys,
  type TSetPage,
  useDeleteSetPage,
  useDuplicateSetPage,
  useInsertSetPage,
} from '@entities/set'
import { useConfirmDelete } from '@features/confirm-delete'
import { getApiErrorMessage } from '@shared/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useSetPagesClipboardStore } from './set-pages-clipboard.store'

type TUseSetPageActionsParams = {
  setId: string
  pages: readonly TSetPage[]
}

/** Действия контекстного меню страниц набора. */
export const useSetPageActions = ({ setId, pages }: TUseSetPageActionsParams) => {
  const queryClient = useQueryClient()
  const clipboard = useSetPagesClipboardStore((state) => state.clipboard)
  const copyPageToClipboard = useSetPagesClipboardStore((state) => state.copy)
  const cutPageToClipboard = useSetPagesClipboardStore((state) => state.cut)
  const clearClipboard = useSetPagesClipboardStore((state) => state.clear)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const duplicatePageMutation = useDuplicateSetPage(setId)
  const deletePageMutation = useDeleteSetPage(setId)
  const insertPageMutation = useInsertSetPage(setId)
  const confirmDelete = useConfirmDelete()

  const pageTitles = useMemo(() => {
    const titles = new Map<string, string>()

    pages.forEach((page, index) => {
      titles.set(page.id, getSetPageTitle(page, index))
    })

    return titles
  }, [pages])

  const runAction = useCallback(async (action: () => Promise<unknown>) => {
    try {
      setErrorMessage(null)
      await action()
    } catch (error) {
      setErrorMessage(await getApiErrorMessage(error))
    }
  }, [])

  const copyPage = useCallback(
    (page: TSetPage) => {
      copyPageToClipboard(setId, page)
    },
    [copyPageToClipboard, setId],
  )

  const cutPage = useCallback(
    (page: TSetPage) => {
      cutPageToClipboard(setId, page)
    },
    [cutPageToClipboard, setId],
  )

  const duplicatePage = useCallback(
    (page: TSetPage) => {
      void runAction(() => duplicatePageMutation.mutateAsync(page.id))
    },
    [duplicatePageMutation, runAction],
  )

  const deletePage = useCallback(
    (page: TSetPage) => {
      confirmDelete({
        title: `Удалить страницу «${pageTitles.get(page.id) ?? 'Страница'}»?`,
        description: 'Вы уверены?',
        onConfirm: () => runAction(() => deletePageMutation.mutateAsync(page.id)),
      })
    },
    [confirmDelete, deletePageMutation, pageTitles, runAction],
  )

  /**
   * Вставляет страницу из буфера обмена.
   *
   * `targetPage === null` — вставка в конец набора (правый клик по пустому месту
   * области карточек). Внутри одного набора «вырезать → вставить» — это перемещение:
   * страница уезжает вместе со своим id, поэтому адрес в редакторе не меняется.
   * Между наборами вставляется копия с новыми id, а оригинал удаляется из источника.
   *
   * Вырезание «расходуется» самой вставкой: подсветку снимаем сразу, не дожидаясь
   * ответа сервера, иначе она залипает при ошибке запроса или при вставке в конец.
   */
  const pastePage = useCallback(
    (targetPage: TSetPage | null) => {
      if (!clipboard) {
        return
      }

      const { mode, page: sourcePage, sourceSetId } = clipboard
      const isSameSet = sourceSetId === setId
      const shouldMove = mode === 'cut' && isSameSet
      // Вставка вырезанной страницы на своё же место ничего не делает.
      const isNoop = shouldMove && targetPage?.id === sourcePage.id

      if (mode === 'cut') {
        clearClipboard()
      }

      if (isNoop) {
        return
      }

      void runAction(async () => {
        await insertPageMutation.mutateAsync({
          page: shouldMove ? sourcePage : cloneSetPage(sourcePage),
          afterPageId: targetPage?.id ?? null,
          ...(shouldMove ? { removePageId: sourcePage.id } : {}),
        })

        if (mode === 'cut' && !isSameSet) {
          await deleteSetPage(sourceSetId, sourcePage.id)
          await queryClient.invalidateQueries({ queryKey: setQueryKeys.detail(sourceSetId) })
        }
      })
    },
    [clearClipboard, clipboard, insertPageMutation, queryClient, runAction, setId],
  )

  return {
    clipboard,
    errorMessage,
    isPending:
      duplicatePageMutation.isPending ||
      deletePageMutation.isPending ||
      insertPageMutation.isPending,
    copyPage,
    cutPage,
    duplicatePage,
    deletePage,
    pastePage,
  }
}

import {
  getSetPageStructure,
  readSetPagePairs,
  setPageTypeSchema,
  useSaveSetEditor,
  useSet,
  useSetAccess,
  useSetEditorStore,
} from '@entities/set'
import { useConfirmDelete } from '@features/confirm-delete'
import { createSetSectionQuery, createUrl, routerPath } from '@shared/lib/routes'
import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { z } from 'zod'

const idSchema = z.string().uuid()

/** Одна навигация на /subset/new → одна страница (в т.ч. при Strict Mode). */
const seededPageByLocationKey = new Map<string, string>()

export const useSetEditor = () => {
  const confirmDelete = useConfirmDelete()
  const navigate = useNavigate()
  const location = useLocation()
  const isSubsetNew = /\/subset\/new\/?$/.test(location.pathname)
  const { setId, subsetId } = useParams()
  const parsedSetId = idSchema.safeParse(setId)
  const parsedSubsetId = subsetId == null ? null : idSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setQuery = useSet(resolvedSetId)
  const { canEditSet, backUrl, isAccessResolved, section } = useSetAccess(setQuery.data?.folderId)
  const sectionQuery = createSetSectionQuery(section)
  const editor = useSetEditorStore()
  const save = useSaveSetEditor(resolvedSetId)
  const initialize = editor.initialize
  const seededPageId = seededPageByLocationKey.get(location.key)

  useEffect(() => {
    if (!isAccessResolved || canEditSet || !parsedSetId.success) {
      return
    }

    if (parsedSubsetId?.success) {
      navigate(
        createUrl(
          routerPath.dashboardSubsetId,
          {
            setId: resolvedSetId,
            subsetId: parsedSubsetId.data,
          },
          createSetSectionQuery(section),
        ),
        { replace: true, state: location.state },
      )
      return
    }

    navigate(
      createUrl(
        routerPath.dashboardSetId,
        { setId: resolvedSetId },
        createSetSectionQuery(section),
      ),
      {
        replace: true,
        state: location.state,
      },
    )
  }, [
    canEditSet,
    isAccessResolved,
    location.state,
    navigate,
    parsedSetId.success,
    parsedSubsetId,
    resolvedSetId,
    section,
  ])

  useEffect(() => {
    if (setQuery.data && !isSubsetNew) {
      initialize(setQuery.data)
    }
  }, [setQuery.data, initialize, isSubsetNew])

  useLayoutEffect(() => {
    if (!isSubsetNew || !parsedSetId.success || !setQuery.data || !canEditSet) {
      return
    }

    const state = useSetEditorStore.getState()
    if (state.setId !== resolvedSetId || !state.config) {
      initialize(setQuery.data)
    }

    let pageId = seededPageByLocationKey.get(location.key)
    if (!pageId) {
      pageId = useSetEditorStore.getState().addPage('grid') ?? undefined
      if (!pageId) {
        return
      }
      seededPageByLocationKey.set(location.key, pageId)
    }

    navigate(
      createUrl(
        routerPath.dashboardSubsetIdEdit,
        {
          setId: resolvedSetId,
          subsetId: pageId,
        },
        createSetSectionQuery(section),
      ),
      { replace: true, state: location.state },
    )
  }, [
    canEditSet,
    initialize,
    isSubsetNew,
    location.key,
    location.state,
    navigate,
    parsedSetId.success,
    resolvedSetId,
    section,
    setQuery.data,
  ])

  useEffect(() => {
    if (
      editor.setId !== resolvedSetId ||
      editor.revision === editor.savedRevision ||
      editor.saveError
    ) {
      return
    }
    const timer = window.setTimeout(() => {
      void save()
    }, 500)
    return () => window.clearTimeout(timer)
  }, [editor.setId, editor.revision, editor.savedRevision, editor.saveError, resolvedSetId, save])

  const config = editor.setId === resolvedSetId ? editor.config : setQuery.data?.config
  const pages = config?.blocks ?? []
  const activePage = parsedSubsetId?.success
    ? pages.find((page) => page.id === parsedSubsetId.data)
    : isSubsetNew && seededPageId
      ? pages.find((page) => page.id === seededPageId)
      : isSubsetNew
        ? undefined
        : pages[0]
  const activePageIndex = activePage ? pages.findIndex((page) => page.id === activePage.id) : -1
  const configuredRows =
    activePage?.layout?.rows ??
    (typeof activePage?.rows === 'number' ? activePage.rows : (config?.settings.rows ?? 3))
  const columns =
    activePage?.layout?.columns ??
    (typeof activePage?.columns === 'number' ? activePage.columns : (config?.settings.columns ?? 3))
  // Старые конфиги могли хранить больше карточек, чем вмещает сетка.
  // Показываем их все, чтобы увеличение размера не удаляло скрытые данные.
  const rows =
    activePage?.type === 'grid'
      ? Math.max(configuredRows, Math.ceil(activePage.elements.length / columns))
      : configuredRows

  const selectedCard = (
    activePage?.type === 'grid'
      ? activePage.elements.slice(0, rows * columns)
      : (activePage?.elements ?? [])
  ).find((card) => card.id === editor.selectedCardId)

  const pageStructure = activePage ? getSetPageStructure(activePage) : null
  const handleExit = async () => {
    if (!(await save())) {
      return
    }
    navigate(
      parsedSetId.success
        ? createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }, sectionQuery)
        : backUrl,
      { state: location.state },
    )
  }

  const handleBackToSets = () => navigate(backUrl)
  const handleCreatePage = async () => {
    if (parsedSetId.success && (await save())) {
      navigate(createUrl(routerPath.dashboardSubsetNew, { setId: resolvedSetId }, sectionQuery), {
        state: location.state,
      })
    }
  }

  const handleOpenPreview = async () => {
    if (!parsedSetId.success || !activePage) {
      return
    }
    if (!(await save())) {
      return
    }
    navigate(
      createUrl(
        routerPath.dashboardSubsetId,
        {
          setId: resolvedSetId,
          subsetId: activePage.id,
        },
        sectionQuery,
      ),
      { state: location.state },
    )
  }

  const handleTypeChange = (value: string) => {
    const type = setPageTypeSchema.safeParse(value)
    if (activePage && type.success && type.data !== activePage.type) {
      editor.changeType(activePage.id, type.data)
    }
  }
  const handleStructureChange = (rows: number, columns = 3) => {
    if (activePage) {
      const apply = () => editor.resizeGrid(activePage.id, rows, columns)
      const removed = activePage.elements.length - rows * columns
      if (removed > 0) {
        confirmDelete({
          title: 'Уменьшить сетку?',
          description: `Сетка станет ${rows} × ${columns}. Количество карточек, которые будут удалены с конца: ${removed}. Их содержимое не восстановится при увеличении сетки.`,
          onConfirm: apply,
        })
      } else {
        apply()
      }
    }
  }

  const handlePageStructureChange = (primaryCount: number, secondaryCount?: number) => {
    if (!activePage || !pageStructure) {
      return
    }
    if (primaryCount < pageStructure.primaryMin || primaryCount > pageStructure.primaryMax) {
      return
    }
    const nextSecondary = secondaryCount ?? pageStructure.secondaryCount
    if (
      nextSecondary == null ||
      nextSecondary < (pageStructure.secondaryMin ?? 1) ||
      nextSecondary > (pageStructure.secondaryMax ?? nextSecondary)
    ) {
      return
    }
    const nextElementCount =
      activePage.type === 'categories'
        ? primaryCount * ((nextSecondary ?? 0) + 1)
        : primaryCount * (nextSecondary ?? 1)
    const apply = () => editor.resizeStructure(activePage.id, primaryCount, nextSecondary)
    const removed = activePage.elements.length - nextElementCount
    if (removed > 0) {
      confirmDelete({
        title: 'Уменьшить структуру?',
        description: `Количество карточек, которые будут удалены: ${removed}. Их содержимое не восстановится при увеличении.`,
        onConfirm: apply,
      })
    } else {
      apply()
    }
  }

  const handleMatchingCountChange = (count: number) => {
    if (activePage?.type !== 'matching') {
      return
    }

    const currentCount = readSetPagePairs(activePage).length
    const apply = () => editor.resizeMatching(activePage.id, count)

    if (count < currentCount) {
      confirmDelete({
        title: 'Уменьшить количество пар?',
        description:
          'Последняя пара будет удалена. Её содержимое не восстановится при увеличении количества пар.',
        onConfirm: apply,
      })
    } else {
      apply()
    }
  }

  const handleOptionsChange = (count: number) => {
    if (!activePage) {
      return
    }
    const apply = () => editor.resizeOptions(activePage.id, count)
    const removed = activePage.elements.length - count
    if (removed > 0) {
      confirmDelete({
        title: 'Уменьшить количество карточек?',
        description: `Будут удалены последние карточки: ${removed}. Их содержимое не восстановится при увеличении количества.`,
        onConfirm: apply,
      })
    } else {
      apply()
    }
  }
  const handlePageChange = (index: number) => {
    const page = pages[index - 1]
    if (page) {
      editor.selectCard(null)
      navigate(
        createUrl(routerPath.dashboardSubsetIdEdit, {
          setId: resolvedSetId,
          subsetId: page.id,
        }),
      )
    }
  }

  return {
    activePage,
    activePageIndex,
    handleBackToSets,
    handleCreatePage,
    handleExit,
    handleOpenPreview,
    handleStructureChange,
    handleOptionsChange,
    handlePageStructureChange,
    handleMatchingCountChange,
    handleTypeChange,
    handlePageChange,
    rows,
    columns,
    selectedCard,
    pageStructure,
    editor,
    save,
    pages,
    hasInvalidRoute: !parsedSetId.success || parsedSubsetId?.success === false,
    hasMissingPage: parsedSubsetId?.success === true && !activePage,
    isCreatingPage: isSubsetNew && !activePage,
    isSaving: editor.isSaving,
    resolvedSetId,
    selectedType: activePage?.type,
    setQuery,
  }
}

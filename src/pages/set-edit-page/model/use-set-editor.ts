import { setPageTypeSchema, useSaveSetEditor, useSet, useSetEditorStore } from '@entities/set'
import { useConfirmDelete } from '@features/confirm-delete'
import { createDashboardSetsUrl, createUrl, routerPath } from '@shared/lib/routes'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

const idSchema = z.string().uuid()

export const useSetEditor = () => {
  const confirmDelete = useConfirmDelete()
  const navigate = useNavigate()
  const { setId, subsetId } = useParams()
  const parsedSetId = idSchema.safeParse(setId)
  const parsedSubsetId = subsetId == null ? null : idSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setQuery = useSet(resolvedSetId)
  const editor = useSetEditorStore()
  const save = useSaveSetEditor(resolvedSetId)
  const initialize = editor.initialize

  useEffect(() => {
    if (setQuery.data) {
      initialize(setQuery.data)
    }
  }, [setQuery.data, initialize])

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

  const selectedCard =
    activePage?.type === 'grid'
      ? activePage.elements
          .slice(0, rows * columns)
          .find((card) => card.id === editor.selectedCardId)
      : activePage?.elements.find((card) => card.id === editor.selectedCardId)

  const handleExit = async () => {
    if (!(await save())) {
      return
    }
    navigate(
      parsedSetId.success
        ? createUrl(routerPath.dashboardSetId, { setId: resolvedSetId })
        : createDashboardSetsUrl(setQuery.data?.folderId),
    )
  }

  const handleBackToSets = () => navigate(createDashboardSetsUrl(setQuery.data?.folderId))
  const handleCreatePage = async () => {
    if (parsedSetId.success && (await save())) {
      navigate(createUrl(routerPath.dashboardSubsetNew, { setId: resolvedSetId }))
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
      createUrl(routerPath.dashboardSubsetId, {
        setId: resolvedSetId,
        subsetId: activePage.id,
      }),
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

  const handleMatchingCountChange = (count: number) => {
    if (activePage?.type === 'matching') {
      editor.resizeMatching(activePage.id, count)
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
    handleMatchingCountChange,
    handleTypeChange,
    handlePageChange,
    rows,
    columns,
    selectedCard,
    editor,
    save,
    pages,
    hasInvalidRoute: !parsedSetId.success || parsedSubsetId?.success === false,
    hasMissingPage: parsedSubsetId?.success === true && !activePage,
    isSaving: editor.isSaving,
    resolvedSetId,
    selectedType: activePage?.type,
    setQuery,
  }
}

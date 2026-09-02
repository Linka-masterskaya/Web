import {
  setPageTypeSchema,
  type TSetPageType,
  useSet,
  useUpdateSetPageStructure,
  useUpdateSetPageType,
} from '@entities/set'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

const idSchema = z.string().uuid()

export const useSetEditor = () => {
  const navigate = useNavigate()
  const { setId, subsetId } = useParams()
  const parsedSetId = idSchema.safeParse(setId)
  const parsedSubsetId = subsetId == null ? null : idSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setQuery = useSet(resolvedSetId)
  const updatePageTypeMutation = useUpdateSetPageType(resolvedSetId)
  const updatePageStructureMutation = useUpdateSetPageStructure(resolvedSetId)
  const [typeDraft, setTypeDraft] = useState<{ pageId: string; type: TSetPageType } | null>(null)
  const [structureDraft, setStructureDraft] = useState<{
    pageId: string
    primaryCount: number
    secondaryCount?: number
  } | null>(null)

  const pages = setQuery.data?.pages ?? []
  const activePage = parsedSubsetId?.success
    ? pages.find((page) => page.id === parsedSubsetId.data)
    : pages[0]
  const activePageIndex = activePage ? pages.findIndex((page) => page.id === activePage.id) : -1
  const selectedType =
    activePage && typeDraft?.pageId === activePage.id ? typeDraft.type : activePage?.type
  const activeStructureDraft =
    activePage && structureDraft?.pageId === activePage.id ? structureDraft : null
  const isSaving = updatePageTypeMutation.isPending || updatePageStructureMutation.isPending

  const handleExit = () => {
    navigate(
      parsedSetId.success
        ? createUrl(routerPath.dashboardSetId, { setId: resolvedSetId })
        : createUrl(routerPath.dashboardSets),
    )
  }

  const handleBackToSets = () => {
    navigate(createUrl(routerPath.dashboardSets))
  }

  const handleCreatePage = () => {
    if (parsedSetId.success) {
      navigate(createUrl(routerPath.dashboardSubsetNew, { setId: resolvedSetId }))
    }
  }

  const handleTypeChange = (nextValue: string) => {
    const parsedNextType = setPageTypeSchema.safeParse(nextValue)

    if (
      !activePage ||
      !parsedNextType.success ||
      parsedNextType.data === activePage.type ||
      isSaving
    ) {
      return
    }

    setTypeDraft({ pageId: activePage.id, type: parsedNextType.data })
    updatePageTypeMutation.reset()
    updatePageTypeMutation.mutate(
      { pageId: activePage.id, type: parsedNextType.data },
      {
        onError: () => setTypeDraft(null),
        onSuccess: () => setTypeDraft(null),
      },
    )
  }

  const handleStructureChange = (primaryCount: number, secondaryCount?: number) => {
    if (!activePage || isSaving) {
      return
    }

    setStructureDraft({ pageId: activePage.id, primaryCount, secondaryCount })
    updatePageStructureMutation.reset()
    updatePageStructureMutation.mutate(
      { pageId: activePage.id, primaryCount, secondaryCount },
      {
        onError: () => setStructureDraft(null),
        onSuccess: () => setStructureDraft(null),
      },
    )
  }

  return {
    activePage,
    activePageIndex,
    activeStructureDraft,
    handleBackToSets,
    handleCreatePage,
    handleExit,
    handleStructureChange,
    handleTypeChange,
    hasInvalidRoute: !parsedSetId.success || parsedSubsetId?.success === false,
    hasMissingPage: parsedSubsetId?.success === true && !activePage,
    isSaving,
    resolvedSetId,
    selectedType,
    setQuery,
    updatePageStructureMutation,
    updatePageTypeMutation,
  }
}

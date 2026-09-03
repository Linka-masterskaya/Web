import { folderQueryKeys } from '@entities/folder'
import { getSetPageTitle, useSet, useUpdateSetTitle } from '@entities/set'
import { ActionIcon, Text, TextInput } from '@mantine/core'
import { createDashboardSetsUrl } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useQueryClient } from '@tanstack/react-query'
import { type FormEvent, type KeyboardEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioTitle: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    hasValidSetId,
    isSetEditor,
    isSetOverview,
    isSubsetEditor,
    isSubsetNew,
    resolvedSetId,
    resolvedSubsetId,
    setOverviewUrl,
  } = useSetStudioRoute()
  const setQuery = useSet(resolvedSetId)
  const updateSetTitleMutation = useUpdateSetTitle(resolvedSetId)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')

  const pages = setQuery.data?.pages ?? []
  const activePageIndex = isSubsetEditor
    ? pages.findIndex((page) => page.id === resolvedSubsetId)
    : isSetEditor
      ? 0
      : -1
  const activePage = activePageIndex >= 0 ? pages[activePageIndex] : undefined
  const currentTitle = isSubsetNew
    ? 'Новая страница'
    : activePage
      ? getSetPageTitle(activePage, activePageIndex)
      : (setQuery.data?.title ?? (hasValidSetId ? 'Набор' : 'Новый набор'))
  const canEditTitle = isSetOverview && Boolean(setQuery.data?.title)

  useEffect(() => {
    void resolvedSetId
    setIsEditingTitle(false)
    setTitleDraft('')
    updateSetTitleMutation.reset()
  }, [resolvedSetId, updateSetTitleMutation.reset])

  const handleBack = () => {
    if (setOverviewUrl && !isSetOverview) {
      navigate(setOverviewUrl)
      return
    }

    navigate(createDashboardSetsUrl(setQuery.data?.folderId))
  }

  const handleStartEditing = () => {
    if (!canEditTitle || updateSetTitleMutation.isPending) {
      return
    }

    updateSetTitleMutation.reset()
    setTitleDraft(currentTitle)
    setIsEditingTitle(true)
  }

  const handleCancelEditing = () => {
    if (updateSetTitleMutation.isPending) {
      return
    }

    updateSetTitleMutation.reset()
    setIsEditingTitle(false)
  }

  const handleSaveTitle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = titleDraft.trim()

    if (!title || !setQuery.data || updateSetTitleMutation.isPending) {
      return
    }

    if (title === setQuery.data.title) {
      setIsEditingTitle(false)
      return
    }

    updateSetTitleMutation.mutate(title, {
      onSuccess: () => {
        setIsEditingTitle(false)
        void queryClient.invalidateQueries({ queryKey: folderQueryKeys.all })
      },
    })
  }

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      handleCancelEditing()
    }
  }

  return (
    <div className={styles.titleGroup}>
      <ActionIcon
        variant="transparent"
        color="dark"
        size={32}
        onClick={handleBack}
        aria-label={isSetOverview ? 'К списку наборов' : 'Вернуться к набору'}
      >
        <Icon name="ChevronLeft" size={24} />
      </ActionIcon>

      {isEditingTitle ? (
        <form className={styles.titleForm} onSubmit={handleSaveTitle}>
          <TextInput
            className={styles.titleInput}
            value={titleDraft}
            onChange={(event) => {
              setTitleDraft(event.currentTarget.value)
              updateSetTitleMutation.reset()
            }}
            onKeyDown={handleTitleKeyDown}
            aria-label="Название набора"
            error={updateSetTitleMutation.isError ? 'Не удалось сохранить название' : undefined}
            disabled={updateSetTitleMutation.isPending}
            autoFocus
          />

          <div className={styles.titleActions}>
            <ActionIcon
              type="submit"
              variant="subtle"
              size={32}
              loading={updateSetTitleMutation.isPending}
              disabled={!titleDraft.trim()}
              aria-label="Сохранить название"
            >
              <Icon name="Check" size={18} />
            </ActionIcon>
            <ActionIcon
              type="button"
              variant="subtle"
              color="gray"
              size={32}
              onClick={handleCancelEditing}
              disabled={updateSetTitleMutation.isPending}
              aria-label="Отменить изменение названия"
            >
              <Icon name="X" size={18} />
            </ActionIcon>
          </div>
        </form>
      ) : (
        <>
          <Text className={styles.title}>{currentTitle}</Text>

          {canEditTitle && (
            <ActionIcon
              variant="transparent"
              color="gray"
              size={32}
              onClick={handleStartEditing}
              aria-label="Изменить название набора"
            >
              <Icon name="Pencil" size={18} />
            </ActionIcon>
          )}
        </>
      )}
    </div>
  )
}

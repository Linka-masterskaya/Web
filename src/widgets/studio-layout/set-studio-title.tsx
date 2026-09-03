import { folderQueryKeys } from '@entities/folder'
import { useSet, useUpdateSetTitle } from '@entities/set'
import { ActionIcon, Text, TextInput } from '@mantine/core'
import { createDashboardSetsUrl } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useQueryClient } from '@tanstack/react-query'
import { type FormEvent, type KeyboardEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioTitle: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { hasValidSetId, isSetOverview, resolvedSetId, setOverviewUrl } = useSetStudioRoute()
  const setQuery = useSet(resolvedSetId)
  const updateTitleMutation = useUpdateSetTitle(resolvedSetId)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')

  const handleBack = () => {
    if (setOverviewUrl && !isSetOverview) {
      navigate(setOverviewUrl)
      return
    }

    navigate(createDashboardSetsUrl(setQuery.data?.folderId))
  }

  const handleStartEditing = () => {
    if (!setQuery.data?.title || updateTitleMutation.isPending) {
      return
    }

    updateTitleMutation.reset()
    setTitleDraft(setQuery.data.title)
    setIsEditingTitle(true)
  }

  const handleCancelEditing = () => {
    if (updateTitleMutation.isPending) {
      return
    }

    updateTitleMutation.reset()
    setIsEditingTitle(false)
  }

  const handleSaveTitle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = titleDraft.trim()

    if (!title || !setQuery.data || updateTitleMutation.isPending) {
      return
    }

    if (title === setQuery.data.title) {
      setIsEditingTitle(false)
      return
    }

    updateTitleMutation.mutate(title, {
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
              updateTitleMutation.reset()
            }}
            onKeyDown={handleTitleKeyDown}
            aria-label="Название набора"
            error={updateTitleMutation.isError ? 'Не удалось сохранить название' : undefined}
            disabled={updateTitleMutation.isPending}
            autoFocus
          />

          <div className={styles.titleActions}>
            <ActionIcon
              type="submit"
              variant="subtle"
              size={32}
              loading={updateTitleMutation.isPending}
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
              disabled={updateTitleMutation.isPending}
              aria-label="Отменить изменение названия"
            >
              <Icon name="X" size={18} />
            </ActionIcon>
          </div>
        </form>
      ) : (
        <>
          <Text className={styles.title}>
            {setQuery.data?.title ?? (hasValidSetId ? 'Набор' : 'Новый набор')}
          </Text>

          {setQuery.data?.title && (
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

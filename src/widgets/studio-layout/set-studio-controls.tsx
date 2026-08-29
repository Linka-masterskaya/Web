import { setQueryKeys, useSet, useUpdateSetTitle } from '@entities/set'
import { ActionIcon, Button, Group, Text, TextInput } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useIsMutating } from '@tanstack/react-query'
import { type FormEvent, type KeyboardEvent, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-studio-controls.module.scss'

const setIdSchema = z.string().uuid()

export const SetStudioTitle: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setQuery = useSet(resolvedSetId)
  const updateTitleMutation = useUpdateSetTitle(resolvedSetId)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const setOverviewUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetId, { setId: resolvedSetId })
    : null
  const isSetOverview = setOverviewUrl === location.pathname

  const handleBack = () => {
    if (setOverviewUrl && location.pathname !== setOverviewUrl) {
      navigate(setOverviewUrl)
      return
    }

    navigate(createUrl(routerPath.dashboardSets))
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
      onSuccess: () => setIsEditingTitle(false),
    })
  }

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      handleCancelEditing()
    }
  }

  return (
    <Group gap="sm" wrap="nowrap" className={styles.titleGroup}>
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

          <Group gap={2} wrap="nowrap" className={styles.titleActions}>
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
          </Group>
        </form>
      ) : (
        <>
          <Text fw={700} fz="lg" truncate="end" className={styles.title}>
            {setQuery.data?.title ?? (parsedSetId.success ? 'Набор' : 'Новый набор')}
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
    </Group>
  )
}

export const SetStudioExitButton: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setId, subsetId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const parsedSubsetId = setIdSchema.safeParse(subsetId)
  const isSaving =
    useIsMutating({
      mutationKey: setQueryKeys.detail(parsedSetId.success ? parsedSetId.data : ''),
    }) > 0
  const setOverviewUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetId, { setId: parsedSetId.data })
    : null
  const setEditorUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetIdEdit, { setId: parsedSetId.data })
    : null
  const subsetEditorUrl =
    parsedSetId.success && parsedSubsetId.success
      ? createUrl(routerPath.dashboardSubsetIdEdit, {
          setId: parsedSetId.data,
          subsetId: parsedSubsetId.data,
        })
      : null

  const handleExit = () => {
    if (setOverviewUrl && location.pathname !== setOverviewUrl) {
      navigate(setOverviewUrl)
      return
    }

    navigate(createUrl(routerPath.dashboardSets))
  }

  if (location.pathname !== setEditorUrl && location.pathname !== subsetEditorUrl) {
    return null
  }

  return (
    <Button className={styles.exitButton} loading={isSaving} onClick={handleExit}>
      Сохранить и выйти
    </Button>
  )
}

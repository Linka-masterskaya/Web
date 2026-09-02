import { setQueryKeys, type TSet, useSet, useUpdateSet, useUpdateSetTitle } from '@entities/set'
import { SET_SETTINGS_DEFAULT_VALUES, SetSettings } from '@features/set-settings'
import type { TSetSettings } from '@features/set-settings/model/set-settings.schema'
import { ActionIcon, Button, Text, TextInput, UnstyledButton } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useIsMutating } from '@tanstack/react-query'
import { type FormEvent, type KeyboardEvent, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-studio-controls.module.scss'

const setIdSchema = z.string().uuid()

type TEditSetSettingsModalProps = {
  set: TSet
  onClose: () => void
}

const EditSetSettingsModal: React.FC<TEditSetSettingsModalProps> = ({ set, onClose }) => {
  const updateSetMutation = useUpdateSet(set.id)

  const handleSave = async (values: TSetSettings) => {
    updateSetMutation.reset()

    try {
      const age = Number(values.age)

      await updateSetMutation.mutateAsync({
        id: set.id,
        title: values.title.trim(),
        folderId: set.folderId,
        ageMin: age,
        ageMax: age,
        difficulty: values.level,
        goals: set.goals ?? [],
        notes: values.notes,
      })

      onClose()
    } catch {
      // Состояние ошибки отображается внутри формы.
    }
  }

  return (
    <SetSettings
      defaultValues={{
        title: set.title,
        age: String(set.ageMin ?? set.ageMax ?? SET_SETTINGS_DEFAULT_VALUES.age),
        level: set.difficulty ?? SET_SETTINGS_DEFAULT_VALUES.level,
        notes: set.notes ?? SET_SETTINGS_DEFAULT_VALUES.notes,
      }}
      onClose={onClose}
      onSave={handleSave}
      submitError={updateSetMutation.isError ? 'Не удалось сохранить настройки.' : undefined}
    />
  )
}

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
    </div>
  )
}

export const SetStudioToolbar: React.FC = () => {
  const location = useLocation()
  const { setId, subsetId } = useParams()
  const { open, close } = useModal()
  const parsedSetId = setIdSchema.safeParse(setId)
  const parsedSubsetId = setIdSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setQuery = useSet(resolvedSetId)
  const setEditorUrl = parsedSetId.success
    ? createUrl(routerPath.dashboardSetIdEdit, { setId: resolvedSetId })
    : null
  const subsetEditorUrl =
    parsedSetId.success && parsedSubsetId.success
      ? createUrl(routerPath.dashboardSubsetIdEdit, {
          setId: resolvedSetId,
          subsetId: parsedSubsetId.data,
        })
      : null

  if (location.pathname !== setEditorUrl && location.pathname !== subsetEditorUrl) {
    return null
  }

  const handleOpenSettings = () => {
    if (!setQuery.data) {
      return
    }

    open({
      content: <EditSetSettingsModal set={setQuery.data} onClose={close} />,
      size: 518,
      padding: 24,
      radius: 20,
      withCloseButton: false,
    })
  }

  return (
    <div className={styles.toolbarGroup}>
      <UnstyledButton
        className={styles.toolbarButton}
        onClick={handleOpenSettings}
        disabled={!setQuery.data || setQuery.isLoading}
        aria-label="Открыть настройки набора"
      >
        <Icon name="Settings" size={24} />
        <Text component="span" className={styles.toolbarLabel}>
          Настройки
        </Text>
      </UnstyledButton>
    </div>
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

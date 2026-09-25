import { parseSectionContentsFilters, useDeleteFolder, useSectionContents } from '@entities/folder'
import type { TFolderContentItem, TPackContentItem, TSection } from '@entities/section-content'
import { useDeleteSet, useDuplicateSet, useUnpublishSet } from '@entities/set'
import { isHeadDefectologist, useUserStore } from '@entities/user'
import { ConfirmDelete } from '@features/confirm-delete'
import { useOpenCopySet } from '@features/copy-set'
import { useOpenMoveSet } from '@features/move-set'
import { useOpenPublishSet } from '@features/publish-set'
import { RenameFolderModal } from '@features/rename-folder'
import { RenameSetModal } from '@features/rename-set'
import { SendSet } from '@features/set'
import { CoverPickerModal } from '@features/set-settings'
import { Button, Group, Loader, Stack, Text } from '@mantine/core'
import { getApiErrorMessage } from '@shared/lib/api'
import { useModal } from '@shared/lib/modal'
import { useRouteQueryParams } from '@shared/lib/routes'
import type { TContextMenuItem } from '@shared/ui/context-menu'
import { isHTTPError } from 'ky'
import { type FC, useEffect, useMemo, useState } from 'react'
import { sectionBrowserConfig } from '../model/section-browser-config'
import { useFolderNavigation } from '../model/use-folder-navigation'
import styles from './section-contents-browser.module.scss'
import { SectionContentsCards } from './section-contents-cards'

export type TOpenSectionPackContext = {
  section: TSection
  currentFolderId?: string
  refetch: () => void
}

export type TOpenSectionPackHandler = (
  pack: TPackContentItem,
  context: TOpenSectionPackContext,
) => void

export type TSectionFolderContext = {
  isRoot: boolean
  currentFolderId?: string
}

export type TSectionContentsBrowserProps = {
  section: TSection
  onOpenPack?: TOpenSectionPackHandler
  dashboardHref?: string
  onFolderContextChange?: (context: TSectionFolderContext) => void
  initialFolderId?: string
}

const DEFAULT_DASHBOARD_HREF = '/'
const FAVORITES_EMPTY_TEXT = 'Нет избранных наборов'

export const SectionContentsBrowser: FC<TSectionContentsBrowserProps> = ({
  section,
  onOpenPack,
  dashboardHref = DEFAULT_DASHBOARD_HREF,
  onFolderContextChange,
  initialFolderId,
}) => {
  const config = sectionBrowserConfig[section]
  const { queryParams } = useRouteQueryParams()
  const { open, close } = useModal()
  const openMoveSet = useOpenMoveSet()

  // Редактирование Библиотеки (публикация, снятие публикации) доступно главному методисту
  const role = useUserStore((state) => state.role)
  const canEditLibrary = isHeadDefectologist(role)
  const openPublishSet = useOpenPublishSet()
  const openCopySet = useOpenCopySet()

  const [actionError, setActionError] = useState<string | null>(null)
  const { mutateAsync: duplicateSet, isPending: isDuplicatePending } = useDuplicateSet()
  const { mutateAsync: deleteSet, isPending: isDeletePending } = useDeleteSet()
  const { mutateAsync: deleteFolder } = useDeleteFolder()
  const { mutateAsync: unpublishSet, isPending: isUnpublishPending } = useUnpublishSet()

  const { currentFolderId, isRoot, isInitialFolder, openFolder, goBack, goToRoot } =
    useFolderNavigation(initialFolderId)

  useEffect(() => {
    onFolderContextChange?.({
      isRoot,
      currentFolderId,
    })
  }, [currentFolderId, isRoot, onFolderContextChange])

  const filters = useMemo(() => parseSectionContentsFilters(queryParams), [queryParams])

  const { data, isLoading, error, refetch } = useSectionContents({
    section,
    parentId: currentFolderId,
    sort: 'name',
    order: 'asc',
    limit: 50,
    offset: 0,
    ...filters,
  })

  // Несуществующий parent_id в разделе (например, folderId из Библиотеки на /sets) → 404.
  // Сбрасываем folderId, чтобы не зациклиться на ошибке.
  useEffect(() => {
    if (!currentFolderId || !error || !isHTTPError(error) || error.response.status !== 404) {
      return
    }

    goToRoot()
  }, [currentFolderId, error, goToRoot])

  const items = data?.items ?? []
  const emptyText = filters.isFavorite ? FAVORITES_EMPTY_TEXT : config.emptyText

  const handleOpenFolder = (folder: TFolderContentItem) => {
    openFolder(folder)
  }

  const handleOpenPack = (pack: TPackContentItem) => {
    onOpenPack?.(pack, {
      section,
      currentFolderId,
      refetch,
    })
  }
  const handleGoToRoot = () => {
    goToRoot()
  }

  const handleMovePack = (pack: TPackContentItem) => {
    openMoveSet({
      setId: pack.id,
      onSuccess: refetch,
    })
  }

  const handleDuplicatePack = async (pack: TPackContentItem) => {
    try {
      setActionError(null)
      await duplicateSet({
        setId: pack.id,
        ...(currentFolderId ? { folderId: currentFolderId } : {}),
      })
    } catch (error) {
      setActionError(await getApiErrorMessage(error))
    }
  }

  const handleSharePack = (pack: TPackContentItem) => {
    open({
      padding: 0,
      radius: 20,
      withCloseButton: false,
      content: <SendSet setId={pack.id} onClose={close} />,
    })
  }

  const handleDeletePack = (pack: TPackContentItem) => {
    open({
      size: 361,
      radius: 20,
      withCloseButton: false,
      content: (
        <ConfirmDelete
          title={`Удалить набор «${pack.name}»?`}
          description="Вы уверены?"
          onConfirm={() => deleteSet({ setId: pack.id })}
        />
      ),
    })
  }

  const handleChangePackCover = (pack: TPackContentItem) => {
    open({
      size: 1280,
      padding: 0,
      radius: 20,
      withCloseButton: false,
      content: <CoverPickerModal packId={pack.id} />,
    })
  }

  const handleRenameFolder = (folder: TFolderContentItem) => {
    open({
      size: 518,
      padding: 0,
      radius: 20,
      withCloseButton: false,
      content: <RenameFolderModal folderId={folder.id} currentName={folder.name} onClose={close} />,
    })
  }

  const handleRenamePack = (pack: TPackContentItem) => {
    open({
      size: 518,
      padding: 0,
      radius: 20,
      withCloseButton: false,
      content: (
        <RenameSetModal
          setId={pack.id}
          currentTitle={pack.name}
          onClose={close}
          onSuccess={refetch}
        />
      ),
    })
  }

  const handleDeleteFolder = (folder: TFolderContentItem) => {
    open({
      size: 361,
      radius: 20,
      withCloseButton: false,
      content: (
        <ConfirmDelete
          title={`Удалить папку «${folder.name}»?`}
          description="Вы уверены?"
          onConfirm={() => deleteFolder(folder.id)}
          getErrorMessage={async (error) => {
            if (isHTTPError(error) && error.response.status === 409) {
              return 'Нельзя удалить папку, пока в ней есть наборы'
            }

            return getApiErrorMessage(error)
          }}
        />
      ),
    })
  }

  const handleCopyPack = (pack: TPackContentItem) => {
    openCopySet({ setId: pack.id })
  }

  const handlePublishPack = (pack: TPackContentItem) => {
    openPublishSet({ setId: pack.id })
  }

  const handleUnpublishPack = async (pack: TPackContentItem) => {
    try {
      setActionError(null)
      await unpublishSet({ setId: pack.id })
    } catch (error) {
      setActionError(await getApiErrorMessage(error))
    }
  }

  const backAction =
    isRoot || isInitialFolder
      ? ({
          type: 'link',
          href: dashboardHref,
        } as const)
      : ({
          type: 'function',
          onClick: goBack,
        } as const)

  const isPackActionPending = isDuplicatePending || isDeletePending || isUnpublishPending

  // Публикация — только в «Мои наборы» и только у главного методиста
  const canPublishFromSection = canEditLibrary && section === 'my'

  const publicationContextMenuItems: readonly TContextMenuItem<TPackContentItem>[] =
    canPublishFromSection
      ? [
          {
            id: 'publish',
            label: 'Опубликовать',
            disabled: (pack) => isPackActionPending || pack.published === true,
            onClick: handlePublishPack,
          },
          {
            id: 'unpublish',
            label: 'Снять публикацию',
            disabled: (pack) => isPackActionPending || pack.published !== true,
            onClick: (pack) => {
              void handleUnpublishPack(pack)
            },
          },
        ]
      : []

  const libraryPackContextMenuItems: readonly TContextMenuItem<TPackContentItem>[] = [
    {
      id: 'copy',
      label: 'Скопировать в мои папки',
      disabled: isPackActionPending,
      onClick: handleCopyPack,
    },
    ...(canEditLibrary
      ? [
          {
            id: 'change-cover',
            label: 'Изменить обложку',
            onClick: handleChangePackCover,
          },
          {
            id: 'unpublish',
            label: 'Снять публикацию',
            disabled: isPackActionPending,
            onClick: (pack: TPackContentItem) => {
              void handleUnpublishPack(pack)
            },
          },
        ]
      : []),
  ]

  const ownPackContextMenuItems: readonly TContextMenuItem<TPackContentItem>[] = [
    {
      id: 'move',
      label: 'Переместить',
      onClick: handleMovePack,
    },
    {
      id: 'rename',
      label: 'Переименовать',
      onClick: handleRenamePack,
    },
    {
      id: 'change-cover',
      label: 'Изменить обложку',
      onClick: handleChangePackCover,
    },
    {
      id: 'duplicate',
      label: 'Дублировать',
      disabled: isPackActionPending,
      onClick: (pack) => {
        void handleDuplicatePack(pack)
      },
    },
    {
      id: 'share',
      label: 'Поделиться',
      disabled: isPackActionPending,
      onClick: handleSharePack,
    },
    ...publicationContextMenuItems,
    {
      id: 'delete',
      label: 'Удалить',
      color: 'red',
      disabled: isPackActionPending,
      onClick: handleDeletePack,
    },
  ]

  const packContextMenuItems: readonly TContextMenuItem<TPackContentItem>[] =
    section === 'library' ? libraryPackContextMenuItems : ownPackContextMenuItems

  // Переименование папки — только в «Моих наборах».
  // Удаление: в «Моих наборах» — всегда, в Библиотеке — только главному методисту
  const canDeleteFolder = section === 'my' || (section === 'library' && canEditLibrary)

  const folderContextMenuItems: readonly TContextMenuItem<TFolderContentItem>[] = [
    ...(section === 'my'
      ? [
          {
            id: 'rename',
            label: 'Переименовать',
            onClick: handleRenameFolder,
          },
        ]
      : []),
    ...(canDeleteFolder
      ? [
          {
            id: 'delete',
            label: 'Удалить',
            color: 'red' as const,
            onClick: handleDeleteFolder,
          },
        ]
      : []),
  ]

  return (
    <section className={styles.root}>
      {isLoading && (
        <Group gap="sm">
          <Loader size="sm" />
          <Text> Загружаем содержимое папки... </Text>
        </Group>
      )}

      {!isLoading && !error && (
        <>
          {actionError && (
            <Text c="red.6" role="alert">
              {actionError}
            </Text>
          )}

          <SectionContentsCards
            items={items}
            backAction={backAction}
            emptyText={emptyText}
            onOpenFolder={handleOpenFolder}
            onOpenPack={handleOpenPack}
            packContextMenuItems={packContextMenuItems}
            folderContextMenuItems={folderContextMenuItems}
          />
        </>
      )}

      {!isLoading && error && (
        <Stack align="flex-start" gap="sm">
          <Text>{error.message}</Text>
          <Group gap="sm">
            <Button
              variant="light"
              onClick={() => {
                void refetch()
              }}
            >
              Повторить
            </Button>

            {!isRoot && (
              <Button variant="outline" onClick={handleGoToRoot}>
                Вернуться назад
              </Button>
            )}
          </Group>
        </Stack>
      )}
    </section>
  )
}

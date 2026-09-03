import { parseSectionContentsFilters, useSectionContents } from '@entities/folder'
import type { TFolderContentItem, TPackContentItem, TSection } from '@entities/section-content'
import { useDuplicateSet } from '@entities/set'
import { Button, Group, Loader, Stack, Text } from '@mantine/core'
import { useRouteQueryParams } from '@shared/lib/routes'
import { type FC, useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '@shared/lib/api'
import type { TContextMenuItem } from '@shared/ui/context-menu'
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
}

const DEFAULT_DASHBOARD_HREF = '/'

export const SectionContentsBrowser: FC<TSectionContentsBrowserProps> = ({
  section,
  onOpenPack,
  dashboardHref = DEFAULT_DASHBOARD_HREF,
  onFolderContextChange,
}) => {
  const config = sectionBrowserConfig[section]
  const { queryParams } = useRouteQueryParams()

  const [actionError, setActionError] = useState<string | null>(null)
  const { mutateAsync: duplicateSet, isPending: isDuplicatePending } = useDuplicateSet()

  const { currentFolderId, isRoot, openFolder, goBack, goToRoot } = useFolderNavigation()

  useEffect(() => {
    onFolderContextChange?.({ isRoot, currentFolderId })
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

  const items = data?.items ?? []

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

  const backAction = isRoot
    ? ({
        type: 'link',
        href: dashboardHref,
      } as const)
    : ({
        type: 'function',
        onClick: goBack,
      } as const)

  const packContextMenuItems: readonly TContextMenuItem<TPackContentItem>[] =
    section === 'library'
      ? []
      : [
          {
            id: 'duplicate',
            label: 'Дублировать',
            disabled: isDuplicatePending,
            onClick: (pack) => {
              void handleDuplicatePack(pack)
            },
          },
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
        <Stack gap="sm">
          {actionError && (
            <Text c="red.6" role="alert">
              {actionError}
            </Text>
          )}

          <SectionContentsCards
            items={items}
            backAction={backAction}
            emptyText={config.emptyText}
            onOpenFolder={handleOpenFolder}
            onOpenPack={handleOpenPack}
            packContextMenuItems={packContextMenuItems}
          />
        </Stack>
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

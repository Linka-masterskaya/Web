import { parseSectionContentsFilters, useSectionContents } from '@entities/folder'
import type { TFolderContentItem, TPackContentItem, TSection } from '@entities/section-content'
import { Button, Group, Loader, Stack, Text } from '@mantine/core'
import { useRouteQueryParams } from '@shared/lib/routes'
import { type FC, useEffect, useMemo } from 'react'
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
  const visibleItems =
    section === 'my'
      ? items.filter((item) => (isRoot ? item.type === 'folder' : item.type === 'pack'))
      : items

  const handleOpenFolder = (folder: TFolderContentItem) => {
    if (section === 'my' && !isRoot) {
      return
    }

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

  const backAction = isRoot
    ? ({
        type: 'link',
        href: dashboardHref,
      } as const)
    : ({
        type: 'function',
        onClick: goBack,
      } as const)

  return (
    <section className={styles.root}>
      {isLoading && (
        <Group gap="sm">
          <Loader size="sm" />
          <Text> Загружаем содержимое папки... </Text>
        </Group>
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

      {!isLoading && !error && (
        <SectionContentsCards
          items={visibleItems}
          backAction={backAction}
          emptyText={config.emptyText}
          onOpenFolder={handleOpenFolder}
          onOpenPack={handleOpenPack}
        />
      )}
    </section>
  )
}

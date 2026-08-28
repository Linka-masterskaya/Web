import { type TContentItem, useSectionContents } from '@entities/folder'
import { Center, Loader, Stack, Text, UnstyledButton } from '@mantine/core'
import { createUrl, routerPath, useRouteQueryParams } from '@shared/lib/routes'
import { Card } from '@shared/ui/card'
import { Icon } from '@shared/ui/icon'
import { isHTTPError } from 'ky'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'

import styles from './sets-page.module.scss'

const folderIdSchema = z.string().uuid()

const formatUpdatedAt = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('ru-RU')
}

const getLoadErrorMessage = (error: unknown) => {
  if (isHTTPError(error) && error.response.status === 404) {
    return 'Папка не найдена или недоступна'
  }

  return 'Не удалось загрузить содержимое'
}

export const SetsPage: React.FC = () => {
  const navigate = useNavigate()
  const { queryParams, setQueryParams } = useRouteQueryParams()
  const folderIdParam = queryParams.folderId
  const parentId = useMemo(() => {
    if (!folderIdParam) {
      return undefined
    }

    const parsed = folderIdSchema.safeParse(folderIdParam)

    return parsed.success ? parsed.data : undefined
  }, [folderIdParam])
  const hasInvalidFolderId = Boolean(folderIdParam && !parentId)

  const contentsQuery = useSectionContents({
    section: 'my',
    ...(parentId ? { parentId } : {}),
  })

  const items = contentsQuery.data?.items ?? []

  const openFolder = (id: string) => {
    setQueryParams({ folderId: id })
  }

  const goToRoot = () => {
    setQueryParams({ folderId: null })
  }

  const goToDashboard = () => {
    navigate(`/${routerPath.dashboard}`)
  }

  const renderItem = (item: TContentItem) => {
    const isFolder = item.type === 'folder'
    const label = isFolder ? 'Папка' : item.published ? 'Набор · опубликован' : 'Набор · черновик'

    return (
      <UnstyledButton
        key={item.id}
        className={styles.item}
        onClick={() => {
          if (isFolder) {
            openFolder(item.id)
            return
          }

          navigate(createUrl(routerPath.dashboardSetId, { setId: item.id }))
        }}
        aria-label={isFolder ? `Открыть папку ${item.name}` : `Открыть набор ${item.name}`}
      >
        <Icon name={isFolder ? 'Folder' : 'Grid3x3'} size={20} aria-hidden />
        <div className={styles.itemBody}>
          <Text fw={600}>{item.name}</Text>
          <Text size="sm" c="dimmed">
            {label} · {formatUpdatedAt(item.updatedAt)}
          </Text>
        </div>
      </UnstyledButton>
    )
  }

  return (
    <section className={styles.page}>
      <Stack gap="md">
        {hasInvalidFolderId && (
          <Stack gap="sm" align="flex-start">
            <Text c="red.6" role="alert">
              Некорректный идентификатор папки
            </Text>

            <Card
              variant="icon"
              label="Вернуться назад"
              icon={<Icon name="CornerUpLeft" aria-hidden />}
              action={{
                type: 'function',
                onClick: goToRoot,
              }}
            />
          </Stack>
        )}

        {!hasInvalidFolderId && contentsQuery.isLoading && (
          <Center h={160}>
            <Loader aria-label="Загрузка содержимого" />
          </Center>
        )}

        {!hasInvalidFolderId && contentsQuery.isError && (
          <Stack gap="sm" align="flex-start">
            <Text c="red.6" role="alert">
              {getLoadErrorMessage(contentsQuery.error)}
            </Text>

            <Card
              variant="icon"
              label="Повторить"
              icon={<Icon name="RefreshCw" aria-hidden />}
              action={{
                type: 'function',
                onClick: () => contentsQuery.refetch(),
              }}
            />
          </Stack>
        )}

        {!hasInvalidFolderId && contentsQuery.isSuccess && (
          <Stack gap={8} className={styles.list}>
            <Card
              variant="icon"
              label="Вернуться назад"
              icon={<Icon name="CornerUpLeft" aria-hidden />}
              action={{
                type: 'function',
                onClick: parentId ? goToRoot : goToDashboard,
              }}
            />

            {items.map(renderItem)}
          </Stack>
        )}
      </Stack>
    </section>
  )
}

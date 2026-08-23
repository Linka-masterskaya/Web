import { type TContentItem, useSectionContents } from '@entities/folder'
import { Button, Center, Loader, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useSearchParams } from 'react-router'

import styles from './sets-page.module.scss'

const formatUpdatedAt = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('ru-RU')
}

export const SetsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const folderId = searchParams.get('folderId')
  const contentsQuery = useSectionContents({
    section: 'my',
    ...(folderId ? { parentId: folderId } : {}),
  })

  const items = contentsQuery.data?.items ?? []

  const openFolder = (id: string) => {
    setSearchParams({ folderId: id })
  }

  const goToRoot = () => {
    setSearchParams({})
  }

  const renderItem = (item: TContentItem) => {
    const isFolder = item.type === 'folder'
    const label = isFolder ? 'Папка' : item.published ? 'Набор · опубликован' : 'Набор · черновик'

    return (
      <UnstyledButton
        key={item.id}
        className={styles.item}
        disabled={!isFolder}
        onClick={() => {
          if (isFolder) {
            openFolder(item.id)
          }
        }}
        aria-label={isFolder ? `Открыть папку ${item.name}` : `Набор ${item.name}`}
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
        <Title order={2}>Мои наборы</Title>

        {folderId && (
          <Button
            variant="subtle"
            w="fit-content"
            onClick={goToRoot}
            leftSection={<Icon name="ArrowLeft" size={16} />}
          >
            К корню раздела
          </Button>
        )}

        <Text size="sm" c="dimmed">
          {folderId ? 'Содержимое папки' : 'Корень «Мои наборы»'}
        </Text>

        {contentsQuery.isLoading && (
          <Center h={160}>
            <Loader aria-label="Загрузка содержимого" />
          </Center>
        )}

        {contentsQuery.isError && (
          <Stack gap="sm" align="flex-start">
            <Text c="red.6" role="alert">
              Не удалось загрузить содержимое
            </Text>
            <Button variant="outline" onClick={() => contentsQuery.refetch()}>
              Повторить
            </Button>
          </Stack>
        )}

        {contentsQuery.isSuccess && items.length === 0 && (
          <Text c="dimmed">Здесь пока пусто</Text>
        )}

        {contentsQuery.isSuccess && items.length > 0 && (
          <Stack gap={8} className={styles.list}>
            {items.map(renderItem)}
          </Stack>
        )}
      </Stack>
    </section>
  )
}

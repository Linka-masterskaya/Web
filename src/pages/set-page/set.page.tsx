import { SET_PAGE_TYPE_LABELS, type TSetPage, useSet } from '@entities/set'
import { Button, Center, Group, Loader, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { isHTTPError } from 'ky'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-page.module.scss'

const setIdSchema = z.string().uuid()

const getLoadErrorMessage = (error: unknown) => {
  if (isHTTPError(error) && error.response.status === 404) {
    return 'Набор не найден или недоступен'
  }

  return 'Не удалось загрузить набор'
}

const getPageTitle = (page: TSetPage, index: number) => {
  const textElement = page.elements.find((element) => element.kind === 'text' && element.value?.trim())

  if (textElement?.value?.trim()) {
    return textElement.value.trim()
  }

  return `Страница ${index + 1}`
}

export const SetPage: React.FC = () => {
  const navigate = useNavigate()
  const { setId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''

  const setQuery = useSet(resolvedSetId)

  if (!parsedSetId.success) {
    return (
      <section className={styles.page}>
        <Stack gap="md" align="flex-start">
          <Text c="red.6" role="alert">
            Некорректный идентификатор набора
          </Text>
          <Button variant="outline" onClick={() => navigate(createUrl(routerPath.dashboardSets))}>
            К списку наборов
          </Button>
        </Stack>
      </section>
    )
  }

  const pages = setQuery.data?.pages ?? []

  return (
    <section className={styles.page}>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={4}>
            <Title order={2}>{setQuery.data?.title ?? 'Набор'}</Title>
            <Text size="sm" c="dimmed">
              Страницы набора
            </Text>
          </Stack>

          <Button
            leftSection={<Icon name="Plus" size={16} />}
            disabled={setQuery.isLoading || setQuery.isError}
            onClick={() =>
              navigate(createUrl(routerPath.dashboardSubsetNew, { setId: resolvedSetId }))
            }
          >
            Новая страница
          </Button>
        </Group>

        {setQuery.isLoading && (
          <Center h={160}>
            <Loader aria-label="Загрузка набора" />
          </Center>
        )}

        {setQuery.isError && (
          <Stack gap="sm" align="flex-start">
            <Text c="red.6" role="alert">
              {getLoadErrorMessage(setQuery.error)}
            </Text>
            <Button variant="outline" onClick={() => setQuery.refetch()}>
              Повторить
            </Button>
          </Stack>
        )}

        {setQuery.isSuccess && pages.length === 0 && (
          <Text c="dimmed">Здесь пока нет страниц</Text>
        )}

        {setQuery.isSuccess && pages.length > 0 && (
          <Stack gap={8} className={styles.list}>
            {pages.map((page, index) => (
              <UnstyledButton
                key={page.id}
                className={styles.item}
                disabled
                aria-label={`${getPageTitle(page, index)}, ${SET_PAGE_TYPE_LABELS[page.type]}`}
              >
                <Icon name="Grid3x3" size={20} aria-hidden />
                <div className={styles.itemBody}>
                  <Text fw={600}>{getPageTitle(page, index)}</Text>
                  <Text size="sm" c="dimmed">
                    {SET_PAGE_TYPE_LABELS[page.type]}
                  </Text>
                </div>
              </UnstyledButton>
            ))}
          </Stack>
        )}
      </Stack>
    </section>
  )
}

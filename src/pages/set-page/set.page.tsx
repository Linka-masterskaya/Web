import { useSet, useSetAccess } from '@entities/set'
import { Blockquote, Button, Center, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { createSetSectionQuery, createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { isHTTPError } from 'ky'
import { useLocation, useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-page.module.scss'
import { SetPageGrid } from './ui/set-page-grid'

const setIdSchema = z.string().uuid()

const getLoadErrorMessage = (error: unknown) => {
  if (isHTTPError(error) && error.response.status === 404) {
    return 'Набор не найден или недоступен'
  }

  return 'Не удалось загрузить набор'
}

export const SetPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''

  const setQuery = useSet(resolvedSetId)
  const { canEditSet, backUrl, section } = useSetAccess(setQuery.data?.folderId)
  const sectionQuery = createSetSectionQuery(section)

  if (!parsedSetId.success) {
    return (
      <section className={styles.page}>
        <Stack gap="md" align="flex-start">
          <Text c="red.6" role="alert">
            Некорректный идентификатор набора
          </Text>
          <Button variant="outline" onClick={() => navigate(backUrl)}>
            Назад
          </Button>
        </Stack>
      </section>
    )
  }

  const pages = setQuery.data?.pages ?? []

  return (
    <section className={styles.page}>
      <Group className={styles.header} justify="space-between" align="flex-start" wrap="wrap">
        <Stack gap={4}>
          <Title order={2}>{setQuery.data?.title ?? 'Набор'}</Title>
          <Text size="sm" c="dimmed">
            Страницы набора
          </Text>
        </Stack>

        {canEditSet && (
          <Button
            leftSection={<Icon name="Plus" size={16} />}
            disabled={setQuery.isLoading || setQuery.isError}
            onClick={() =>
              navigate(
                createUrl(routerPath.dashboardSubsetNew, { setId: resolvedSetId }, sectionQuery),
                { state: location.state },
              )
            }
          >
            Создать страницу
          </Button>
        )}
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
        <Blockquote
          className={styles.emptyText}
          color="blue"
          icon={<Icon name="Info" aria-hidden="true" />}
          iconSize={32}
        >
          Здесь пока нет страниц
        </Blockquote>
      )}

      {setQuery.isSuccess && pages.length > 0 && (
        <SetPageGrid
          setId={resolvedSetId}
          pages={pages}
          readOnly={!canEditSet}
          onOpenPage={(page) =>
            navigate(
              createUrl(
                canEditSet ? routerPath.dashboardSubsetIdEdit : routerPath.dashboardSubsetId,
                {
                  setId: resolvedSetId,
                  subsetId: page.id,
                },
                sectionQuery,
              ),
              { state: location.state },
            )
          }
        />
      )}
    </section>
  )
}

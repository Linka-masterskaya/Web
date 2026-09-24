import { useCreateSetPage } from '@entities/set'
import { Button, Center, Group, Loader, Stack, Text } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-subset-new-page.module.scss'

const setIdSchema = z.string().uuid()

/** Защита от двойного create в React Strict Mode. */
const creatingSetIds = new Set<string>()

export const SetSubsetNewPage: React.FC = () => {
  const navigate = useNavigate()
  const { setId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''

  const createPageMutation = useCreateSetPage(resolvedSetId)
  const { mutate, isError, reset } = createPageMutation
  const didStartRef = useRef(false)

  const openCreatedPage = (set: { pages: { id: string }[] }) => {
    const createdPage = set.pages.at(-1)

    if (!createdPage) {
      navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }), {
        replace: true,
      })
      return
    }

    navigate(
      createUrl(routerPath.dashboardSubsetIdEdit, {
        setId: resolvedSetId,
        subsetId: createdPage.id,
      }),
      { replace: true },
    )
  }

  const createPage = () => {
    if (!parsedSetId.success || creatingSetIds.has(resolvedSetId)) {
      return
    }

    creatingSetIds.add(resolvedSetId)
    mutate('grid', {
      onSuccess: openCreatedPage,
      onSettled: () => {
        creatingSetIds.delete(resolvedSetId)
      },
    })
  }

  useEffect(() => {
    if (!parsedSetId.success || didStartRef.current) {
      return
    }

    didStartRef.current = true
    createPage()
    // Создание запускаем один раз при входе на маршрут.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only create
  }, [parsedSetId.success, resolvedSetId])

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

  if (isError) {
    return (
      <section className={styles.page}>
        <Stack gap="md" align="flex-start">
          <Text c="red.6" role="alert">
            Не удалось создать страницу. Попробуйте ещё раз.
          </Text>
          <Group>
            <Button
              variant="outline"
              onClick={() =>
                navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }), {
                  replace: true,
                })
              }
            >
              К набору
            </Button>
            <Button
              onClick={() => {
                reset()
                createPage()
              }}
            >
              Повторить
            </Button>
          </Group>
        </Stack>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <Center className={styles.loader}>
        <Loader aria-label="Создание страницы" />
      </Center>
    </section>
  )
}

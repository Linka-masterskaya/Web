import { type TSetPageType, useCreateSetPage } from '@entities/set'
import { AssignmentTypeSelector } from '@features/assignment-type-selector'
import { isSetPageType, SET_PAGE_TYPE_OPTIONS } from '@features/set-page-type-selector'
import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { SubsetLayout } from '@widgets/subset-layout'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-subset-new-page.module.scss'

const setIdSchema = z.string().uuid()

export const SetSubsetNewPage: React.FC = () => {
  const navigate = useNavigate()
  const { setId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''

  const createPageMutation = useCreateSetPage(resolvedSetId)
  const [selectedType, setSelectedType] = useState<TSetPageType>('grid')

  const handleTypeChange = (value: string) => {
    if (!isSetPageType(value)) {
      return
    }

    setSelectedType(value)
    createPageMutation.reset()
  }

  const handleBack = () => {
    if (!parsedSetId.success) {
      navigate(createUrl(routerPath.dashboardSets))
      return
    }

    navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }))
  }

  const handleCreate = () => {
    if (!parsedSetId.success || createPageMutation.isPending) {
      return
    }

    createPageMutation.mutate(selectedType, {
      onSuccess: () => {
        navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }))
      },
    })
  }

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

  return (
    <section className={styles.page}>
      <Stack gap="lg">
        <Button
          variant="subtle"
          w="fit-content"
          leftSection={<Icon name="ArrowLeft" size={16} />}
          onClick={handleBack}
        >
          К набору
        </Button>

        <Title order={2}>Новая страница</Title>

        <SubsetLayout
          leftSlot={
            <AssignmentTypeSelector
              value={selectedType}
              options={[...SET_PAGE_TYPE_OPTIONS]}
              onChange={handleTypeChange}
            />
          }
        >
          <Stack gap="md" className={styles.content}>
            <Text c="dimmed">Выберите тип страницы и создайте её в наборе.</Text>

            {createPageMutation.isError && (
              <Text c="red.6" size="sm" role="alert">
                Не удалось создать страницу. Попробуйте ещё раз.
              </Text>
            )}

            <Group>
              <Button variant="default" onClick={handleBack}>
                Отмена
              </Button>
              <Button loading={createPageMutation.isPending} onClick={handleCreate}>
                Создать
              </Button>
            </Group>
          </Stack>
        </SubsetLayout>
      </Stack>
    </section>
  )
}

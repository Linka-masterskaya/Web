import { type TSetPageType, useCreateSetPage } from '@entities/set'
import { SetPageTypeForm } from '@features/set-page-type-form'
import { Button, Stack, Text } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
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

  const handleBack = () => {
    if (!parsedSetId.success) {
      navigate(createUrl(routerPath.dashboardSets))
      return
    }

    navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }))
  }

  const handleTypeChange = (value: TSetPageType) => {
    setSelectedType(value)
    createPageMutation.reset()
  }

  const handleCreate = () => {
    if (!parsedSetId.success || createPageMutation.isPending) {
      return
    }

    createPageMutation.mutate(selectedType, {
      onSuccess: (set) => {
        const createdPage = set.pages.at(-1)

        if (!createdPage) {
          navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }))
          return
        }

        navigate(
          createUrl(routerPath.dashboardSubsetIdEdit, {
            setId: resolvedSetId,
            subsetId: createdPage.id,
          }),
        )
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
      <SetPageTypeForm
        title="Новая страница"
        description="Выберите тип страницы и создайте её в наборе."
        value={selectedType}
        onChange={handleTypeChange}
        onBack={handleBack}
        onCancel={handleBack}
        onSubmit={handleCreate}
        submitLabel="Создать"
        isSubmitting={createPageMutation.isPending}
        errorMessage={
          createPageMutation.isError ? 'Не удалось создать страницу. Попробуйте ещё раз.' : null
        }
      />
    </section>
  )
}

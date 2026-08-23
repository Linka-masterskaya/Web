import { type TSetPageType, useSet, useUpdateSetPageType } from '@entities/set'
import { SetPageTypeForm } from '@features/set-page-type-form'
import { Button, Center, Loader, Stack, Text } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-subset-edit-page.module.scss'

const setIdSchema = z.string().uuid()
const subsetIdSchema = z.string().uuid()

export const SetSubsetEditPage: React.FC = () => {
  const navigate = useNavigate()
  const { setId, subsetId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const parsedSubsetId = subsetIdSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const resolvedSubsetId = parsedSubsetId.success ? parsedSubsetId.data : ''

  const setQuery = useSet(resolvedSetId)
  const updatePageTypeMutation = useUpdateSetPageType(resolvedSetId)
  const [selectedType, setSelectedType] = useState<TSetPageType>('grid')

  const page = useMemo(
    () => setQuery.data?.pages.find((item) => item.id === resolvedSubsetId),
    [resolvedSubsetId, setQuery.data?.pages],
  )

  useEffect(() => {
    if (page) {
      setSelectedType(page.type)
    }
  }, [page])

  const handleBack = () => {
    if (!parsedSetId.success) {
      navigate(createUrl(routerPath.dashboardSets))
      return
    }

    navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }))
  }

  const handleTypeChange = (value: TSetPageType) => {
    setSelectedType(value)
    updatePageTypeMutation.reset()
  }

  const handleSave = () => {
    if (!parsedSetId.success || !parsedSubsetId.success || updatePageTypeMutation.isPending) {
      return
    }

    updatePageTypeMutation.mutate(
      { pageId: resolvedSubsetId, type: selectedType },
      {
        onSuccess: () => {
          navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }))
        },
      },
    )
  }

  if (!parsedSetId.success || !parsedSubsetId.success) {
    return (
      <section className={styles.page}>
        <Stack gap="md" align="flex-start">
          <Text c="red.6" role="alert">
            Некорректный адрес страницы
          </Text>
          <Button variant="outline" onClick={() => navigate(createUrl(routerPath.dashboardSets))}>
            К списку наборов
          </Button>
        </Stack>
      </section>
    )
  }

  if (setQuery.isLoading) {
    return (
      <section className={styles.page}>
        <Center h={240}>
          <Loader aria-label="Загрузка страницы" />
        </Center>
      </section>
    )
  }

  if (setQuery.isError) {
    return (
      <section className={styles.page}>
        <Stack gap="md" align="flex-start">
          <Text c="red.6" role="alert">
            Не удалось загрузить набор
          </Text>
          <Button variant="outline" onClick={handleBack}>
            К набору
          </Button>
        </Stack>
      </section>
    )
  }

  if (!page) {
    return (
      <section className={styles.page}>
        <Stack gap="md" align="flex-start">
          <Text c="red.6" role="alert">
            Страница не найдена в наборе
          </Text>
          <Button variant="outline" onClick={handleBack}>
            К набору
          </Button>
        </Stack>
      </section>
    )
  }

  const hasTypeChanged = selectedType !== page.type

  return (
    <section className={styles.page}>
      <SetPageTypeForm
        title="Редактирование страницы"
        description="Выберите тип страницы. При смене типа содержимое страницы будет сброшено."
        value={selectedType}
        onChange={handleTypeChange}
        onBack={handleBack}
        onCancel={handleBack}
        onSubmit={handleSave}
        submitLabel="Сохранить"
        isSubmitting={updatePageTypeMutation.isPending}
        isSubmitDisabled={!hasTypeChanged}
        errorMessage={
          updatePageTypeMutation.isError
            ? 'Не удалось сохранить тип страницы. Попробуйте ещё раз.'
            : null
        }
      />
    </section>
  )
}

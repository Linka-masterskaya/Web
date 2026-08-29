import {
  getSetPageStructure,
  type TSetPageType,
  useSet,
  useUpdateSetPageStructure,
  useUpdateSetPageType,
} from '@entities/set'
import { AssignmentTypeSelector } from '@features/assignment-type-selector'
import {
  isSetPageType,
  SET_PAGE_TYPE_ICONS,
  SET_PAGE_TYPE_LABELS,
  SET_PAGE_TYPE_OPTIONS,
} from '@features/set-page-type-selector'
import { Button, Center, Group, Loader, Stack, Text } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { NumberStepper } from '@shared/ui/number-stepper'
import { SubsetLayout } from '@widgets/subset-layout'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'

import styles from './set-edit-page.module.scss'

const setIdSchema = z.string().uuid()
const subsetIdSchema = z.string().uuid()

export const SetEditPage: React.FC = () => {
  const navigate = useNavigate()
  const { setId, subsetId } = useParams()
  const parsedSetId = setIdSchema.safeParse(setId)
  const parsedSubsetId = subsetId == null ? null : subsetIdSchema.safeParse(subsetId)
  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setQuery = useSet(resolvedSetId)
  const updatePageTypeMutation = useUpdateSetPageType(resolvedSetId)
  const updatePageStructureMutation = useUpdateSetPageStructure(resolvedSetId)
  const [typeDraft, setTypeDraft] = useState<{ pageId: string; type: TSetPageType } | null>(null)
  const [structureDraft, setStructureDraft] = useState<{
    pageId: string
    primaryCount: number
    secondaryCount?: number
  } | null>(null)

  const pages = setQuery.data?.pages ?? []
  const activePage = parsedSubsetId?.success
    ? pages.find((page) => page.id === parsedSubsetId.data)
    : pages[0]
  const activePageIndex = activePage ? pages.findIndex((page) => page.id === activePage.id) : -1
  const selectedType =
    activePage && typeDraft?.pageId === activePage.id ? typeDraft.type : activePage?.type

  const handleExit = () => {
    if (!parsedSetId.success) {
      navigate(createUrl(routerPath.dashboardSets))
      return
    }

    navigate(createUrl(routerPath.dashboardSetId, { setId: resolvedSetId }))
  }

  const handleTypeChange = (nextValue: string) => {
    if (
      !activePage ||
      !isSetPageType(nextValue) ||
      nextValue === activePage.type ||
      updatePageTypeMutation.isPending ||
      updatePageStructureMutation.isPending
    ) {
      return
    }

    setTypeDraft({ pageId: activePage.id, type: nextValue })
    updatePageTypeMutation.reset()
    updatePageTypeMutation.mutate(
      { pageId: activePage.id, type: nextValue },
      {
        onError: () => setTypeDraft(null),
        onSuccess: () => setTypeDraft(null),
      },
    )
  }

  const handleStructureChange = (primaryCount: number, secondaryCount?: number) => {
    if (!activePage || updatePageTypeMutation.isPending || updatePageStructureMutation.isPending) {
      return
    }

    setStructureDraft({ pageId: activePage.id, primaryCount, secondaryCount })
    updatePageStructureMutation.reset()
    updatePageStructureMutation.mutate(
      { pageId: activePage.id, primaryCount, secondaryCount },
      {
        onError: () => setStructureDraft(null),
        onSuccess: () => setStructureDraft(null),
      },
    )
  }

  if (!parsedSetId.success || parsedSubsetId?.success === false) {
    return (
      <Center className={styles.feedback}>
        <Stack gap="md" align="center">
          <Text c="red.6" role="alert">
            Некорректный адрес страницы
          </Text>
          <Button variant="outline" onClick={() => navigate(createUrl(routerPath.dashboardSets))}>
            К списку наборов
          </Button>
        </Stack>
      </Center>
    )
  }

  if (setQuery.isLoading) {
    return (
      <Center className={styles.feedback}>
        <Loader aria-label="Загрузка редактора" />
      </Center>
    )
  }

  if (setQuery.isError) {
    return (
      <Center className={styles.feedback}>
        <Stack gap="md" align="center">
          <Text c="red.6" role="alert">
            Не удалось загрузить набор
          </Text>
          <Group>
            <Button variant="outline" onClick={handleExit}>
              Назад
            </Button>
            <Button onClick={() => setQuery.refetch()}>Повторить</Button>
          </Group>
        </Stack>
      </Center>
    )
  }

  if (parsedSubsetId?.success && !activePage) {
    return (
      <Center className={styles.feedback}>
        <Stack gap="md" align="center">
          <Text c="red.6" role="alert">
            Страница не найдена в наборе
          </Text>
          <Button variant="outline" onClick={handleExit}>
            К обзору набора
          </Button>
        </Stack>
      </Center>
    )
  }

  if (!activePage) {
    return (
      <Center className={styles.feedback}>
        <Stack gap="md" align="center">
          <Text fw={600}>В наборе пока нет страниц</Text>
          <Text size="sm" c="dimmed" ta="center">
            Создайте страницу, чтобы открыть редактор.
          </Text>
          <Group>
            <Button variant="outline" onClick={handleExit}>
              Назад
            </Button>
            <Button
              leftSection={<Icon name="Plus" size={18} />}
              onClick={() =>
                navigate(createUrl(routerPath.dashboardSubsetNew, { setId: resolvedSetId }))
              }
            >
              Создать страницу
            </Button>
          </Group>
        </Stack>
      </Center>
    )
  }

  const resolvedSelectedType = selectedType ?? activePage.type
  const pageTypeLabel = SET_PAGE_TYPE_LABELS[resolvedSelectedType]
  const pageTypeIcon = SET_PAGE_TYPE_ICONS[resolvedSelectedType]
  const pageStructure = getSetPageStructure(activePage)
  const activeStructureDraft = structureDraft?.pageId === activePage.id ? structureDraft : null
  const primaryCount = activeStructureDraft?.primaryCount ?? pageStructure.primaryCount
  const secondaryCount = activeStructureDraft?.secondaryCount ?? pageStructure.secondaryCount
  const isSidebarSaving = updatePageTypeMutation.isPending || updatePageStructureMutation.isPending

  return (
    <section
      className={styles.page}
      aria-label={`Редактор набора ${setQuery.data?.title ?? 'Набор'}`}
    >
      <SubsetLayout
        className={styles.editorLayout}
        leftTitle="Набор"
        rightTitle="Карточка"
        leftCollapsedSlot={
          <AssignmentTypeSelector
            compact
            value={resolvedSelectedType}
            options={[...SET_PAGE_TYPE_OPTIONS]}
            onChange={handleTypeChange}
            disabled={isSidebarSaving}
          />
        }
        leftSlot={
          <Stack gap="xl">
            <AssignmentTypeSelector
              value={resolvedSelectedType}
              options={[...SET_PAGE_TYPE_OPTIONS]}
              onChange={handleTypeChange}
              disabled={isSidebarSaving}
            />

            <Stack gap="md">
              <NumberStepper
                label={pageStructure.primaryLabel}
                value={primaryCount}
                min={pageStructure.primaryMin}
                max={pageStructure.primaryMax}
                disabled={isSidebarSaving}
                onChange={(value) => handleStructureChange(value, secondaryCount)}
              />

              {pageStructure.secondaryLabel &&
                secondaryCount != null &&
                pageStructure.secondaryMin != null &&
                pageStructure.secondaryMax != null && (
                  <NumberStepper
                    label={pageStructure.secondaryLabel}
                    value={secondaryCount}
                    min={pageStructure.secondaryMin}
                    max={pageStructure.secondaryMax}
                    disabled={isSidebarSaving}
                    onChange={(value) => handleStructureChange(primaryCount, value)}
                  />
                )}
            </Stack>

            <div className={styles.saveStatus} aria-live="polite">
              {isSidebarSaving && (
                <Text size="xs" c="dimmed">
                  Сохраняем настройки…
                </Text>
              )}

              {(updatePageTypeMutation.isError || updatePageStructureMutation.isError) && (
                <Text size="xs" c="red.6" role="alert">
                  Не удалось сохранить настройки.
                </Text>
              )}
            </div>

            <Text size="xs" c="dimmed" ta="center" className={styles.typeHint}>
              При смене типа содержимое текущей страницы будет сброшено.
            </Text>
          </Stack>
        }
        rightSlot={
          <div className={styles.inspectorEmpty}>
            <span className={styles.inspectorIcon} aria-hidden="true">
              <Icon name="MousePointerClick" size={24} />
            </span>
            <Text size="sm" c="dimmed" ta="center">
              Выберите карточку
              <br />
              для начала работы
            </Text>
          </div>
        }
      >
        <div className={styles.workspace}>
          <div className={styles.canvas}>
            <div className={styles.canvasEmpty}>
              <span className={styles.canvasIcon} aria-hidden="true">
                <Icon name={pageTypeIcon} size={36} />
              </span>
              <Text fw={700} size="lg">
                {pageTypeLabel}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Страница {activePageIndex + 1}
              </Text>
            </div>
          </div>

          <div className={styles.workspaceFooter}>
            <Button
              variant="outline"
              leftSection={<Icon name="Grid2x2" size={18} />}
              className={styles.overviewButton}
              onClick={handleExit}
              disabled={isSidebarSaving}
            >
              Обзор
            </Button>
          </div>
        </div>
      </SubsetLayout>
    </section>
  )
}

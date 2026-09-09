import { getSetPageStructure } from '@entities/set'
import { AssignmentTypeSelector } from '@features/assignment-type-selector'
import {
  SET_PAGE_TYPE_ICONS,
  SET_PAGE_TYPE_LABELS,
  SET_PAGE_TYPE_OPTIONS,
} from '@features/set-page-type-selector'
import { Button, Loader, Text } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { NumberStepper } from '@shared/ui/number-stepper'
import { SubsetLayout } from '@widgets/subset-layout'
import { useSetEditor } from './model/use-set-editor'
import styles from './set-edit-page.module.scss'
import { SetEditFeedback } from './ui/set-edit-feedback'

export const SetEditPage: React.FC = () => {
  const {
    activePage,
    activePageIndex,
    activeStructureDraft,
    handleBackToSets,
    handleCreatePage,
    handleExit,
    handleStructureChange,
    handleTypeChange,
    hasInvalidRoute,
    hasMissingPage,
    isSaving,
    selectedType,
    setQuery,
    updatePageStructureMutation,
    updatePageTypeMutation,
  } = useSetEditor()

  if (hasInvalidRoute) {
    return (
      <SetEditFeedback message="Некорректный адрес страницы редактора набора" isError>
        <Button variant="outline" onClick={handleBackToSets}>
          К списку наборов
        </Button>
      </SetEditFeedback>
    )
  }

  if (setQuery.isLoading) {
    return (
      <div className={styles.feedback}>
        <Loader aria-label="Загрузка редактора" />
      </div>
    )
  }

  if (setQuery.isError) {
    return (
      <SetEditFeedback message="Не удалось загрузить набор" isError>
        <div className={styles.feedbackActions}>
          <Button variant="outline" onClick={handleExit}>
            Назад
          </Button>
          <Button onClick={() => setQuery.refetch()}>Повторить</Button>
        </div>
      </SetEditFeedback>
    )
  }

  if (hasMissingPage) {
    return (
      <SetEditFeedback message="Страница не найдена в наборе" isError>
        <Button variant="outline" onClick={handleExit}>
          К обзору набора
        </Button>
      </SetEditFeedback>
    )
  }

  if (!activePage) {
    return (
      <SetEditFeedback
        message="В наборе пока нет страниц"
        description="Создайте страницу, чтобы открыть редактор."
      >
        <div className={styles.feedbackActions}>
          <Button variant="outline" onClick={handleExit}>
            Назад
          </Button>
          <Button leftSection={<Icon name="Plus" size={18} />} onClick={handleCreatePage}>
            Создать страницу
          </Button>
        </div>
      </SetEditFeedback>
    )
  }

  const resolvedSelectedType = selectedType ?? activePage.type
  const pageTypeLabel = SET_PAGE_TYPE_LABELS[resolvedSelectedType]
  const pageTypeIcon = SET_PAGE_TYPE_ICONS[resolvedSelectedType]
  const pageStructure = getSetPageStructure(activePage)
  const primaryCount = activeStructureDraft?.primaryCount ?? pageStructure.primaryCount
  const secondaryCount = activeStructureDraft?.secondaryCount ?? pageStructure.secondaryCount

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
            disabled={isSaving}
          />
        }
        leftSlot={
          <div className={styles.sidebarControls}>
            <AssignmentTypeSelector
              value={resolvedSelectedType}
              options={[...SET_PAGE_TYPE_OPTIONS]}
              onChange={handleTypeChange}
              disabled={isSaving}
            />

            <div className={styles.structureControls}>
              <NumberStepper
                label={pageStructure.primaryLabel}
                value={primaryCount}
                min={pageStructure.primaryMin}
                max={pageStructure.primaryMax}
                disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(value) => handleStructureChange(primaryCount, value)}
                  />
                )}
            </div>

            <div className={styles.saveStatus} aria-live="polite">
              {isSaving && <Text className={styles.savePending}>Сохраняем настройки…</Text>}

              {(updatePageTypeMutation.isError || updatePageStructureMutation.isError) && (
                <Text className={styles.saveError} role="alert">
                  Не удалось сохранить настройки.
                </Text>
              )}
            </div>

            <Text className={styles.typeHint}>
              При смене типа содержимое текущей страницы будет сброшено.
            </Text>
          </div>
        }
        rightSlot={
          <div className={styles.inspectorEmpty}>
            <span className={styles.inspectorIcon} aria-hidden="true">
              <Icon name="MousePointerClick" size={24} />
            </span>
            <Text className={styles.inspectorText}>Выберите карточку для начала работы</Text>
          </div>
        }
      >
        <div className={styles.workspace}>
          <div className={styles.canvas}>
            <div className={styles.canvasEmpty}>
              <span className={styles.canvasIcon} aria-hidden="true">
                <Icon name={pageTypeIcon} size={36} />
              </span>
              <Text className={styles.canvasTitle}>{pageTypeLabel}</Text>
              <Text className={styles.canvasCaption}>Страница {activePageIndex + 1}</Text>
            </div>
          </div>

          <div className={styles.workspaceFooter}>
            <Button
              variant="outline"
              leftSection={<Icon name="Grid2x2" size={16} />}
              className={styles.overviewButton}
              onClick={handleExit}
              disabled={isSaving}
            >
              Обзор
            </Button>
          </div>
        </div>
      </SubsetLayout>
    </section>
  )
}

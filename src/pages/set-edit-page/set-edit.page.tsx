import { useSetEditorStore } from '@entities/set'
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
import { CardInspector } from './ui/card-inspector'
import { SetEditFeedback } from './ui/set-edit-feedback'
import { SetEditorGrid } from './ui/set-editor-grid'

export const SetEditPage: React.FC = () => {
  const {
    activePage,
    rows,
    columns,
    selectedCard,
    editor,
    save,
    handleBackToSets,
    handleCreatePage,
    handleExit,
    handleOpenPreview,
    handleStructureChange,
    handleTypeChange,
    handlePageStructureChange,
    pageStructure,
    hasInvalidRoute,
    hasMissingPage,
    isSaving,
    selectedType,
    setQuery,
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

            {activePage.type === 'grid' && (
              <div className={styles.structureControls}>
                <NumberStepper
                  label="Строки"
                  value={rows}
                  min={1}
                  max={100}
                  onChange={(value) => handleStructureChange(value, columns)}
                />
                <NumberStepper
                  label="Колонки"
                  value={columns}
                  min={1}
                  max={100}
                  onChange={(value) => handleStructureChange(rows, value)}
                />
              </div>
            )}

            {activePage.type === 'categories' && pageStructure && (
              <div className={styles.structureControlsColumn}>
                <NumberStepper
                  label={pageStructure.primaryLabel}
                  value={pageStructure.primaryCount}
                  min={pageStructure.primaryMin}
                  max={pageStructure.primaryMax}
                  disabled={isSaving}
                  onChange={(value) =>
                    handlePageStructureChange(value, pageStructure.secondaryCount)
                  }
                />
                {pageStructure.secondaryLabel != null && pageStructure.secondaryCount != null && (
                  <NumberStepper
                    label={pageStructure.secondaryLabel}
                    value={pageStructure.secondaryCount}
                    min={pageStructure.secondaryMin ?? 1}
                    max={pageStructure.secondaryMax ?? 12}
                    disabled={isSaving}
                    onChange={(value) =>
                      handlePageStructureChange(pageStructure.primaryCount, value)
                    }
                  />
                )}
              </div>
            )}

            <div className={styles.saveStatus} aria-live="polite">
              {isSaving && <Text className={styles.savePending}>Сохраняем настройки…</Text>}

              {editor.saveError && (
                <Text className={styles.saveError} role="alert">
                  Не удалось сохранить изменения.
                </Text>
              )}
              {editor.saveError && (
                <Button variant="subtle" onClick={() => void save()}>
                  Повторить сохранение
                </Button>
              )}
            </div>

            <Text className={styles.typeHint}>При смене типа содержимое карточек сохраняется.</Text>
          </div>
        }
        rightSlot={
          activePage.type === 'grid' && selectedCard ? (
            <CardInspector key={selectedCard.id} pageId={activePage.id} card={selectedCard} />
          ) : (
            <div className={styles.inspectorEmpty}>
              <span className={styles.inspectorIcon} aria-hidden="true">
                <Icon name="MousePointerClick" size={24} />
              </span>
              <Text className={styles.inspectorText}>Выберите карточку для начала работы</Text>
            </div>
          )
        }
      >
        <div className={styles.workspace}>
          <div className={styles.canvas}>
            {activePage.type === 'grid' ? (
              <SetEditorGrid
                page={activePage}
                rows={rows}
                columns={columns}
                selectedCardId={editor.selectedCardId}
                onSelect={(id) => {
                  if (id.startsWith('slot:')) {
                    editor.resizeGrid(activePage.id, rows, columns)
                    const card = useSetEditorStore
                      .getState()
                      .config?.blocks.find((page) => page.id === activePage.id)?.elements[
                      Number(id.slice(5))
                    ]
                    if (card) {
                      editor.selectCard(card.id)
                    }
                  } else {
                    editor.selectCard(id)
                  }
                }}
              />
            ) : (
              <div className={styles.canvasEmpty}>
                <span className={styles.canvasIcon} aria-hidden="true">
                  <Icon name={pageTypeIcon} size={36} />
                </span>
                <Text className={styles.canvasTitle}>{pageTypeLabel}</Text>
                <Text className={styles.canvasCaption}>
                  Редактор этого режима будет добавлен позже. Карточки сохранены.
                </Text>
              </div>
            )}
          </div>

          <div className={styles.workspaceFooter}>
            <Button
              variant="outline"
              leftSection={<Icon name="Grid2x2" size={16} />}
              className={styles.overviewButton}
              onClick={handleOpenPreview}
              disabled={isSaving}
            >
              Обзор
            </Button>
            <Button
              variant="outline"
              leftSection={<Icon name="Plus" size={16} />}
              onClick={handleCreatePage}
            >
              Добавить
            </Button>
          </div>
        </div>
      </SubsetLayout>
    </section>
  )
}

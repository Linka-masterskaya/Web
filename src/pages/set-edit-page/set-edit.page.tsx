import { getSetPageStructure, readSetPagePairs, useSetEditorStore } from '@entities/set'
import { AssignmentTypeSelector } from '@features/assignment-type-selector'
import {
  SET_PAGE_TYPE_ICONS,
  SET_PAGE_TYPE_LABELS,
  SET_PAGE_TYPE_OPTIONS,
} from '@features/set-page-type-selector'
import { Button, Loader, Text } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import type { TMatchingGridItem } from '@shared/ui/matching-grid'
import { MatchingGrid } from '@shared/ui/matching-grid'
import { NumberStepper } from '@shared/ui/number-stepper'
import { SubsetLayout } from '@widgets/subset-layout'
import { useSetEditor } from './model/use-set-editor'
import styles from './set-edit-page.module.scss'
import { CardInspector } from './ui/card-inspector'
import { GridCardImage } from './ui/grid-card-image'
import { SetEditFeedback } from './ui/set-edit-feedback'
import { SetEditorDistribution } from './ui/set-editor-distribution'
import { SetEditorGrid } from './ui/set-editor-grid'
import { SetEditorOptions } from './ui/set-editor-options'

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
    handleMatchingCountChange,
    handleOptionsChange,
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

  const hasOptions = ['single_choice', 'multi_choice', 'sequence'].includes(activePage.type)
  const structure = getSetPageStructure(activePage)
  const resolvedSelectedType = selectedType ?? activePage.type
  const pageTypeLabel = SET_PAGE_TYPE_LABELS[resolvedSelectedType]
  const pageTypeIcon = SET_PAGE_TYPE_ICONS[resolvedSelectedType]

  const matchingElements: TMatchingGridItem[] =
    activePage.type === 'matching'
      ? activePage.elements.map((card) => {
          const type = card.card_type
          const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'

          return {
            id: card.id,
            cardType,
            title: card.value,
            media: cardType === 'normal' ? <GridCardImage card={card} /> : undefined,
            ariaLabel: card.value,
          }
        })
      : []

  const matchingPairs =
    activePage.type === 'matching'
      ? readSetPagePairs(activePage).map((pair) => ({
          leftId: pair.left_id,
          rightId: pair.right_id,
        }))
      : []

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
                    max={pageStructure.secondaryMax ?? 100}
                    disabled={isSaving}
                    onChange={(value) =>
                      handlePageStructureChange(pageStructure.primaryCount, value)
                    }
                  />
                )}
              </div>
            )}
            {activePage.type === 'matching' && (
              <div className={styles.matchingStructureControls}>
                <NumberStepper
                  label="Количество пар"
                  value={Math.max(1, readSetPagePairs(activePage).length)}
                  min={1}
                  max={100}
                  onChange={handleMatchingCountChange}
                />
              </div>
            )}

            {hasOptions && (
              <NumberStepper
                label={structure.primaryLabel}
                value={structure.primaryCount}
                min={structure.primaryMin}
                max={structure.primaryMax}
                onChange={handleOptionsChange}
              />
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
          selectedCard ? (
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
            {activePage.type === 'grid' && (
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
            )}
            {hasOptions && <SetEditorOptions page={activePage} />}
            {activePage.type === 'categories' && pageStructure?.secondaryCount != null && (
              <SetEditorDistribution
                page={activePage}
                itemCount={pageStructure.secondaryCount}
                selectedCardId={editor.selectedCardId}
                onSelect={editor.selectCard}
              />
            )}
            {activePage.type === 'matching' && (
              <MatchingGrid
                elements={matchingElements}
                pairs={matchingPairs}
                selectedCardId={editor.selectedCardId}
                onSelect={editor.selectCard}
              />
            )}
            {!hasOptions &&
              activePage.type !== 'grid' &&
              activePage.type !== 'categories' &&
              activePage.type !== 'matching' && (
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

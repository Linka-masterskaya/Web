import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

import {
  getSequenceElements,
  readSetPageAnswers,
  type TSetPage,
  useSetEditorStore,
} from '@entities/set'

import { CardGridCard } from '@shared/ui/assignment-card'
import { Icon } from '@shared/ui/icon'

import styles from '../set-edit-page.module.scss'

import { GridCardImage } from './grid-card-image'
import { SortableOptionCard } from './sortable-option-card'

export const SetEditorOptions: React.FC<{ page: TSetPage }> = ({ page }) => {
  const { selectedCardId, selectCard, toggleAnswer, moveSequence } = useSetEditorStore()

  const isSequence = page.type === 'sequence'

  const cards = isSequence ? getSequenceElements(page) : page.elements

  const correct = new Set(
    readSetPageAnswers(page)
      .filter((answer) => answer.is_correct)
      .map((answer) => answer.element_id),
  )

  const columns = cards.length <= 4 ? 2 : cards.length <= 9 ? 3 : 4

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = cards.findIndex((card) => card.id === active.id)

    const newIndex = cards.findIndex((card) => card.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const direction: 1 | -1 = newIndex > oldIndex ? 1 : -1

    const steps = Math.abs(newIndex - oldIndex)

    for (let i = 0; i < steps; i++) {
      moveSequence(page.id, String(active.id), direction)
    }
  }

  const renderCard = (card: (typeof cards)[number], index: number) => {
    const type = card.card_type

    const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'

    const label = `Карточка ${index + 1}${card.value ? `: ${card.value}` : ''}`

    const content = (
      <>
        <CardGridCard
          cardType={cardType}
          title={card.value}
          media={cardType === 'normal' ? <GridCardImage card={card} /> : undefined}
          active={selectedCardId === card.id}
          ariaLabel={label}
          onClick={() => selectCard(card.id)}
          indicator={
            isSequence
              ? {
                  type: 'order',
                  value: index + 1,
                }
              : undefined
          }
        />

        {!isSequence && (
          <button
            type="button"
            className={styles.answerToggle}
            aria-label={`Верный ответ: ${label}`}
            aria-pressed={correct.has(card.id)}
            data-active={page.type === 'multi_choice' && selectedCardId === card.id}
            onClick={() => toggleAnswer(page.id, card.id)}
          >
            {correct.has(card.id) && <Icon name="Check" size={14} />}
          </button>
        )}
      </>
    )

    if (isSequence) {
      return (
        <SortableOptionCard key={card.id} id={card.id}>
          {content}
        </SortableOptionCard>
      )
    }

    return (
      <div className={styles.optionCard} key={card.id}>
        {content}
      </div>
    )
  }

  const grid = (
    <div
      className={styles.optionsGrid}
      style={
        {
          '--option-columns': columns,
        } as React.CSSProperties
      }
    >
      {cards.map(renderCard)}
    </div>
  )

  return (
    <div className={styles.optionsEditor}>
      {isSequence ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cards.map((card) => card.id)} strategy={rectSortingStrategy}>
            {grid}
          </SortableContext>
        </DndContext>
      ) : (
        grid
      )}
    </div>
  )
}

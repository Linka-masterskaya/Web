import {
  getSequenceElements,
  readSetPageAnswers,
  type TSetPage,
  useSetEditorStore,
} from '@entities/set'
import { Button } from '@mantine/core'
import { CardGridCard } from '@shared/ui/assignment-card'
import { Icon } from '@shared/ui/icon'
import styles from '../set-edit-page.module.scss'
import { GridCardImage } from './grid-card-image'

export const SetEditorOptions: React.FC<{ page: TSetPage }> = ({ page }) => {
  const { selectedCardId, selectCard, toggleAnswer, moveSequence } = useSetEditorStore()
  const isSequence = page.type === 'sequence'
  const cards = isSequence ? getSequenceElements(page) : page.elements
  const correct = new Set(
    readSetPageAnswers(page)
      .filter((answer) => answer.is_correct)
      .map((answer) => answer.element_id),
  )
  const selectedIndex = cards.findIndex((card) => card.id === selectedCardId)
  const columns = cards.length <= 4 ? 2 : cards.length <= 9 ? 3 : 4

  return (
    <div className={styles.optionsEditor}>
      {isSequence && (
        <div className={styles.sequenceActions}>
          <Button
            variant="outline"
            disabled={selectedIndex <= 0}
            onClick={() => selectedCardId && moveSequence(page.id, selectedCardId, -1)}
          >
            Переместить назад
          </Button>
          <Button
            variant="outline"
            disabled={selectedIndex < 0 || selectedIndex === cards.length - 1}
            onClick={() => selectedCardId && moveSequence(page.id, selectedCardId, 1)}
          >
            Переместить вперёд
          </Button>
        </div>
      )}
      <div
        className={styles.optionsGrid}
        style={{ '--option-columns': columns } as React.CSSProperties}
      >
        {cards.map((card, index) => {
          const type = card.card_type
          const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'
          const label = `Карточка ${index + 1}${card.value ? `: ${card.value}` : ''}`
          return (
            <div className={styles.optionCard} key={card.id}>
              <CardGridCard
                cardType={cardType}
                title={card.value}
                media={cardType === 'normal' ? <GridCardImage card={card} /> : undefined}
                active={selectedCardId === card.id}
                ariaLabel={label}
                onClick={() => selectCard(card.id)}
                indicator={isSequence ? { type: 'order', value: index + 1 } : undefined}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

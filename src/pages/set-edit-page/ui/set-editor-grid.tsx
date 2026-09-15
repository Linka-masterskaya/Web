import type { TSetPage } from '@entities/set'
import { CardGrid } from '@shared/ui/card-grid'
import styles from '../set-edit-page.module.scss'
import { GridCardImage } from './grid-card-image'

export const SetEditorGrid: React.FC<{
  page: TSetPage
  rows: number
  columns: number
  selectedCardId: string | null
  onSelect: (id: string) => void
}> = ({ page, rows, columns, selectedCardId, onSelect }) => (
  <CardGrid
    mode="plain"
    minRowHeight={140}
    className={styles.editorGrid}
    size={{ rows, cols: columns }}
    selectedCardId={selectedCardId}
    onCardClick={onSelect}
    cards={Array.from({ length: rows * columns }, (_, index) => {
      const card = page.elements[index]
      if (!card) {
        return { id: `slot:${index}`, ariaLabel: `Добавить карточку ${index + 1}` }
      }
      const type = card.card_type
      const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'
      return {
        id: card.id,
        title: card.value,
        cardType,
        ariaLabel: `Карточка ${index + 1}${card.value ? `: ${card.value}` : ''}`,
        media: cardType === 'normal' ? <GridCardImage card={card} /> : undefined,
      }
    })}
  />
)

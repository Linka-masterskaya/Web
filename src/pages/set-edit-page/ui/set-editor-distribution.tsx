import { readSetPageCategories, type TSetPage } from '@entities/set'
import { DistributionGrid, type TDistributionGridItem } from '@shared/ui/distribution-grid'
import styles from '../set-edit-page.module.scss'
import { GridCardImage } from './grid-card-image'

const toCard = (page: TSetPage, elementId: string): TDistributionGridItem => {
  const card = page.elements.find((element) => element.id === elementId)
  if (!card) {
    return { id: elementId, cardType: 'text' as const, title: '' }
  }
  const type = card.card_type
  const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'
  return {
    id: card.id,
    title: card.value,
    cardType,
    ariaLabel: card.value ? card.value : 'Карточка',
    media: cardType === 'normal' ? <GridCardImage card={card} /> : undefined,
  }
}

export const SetEditorDistribution: React.FC<{
  page: TSetPage
  itemCount: number
  selectedCardId: string | null
  onSelect: (id: string) => void
}> = ({ page, itemCount, selectedCardId, onSelect }) => (
  <DistributionGrid
    className={styles.editorGrid}
    elementCount={itemCount}
    selectedCardId={selectedCardId}
    onCardClick={onSelect}
    categories={readSetPageCategories(page).map((category) => ({
      id: category.id,
      header: toCard(page, category.element_id ?? ''),
      items: category.items.map((id) => toCard(page, id)),
    }))}
  />
)

import { Flex, Text } from '@mantine/core'
import { Card } from '@shared/ui/card'
import clsx from 'clsx'
import styles from './library-cards.module.scss'
import type { TLibraryCardsProps } from './types'

export const LibraryCards: React.FC<TLibraryCardsProps> = ({ cards, selectedCards, onSelect }) => {
  if (cards.length === 0) {
    return <Text c="gray.6">В этой категории пока нет карточек</Text>
  }

  return (
    <Flex wrap="wrap" gap="lg">
      {cards.map((card) => {
        const isSelected = selectedCards.some((selectedCard) => selectedCard.id === card.id)

        return (
          <Card
            key={card.id}
            variant="image"
            label={card.title}
            imageSrc={card.image}
            imageAlt={card.title}
            className={clsx(styles.card, isSelected && styles.selected)}
            action={{ type: 'function', onClick: () => onSelect(card) }}
          />
        )
      })}
    </Flex>
  )
}

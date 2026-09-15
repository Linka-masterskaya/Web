import { Flex, Text } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { LibraryCardThumbnail } from './library-card-thumbnail'
import styles from './library-cards.module.scss'
import type { TLibraryCardsProps } from './types'

export const LibraryCards: React.FC<TLibraryCardsProps> = ({
  cards,
  selectedCards,
  onSelect,
  scrollToCard,
}) => {
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!scrollToCard?.id) {
      return
    }

    scrollTargetRef.current?.firstElementChild?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [scrollToCard?.id])

  if (cards.length === 0) {
    return <Text c="gray.6">В этой категории пока нет карточек</Text>
  }

  return (
    <Flex wrap="wrap" gap="lg" className={styles.wrap}>
      {cards.map((card) => {
        const isSelected = selectedCards.some((selectedCard) => selectedCard.id === card.id)

        return (
          <div
            key={card.id}
            ref={card.id === scrollToCard?.id ? scrollTargetRef : undefined}
            className={styles.scrollAnchor}
          >
            <LibraryCardThumbnail card={card} isSelected={isSelected} onSelect={onSelect} />
          </div>
        )
      })}
    </Flex>
  )
}

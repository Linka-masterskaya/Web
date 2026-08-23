import { Flex, Text } from '@mantine/core'
import { Card } from '@shared/ui/card'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import styles from './library-cards.module.scss'
import type { TLibraryCardsProps } from './types'

export const LibraryCards: React.FC<TLibraryCardsProps> = ({
  cards,
  selectedCards,
  onSelect,
  scrollToCard,
}) => {
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  // Прокрутка к карточке, выбранной через поиск: её ряд становится первым видимым.
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
            <Card
              variant="image"
              label={card.title}
              imageSrc={card.image}
              imageAlt={card.title}
              className={clsx(styles.card, isSelected && styles.selected)}
              action={{ type: 'function', onClick: () => onSelect(card) }}
            />
          </div>
        )
      })}
    </Flex>
  )
}

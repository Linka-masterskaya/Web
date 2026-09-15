import { Box, Stack, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { useState } from 'react'
import styles from './card-grid.module.scss'
import { CardGridCard } from './card-grid-card'
import type { TCardGridCardIndicator, TCardGridProps } from './types'

export const CardGrid: React.FC<TCardGridProps> = (props) => {
  const capacity = props.size.rows * props.size.cols
  const slots = Array.from({ length: capacity }, (_, index) => props.cards[index] ?? null)

  const [activeId, setActiveId] = useState<string | null>(null)
  const highlightedId =
    props.selectedCardId !== undefined
      ? props.selectedCardId
      : (activeId ?? (props.mode === 'single' ? props.value : null))

  const handleCardClick = (id: string) => {
    setActiveId(id)

    switch (props.mode) {
      case 'plain':
      case 'order':
        props.onCardClick?.(id)
        return
      case 'multi': {
        const wasSelected = props.value.includes(id)

        props.onChange(
          wasSelected
            ? props.value.filter((selectedId) => selectedId !== id)
            : [...props.value, id],
        )
        return
      }
      case 'single':
        props.onChange(id)
    }
  }

  const getCardIndicator = (id: string, index: number): TCardGridCardIndicator | undefined => {
    switch (props.mode) {
      case 'plain':
        return undefined
      case 'order':
        return {
          type: 'order',
          value: index + 1,
        }
      case 'multi':
        return {
          type: 'check',
          selected: props.value.includes(id),
          selectedActive: activeId === id,
        }
      case 'single':
        return {
          type: 'check',
          selected: props.value === id,
        }
    }
  }

  return (
    <Stack className={clsx(styles.container, props.className)}>
      {props.title && (
        <Title className={styles.title} order={1}>
          {props.title}
        </Title>
      )}

      <Box
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${props.size.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${props.size.rows}, minmax(${props.minRowHeight ?? 0}px, 1fr))`,
        }}
      >
        {slots.map((card, index) => {
          if (!card) {
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: пустые ячейки сетки позиционные и не переупорядочиваются
                key={`empty-${index}`}
                className={clsx(styles.card, styles.cardEmpty)}
                aria-hidden="true"
              >
                <Icon name="Image" size={44} className={styles.placeholderIcon} />
              </div>
            )
          }

          return (
            <CardGridCard
              key={card.id}
              cardType={card.cardType}
              media={card.media}
              ariaLabel={card.ariaLabel}
              imageSrc={card.imageSrc}
              title={card.title}
              active={highlightedId === card.id}
              indicator={getCardIndicator(card.id, index)}
              onClick={() => handleCardClick(card.id)}
            />
          )
        })}
      </Box>
    </Stack>
  )
}

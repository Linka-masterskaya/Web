import { Box, Stack, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { type CSSProperties, useState } from 'react'
import styles from './card-grid.module.scss'
import { CardGridCard } from './card-grid-card'
import type { TCardGridCardIndicator, TCardGridProps } from './types'

type TGridStyle = CSSProperties & {
  '--card-grid-cols': string
  '--card-grid-rows': string
  '--card-grid-title-height': string
}

export const CardGrid: React.FC<TCardGridProps> = (props) => {
  const capacity = props.size.rows * props.size.cols
  const slots = Array.from({ length: capacity }, (_, index) => props.cards[index] ?? null)

  const [focusedId, setFocusedId] = useState<string | null>(null)
  const highlightedId = props.mode === 'single' ? props.value : focusedId

  const gridStyle: TGridStyle = {
    '--card-grid-cols': String(props.size.cols),
    '--card-grid-rows': String(props.size.rows),
    '--card-grid-title-height': '188px',
  }

  const handleCardClick = (id: string) => {
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
          selectedActive: focusedId === id,
        }
      case 'single':
        return {
          type: 'check',
          selected: props.value === id,
        }
    }
  }

  return (
    <Stack className={clsx(styles.container, props.className)} style={gridStyle}>
      {props.title && (
        <Title className={styles.title} order={1}>
          {props.title}
        </Title>
      )}

      <Box className={styles.grid}>
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
              imageSrc={card.imageSrc}
              title={card.title}
              active={highlightedId === card.id}
              indicator={getCardIndicator(card.id, index)}
              onClick={() => handleCardClick(card.id)}
              onFocus={() => setFocusedId(card.id)}
              onBlur={() => setFocusedId(null)}
            />
          )
        })}
      </Box>
    </Stack>
  )
}

import { Box, Stack, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { type CSSProperties, useEffect, useState } from 'react'
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

  const [activeId, setActiveId] = useState<string | null>(null)

  const gridStyle: TGridStyle = {
    '--card-grid-cols': String(props.size.cols),
    '--card-grid-rows': String(props.size.rows),
    '--card-grid-title-height': '188px',
  }

  const isSelected = (id: string) => {
    if (props.mode === 'single') {
      return props.value === id
    }

    if (props.mode === 'multi') {
      return props.value.includes(id)
    }

    return false
  }

  const singleValue = props.mode === 'single' ? props.value : null

  useEffect(() => {
    if (!activeId) {
      return
    }

    const existsInCards = props.cards.some((card) => card.id === activeId)

    if (!existsInCards) {
      setActiveId(null)
    }
  }, [activeId, props.cards])

  useEffect(() => {
    if (props.mode !== 'single') {
      return
    }

    setActiveId(singleValue || null)
  }, [props.mode, singleValue])

  const handleCardClick = (id: string) => {
    switch (props.mode) {
      case 'plain':
      case 'order':
        setActiveId(id)
        props.onCardClick?.(id)
        return
      case 'multi': {
        const wasSelected = props.value.includes(id)

        props.onChange(
          wasSelected
            ? props.value.filter((selectedId) => selectedId !== id)
            : [...props.value, id],
        )
        setActiveId(id)
        return
      }
      case 'single':
        props.onChange(id)
        setActiveId(id)
    }
  }

  const getCardIndicator = (id: string, index: number): TCardGridCardIndicator | undefined => {
    if (props.mode === 'plain') {
      return undefined
    }

    if (props.mode === 'order') {
      return {
        type: 'order',
        value: index + 1,
      }
    }

    return {
      type: 'check',
      selected: isSelected(id),
      selectedActive: props.mode === 'multi' && activeId === id,
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
              active={activeId === card.id}
              indicator={getCardIndicator(card.id, index)}
              onClick={() => handleCardClick(card.id)}
              onFocus={() => setActiveId(card.id)}
            />
          )
        })}
      </Box>
    </Stack>
  )
}

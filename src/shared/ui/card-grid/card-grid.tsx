import { Box, Stack, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { type CSSProperties, useEffect, useState } from 'react'
import styles from './card-grid.module.scss'
import type { TCardGridProps } from './types'

type TGridStyle = CSSProperties & {
  '--card-grid-cols': string
  '--card-grid-rows': string
  '--card-grid-title-height': string
}

export const CardGrid: React.FC<TCardGridProps> = (props) => {
  const capacity = props.size.rows * props.size.cols
  const slots = Array.from({ length: capacity }, (_, index) => props.cards[index] ?? null)

  const gridStyle: TGridStyle = {
    '--card-grid-cols': String(props.size.cols),
    '--card-grid-rows': String(props.size.rows),
    '--card-grid-title-height': '188px',
  }

  const [activeId, setActiveId] = useState<string | null>(null)

  const isSelected = (id: string) =>
    props.isMultiselect ? props.value.includes(id) : props.value === id

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
    if (props.isMultiselect) {
      return
    }

    setActiveId(props.value || null)
  }, [props.isMultiselect, props.value])

  const handleCardClick = (id: string) => {
    if (props.isMultiselect) {
      const wasSelected = props.value.includes(id)

      if (wasSelected) {
        props.onChange(props.value.filter((selectedId) => selectedId !== id))
        setActiveId(id)
        return
      }

      props.onChange([...props.value, id])
      setActiveId(id)
      return
    }

    props.onChange(id)
    setActiveId(id)
  }

  const handleCardFocus = (event: React.FocusEvent<HTMLButtonElement>, id: string) => {
    if (event.currentTarget.matches(':focus-visible')) {
      setActiveId(id)
    }
  }

  return (
    <Stack className={styles.container} style={gridStyle}>
      <Title className={styles.title} order={1}>
        {props.title}
      </Title>

      <Box className={styles.grid}>
        {slots.map((card, index) => {
          if (!card) {
            return (
              <div
                key={`empty-${index}`}
                className={clsx(styles.card, styles.cardEmpty)}
                aria-hidden="true"
              >
                <Icon name="Image" size={44} className={styles.placeholderIcon} />
              </div>
            )
          }

          const selected = isSelected(card.id)
          const isActive = activeId === card.id

          return (
            <button
              key={card.id}
              type="button"
              className={clsx(styles.card, isActive && styles.cardActive)}
              onClick={() => handleCardClick(card.id)}
              onFocus={(event) => handleCardFocus(event, card.id)}
              aria-pressed={selected}
              aria-label={`Карточка ${card.id}`}
            >
              <img className={styles.image} src={card.imageSrc} alt="" />
              <span
                className={clsx(
                  styles.check,
                  selected &&
                    (isActive && props.isMultiselect
                      ? styles.checkSelectedActive
                      : styles.checkSelected),
                )}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </Box>
    </Stack>
  )
}

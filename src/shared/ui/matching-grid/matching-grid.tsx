import clsx from 'clsx'
import { useState } from 'react'
import styles from './matching-grid.module.scss'
import type { TMatchingGridProps } from './types'

export const MatchingGrid: React.FC<TMatchingGridProps> = ({
  className,
  elements,
  elementCount,
  value,
  onChange,
}) => {
  const visibleElements = elements.slice(0, elementCount)

  const [focusedId, setFocusedId] = useState<string | null>(null)
  const highlightedId = focusedId ?? value

  return (
    <div
      className={clsx(styles.grid, className)}
      role="listbox"
      aria-label="Сетка заданий на соответствие"
    >
      {visibleElements.map((element) => {
        const isSelected = element.id === value
        const isHighlighted = element.id === highlightedId

        return (
          <button
            key={element.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={clsx(styles.row, isHighlighted && styles.rowHighlighted)}
            onClick={() => onChange(element.id)}
            onFocus={() => setFocusedId(element.id)}
            onBlur={() => setFocusedId(null)}
          >
            <span className={styles.card}>
              <img className={styles.image} src={element.imageSrc} alt={element.title} />
            </span>

            <span className={styles.connectorCard} aria-hidden="true">
              <svg
                className={styles.connectorIcon}
                viewBox="0 0 64 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="0" cy="8" r="4" fill="currentColor" />
                <line x1="0" y1="8" x2="64" y2="8" stroke="currentColor" strokeWidth="1" />
                <circle cx="64" cy="8" r="4" fill="currentColor" />
              </svg>
            </span>

            <span className={clsx(styles.card, styles.title)} title={element.title}>
              {element.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}

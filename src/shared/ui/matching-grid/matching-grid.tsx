import clsx from 'clsx'
import { CardGridCard } from '../assignment-card'
import styles from './matching-grid.module.scss'
import type { TMatchingGridProps } from './types'

export const MatchingGrid: React.FC<TMatchingGridProps> = ({
  className,
  elements,
  pairs,
  selectedCardId,
  onSelect,
}) => {
  const elementMap = new Map(elements.map((element) => [element.id, element]))

  return (
    <div className={clsx(styles.grid, className)}>
      {pairs.map((pair) => {
        const left = elementMap.get(pair.leftId)
        const right = elementMap.get(pair.rightId)

        if (!left || !right) {
          return null
        }

        return (
          <div key={`${pair.leftId}-${pair.rightId}`} className={styles.row}>
            <CardGridCard
              cardType={left.cardType}
              media={left.media}
              imageSrc={left.imageSrc}
              title={left.title}
              ariaLabel={left.ariaLabel}
              active={selectedCardId === left.id}
              onClick={() => onSelect?.(left.id)}
            />

            <span className={styles.connectorCard} aria-hidden="true">
              <svg
                className={styles.connectorIcon}
                viewBox="0 0 64 18"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="0" cy="8" r="4" fill="currentColor" />
                <line x1="0" y1="8" x2="64" y2="8" stroke="currentColor" strokeWidth="1" />
                <circle cx="64" cy="8" r="4" fill="currentColor" />
              </svg>
            </span>

            <CardGridCard
              cardType={right.cardType}
              media={right.media}
              imageSrc={right.imageSrc}
              title={right.title}
              ariaLabel={right.ariaLabel}
              active={selectedCardId === right.id}
              onClick={() => onSelect?.(right.id)}
            />
          </div>
        )
      })}
    </div>
  )
}

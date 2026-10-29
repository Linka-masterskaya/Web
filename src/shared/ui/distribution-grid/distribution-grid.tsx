import { CardGridCard } from '@shared/ui/assignment-card'
import clsx from 'clsx'
import styles from './distribution-grid.module.scss'
import type { TDistributionGridItem, TDistributionGridProps } from './types'

/*
  Пределы типа «Распределение» — те же, что задаёт `getSetPageStructure` для страницы
  типа `categories` (там это `primaryMax` и `secondaryMax`). Компонент держит их сам,
  чтобы не отрисовать структуру, которую домен не допускает.
*/
const MAX_CATEGORIES = 100
const MIN_ITEMS_PER_CATEGORY = 1
const MAX_ITEMS_PER_CATEGORY = 100

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * Колонки распределения: сверху шапка-карточка, под ней варианты.
 * Клик только сообщает id выбранной карточки (шапка или вариант).
 */
export const DistributionGrid: React.FC<TDistributionGridProps> = ({
  className,
  categories,
  elementCount,
  selectedCardId = null,
  onCardClick,
}) => {
  const visibleCategories = categories.slice(0, MAX_CATEGORIES)
  const declaredItems = clamp(elementCount, MIN_ITEMS_PER_CATEGORY, MAX_ITEMS_PER_CATEGORY)

  const getVisibleItems = (items: TDistributionGridItem[]) => items.slice(0, MAX_ITEMS_PER_CATEGORY)

  // Ряды считаем по заявленному максимуму; фактический поднимает планку только если
  // карточек в колонке больше — тогда сетка сжимается, но контент не теряется.
  const renderedCounts = visibleCategories.map((category) => getVisibleItems(category.items).length)
  const rowCount = Math.max(declaredItems, ...renderedCounts, 0) + 1
  const columnCount = Math.max(1, visibleCategories.length)
  const columnGap = Math.max(16, Math.round(100 / Math.max(1, columnCount - 1)))

  return (
    <div
      className={clsx(styles.grid, className)}
      style={{ ['--column-gap' as string]: `${columnGap}px` }}
    >
      {visibleCategories.map((category) => (
        <div
          key={category.id}
          className={styles.column}
          style={{ gridTemplateRows: `repeat(${rowCount}, minmax(140px, 1fr))` }}
        >
          <CardGridCard
            cardType={category.header.cardType}
            media={category.header.media}
            ariaLabel={category.header.ariaLabel}
            imageSrc={category.header.imageSrc}
            title={category.header.title}
            active={category.header.id === selectedCardId}
            onClick={() => onCardClick?.(category.header.id)}
          />

          {getVisibleItems(category.items).map((item) => (
            <CardGridCard
              key={item.id}
              cardType={item.cardType}
              media={item.media}
              ariaLabel={item.ariaLabel}
              imageSrc={item.imageSrc}
              title={item.title}
              active={item.id === selectedCardId}
              onClick={() => onCardClick?.(item.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

import clsx from 'clsx'
import { useState } from 'react'
import styles from './distribution-grid.module.scss'
import type { TDistributionGridProps } from './types'

/*
  Пределы типа «Распределение» — те же, что задаёт `getSetPageStructure` для страницы
  типа `categories` (там это `primaryMax` и `secondaryMax`). Компонент держит их сам,
  чтобы не отрисовать структуру, которую домен не допускает.
*/
const MAX_CATEGORIES = 8
const MIN_ITEMS_PER_CATEGORY = 1
const MAX_ITEMS_PER_CATEGORY = 12

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * Распределение по категориям: колонка на категорию, сверху карточка категории,
 * под ней — карточки вариантов ответа.
 *
 * Карточка варианта — только картинка, без подписи: название доступно ассистивным
 * технологиям через `alt` и всплывает подсказкой при наведении (`title`).
 *
 * Размер карточки задаёт `elementCount`: колонка делится на `elementCount + 1` равных
 * рядов (`grid-template-rows`), поэтому при переносе карточка не растягивается и не
 * сжимается — она просто занимает такой же ряд в другой колонке.
 *
 * Если в колонке оказалось больше вариантов, чем заявлено в `elementCount`, ряды
 * добавляются по факту: карточки сжимаются, но ничего не пропадает. Поэтому размер
 * остаётся константой, пока данные не вышли за заявленный максимум.
 *
 * Сверху зажаты только пределы типа: не больше `MAX_CATEGORIES` колонок и не больше
 * `MAX_ITEMS_PER_CATEGORY` вариантов в колонке — вот это уже отбрасывается.
 *
 * Перетаскивания нет: карточка отмечается кликом (`value`), пока отметка стоит —
 * остальные карточки недоступны для выбора; повторный клик по отмеченной снимает
 * отметку. Клик по карточке категории переносит отмеченный вариант в её колонку.
 */
export const DistributionGrid: React.FC<TDistributionGridProps> = ({
  className,
  elements,
  categories,
  elementCount,
  value,
  onChange,
  onAssign,
}) => {
  const elementById = new Map(elements.map((element) => [element.id, element]))

  const [focusedId, setFocusedId] = useState<string | null>(null)
  const highlightedId = focusedId ?? value

  const hasSelection = Boolean(value)
  const isCategoryEnabled = hasSelection && onAssign != null

  const visibleCategories = categories.slice(0, MAX_CATEGORIES)
  const declaredItems = clamp(elementCount, MIN_ITEMS_PER_CATEGORY, MAX_ITEMS_PER_CATEGORY)

  const getVisibleItems = (items: string[]) =>
    items.slice(0, MAX_ITEMS_PER_CATEGORY).filter((id) => elementById.has(id))

  // Ряды считаем по заявленному максимуму; фактический поднимает планку только если
  // карточек в колонке больше — тогда сетка сжимается, но контент не теряется.
  const renderedCounts = visibleCategories.map((category) => getVisibleItems(category.items).length)
  const rowCount = Math.max(declaredItems, ...renderedCounts) + 1

  return (
    <div className={clsx(styles.grid, className)}>
      {visibleCategories.map((category) => (
        <div
          key={category.id}
          className={styles.column}
          style={{ gridTemplateRows: `repeat(${rowCount}, 1fr)` }}
        >
          <button
            type="button"
            className={styles.categoryName}
            disabled={!isCategoryEnabled}
            onClick={() => onAssign?.(value, category.id)}
          >
            {category.name}
          </button>

          {getVisibleItems(category.items).map((elementId) => {
            const element = elementById.get(elementId)

            if (!element) {
              return null
            }

            const isSelected = element.id === value
            const isHighlighted = element.id === highlightedId

            return (
              <button
                key={element.id}
                type="button"
                title={element.title}
                aria-pressed={isSelected}
                disabled={hasSelection && !isSelected}
                className={clsx(styles.card, isHighlighted && styles.cardHighlighted)}
                onClick={() => onChange(isSelected ? '' : element.id)}
                onFocus={() => setFocusedId(element.id)}
                onBlur={() => setFocusedId(null)}
              >
                <span className={styles.cardImage}>
                  <img className={styles.image} src={element.imageSrc} alt={element.title} />
                </span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

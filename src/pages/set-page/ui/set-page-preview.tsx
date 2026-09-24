import {
  getSequenceElements,
  readSetPageCategories,
  readSetPagePairs,
  type TSetPage,
  type TSetPageElement,
} from '@entities/set'
import { FitText } from '@shared/ui/assignment-card'
import { PictureImage } from '@shared/ui/picture-image/picture-image'
import clsx from 'clsx'
import type { CSSProperties, ReactNode } from 'react'
import styles from './set-page-preview.module.scss'

/** Сколько элементов страницы показываем в миниатюре. */
const MAX_PREVIEW_ITEMS = 12
const MAX_PREVIEW_PAIRS = 6
const MAX_PREVIEW_CATEGORIES = 4
const MAX_PREVIEW_CATEGORY_ITEMS = 4

const getElementText = (element: TSetPageElement | undefined) => element?.value?.trim() ?? ''

const getElementImageSrc = (element: TSetPageElement | undefined) => {
  if (!element || element.card_type === 'empty' || element.card_type === 'space') {
    return ''
  }

  return element.media_url?.trim() ?? ''
}

/** Число колонок ближе к квадрату: 1→1, 2–4→2, 5–9→3, 10–12→4. */
const getNearSquareColumns = (count: number) => Math.max(1, Math.ceil(Math.sqrt(count)))

const PreviewElement: React.FC<{ element?: TSetPageElement }> = ({ element }) => {
  if (element?.card_type === 'empty') {
    return <span className={styles.tile} />
  }

  if (element?.card_type === 'space') {
    return (
      <span className={styles.tile}>
        <FitText text="␣" minFontSize={6} />
      </span>
    )
  }

  const pictureId = element?.source_picture_id ?? undefined
  if (pictureId && element && element.card_type !== 'text') {
    return (
      <span className={styles.tile}>
        <PictureImage pictureId={pictureId} alt="" className={styles.tileImage} />
      </span>
    )
  }
  const imageSrc = getElementImageSrc(element)

  if (imageSrc) {
    return (
      <span className={styles.tile}>
        <img className={styles.tileImage} src={imageSrc} alt="" />
      </span>
    )
  }

  const text = getElementText(element)

  return (
    <span className={clsx(styles.tile, !text && styles.tileEmpty)}>
      {text && <FitText text={text} minFontSize={6} />}
    </span>
  )
}

const createElementIndex = (page: TSetPage) =>
  new Map(page.elements.map((element) => [element.id, element]))

/** Плиточная раскладка ближе к квадрату по числу элементов. */
const GridPreview: React.FC<{
  elements: TSetPageElement[]
  renderBadge?: (element: TSetPageElement, index: number) => ReactNode
}> = ({ elements, renderBadge }) => {
  const items = elements.slice(0, MAX_PREVIEW_ITEMS)
  const columns = getNearSquareColumns(items.length)

  return (
    <span
      className={styles.gridLayout}
      style={{ '--preview-columns': columns } as CSSProperties}
    >
      {items.map((element, index) => (
        <span key={element.id} className={styles.gridItem}>
          <PreviewElement element={element} />
          {renderBadge?.(element, index)}
        </span>
      ))}
    </span>
  )
}

/** Тип «Сопоставление»: строки из двух связанных элементов. */
const MatchingPreview: React.FC<{ page: TSetPage }> = ({ page }) => {
  const elementById = createElementIndex(page)

  return (
    <span className={styles.matchingLayout}>
      {readSetPagePairs(page)
        .slice(0, MAX_PREVIEW_PAIRS)
        .map((pair) => (
          <span key={`${pair.left_id}:${pair.right_id}`} className={styles.matchingRow}>
            <PreviewElement element={elementById.get(pair.left_id)} />
            <span className={styles.matchingLink} />
            <PreviewElement element={elementById.get(pair.right_id)} />
          </span>
        ))}
    </span>
  )
}

/** Тип «Распределение»: колонки категорий с элементами. */
const CategoriesPreview: React.FC<{ page: TSetPage }> = ({ page }) => {
  const elementById = createElementIndex(page)

  return (
    <span className={styles.categoriesLayout}>
      {readSetPageCategories(page)
        .slice(0, MAX_PREVIEW_CATEGORIES)
        .map((category) => (
          <span key={category.id} className={styles.categoryColumn}>
            <PreviewElement element={elementById.get(category.element_id ?? '')} />
            {category.items.slice(0, MAX_PREVIEW_CATEGORY_ITEMS).map((elementId) => (
              <PreviewElement key={elementId} element={elementById.get(elementId)} />
            ))}
          </span>
        ))}
    </span>
  )
}

const renderPreview = (page: TSetPage) => {
  switch (page.type) {
    case 'matching':
      return <MatchingPreview page={page} />

    case 'categories':
      return <CategoriesPreview page={page} />

    case 'sequence':
      return (
        <GridPreview
          elements={getSequenceElements(page)}
          renderBadge={(_, index) => <span className={styles.orderBadge}>{index + 1}</span>}
        />
      )

    case 'single_choice':
    case 'multi_choice':
    case 'grid':
      return <GridPreview elements={page.elements} />

    default:
      return <GridPreview elements={page.elements} />
  }
}

/**
 * Миниатюра страницы набора: лёгкая CSS-раскладка по типу страницы.
 * Декоративная — доступное описание даёт карточка.
 */
export const SetPagePreview: React.FC<{ page: TSetPage }> = ({ page }) => (
  <span className={styles.preview} aria-hidden="true">
    {renderPreview(page)}
  </span>
)

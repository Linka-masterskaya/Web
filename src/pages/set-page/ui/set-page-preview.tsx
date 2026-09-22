import {
  readSetPageAnswers,
  readSetPageCategories,
  readSetPagePairs,
  readSetPageSequence,
  type TSetPage,
  type TSetPageElement,
} from '@entities/set'
import { PictureImage } from '@shared/ui/picture-image/picture-image'
import clsx from 'clsx'
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

const PreviewElement: React.FC<{ element?: TSetPageElement }> = ({ element }) => {
  if (element?.card_type === 'empty' || element?.card_type === 'space') {
    return <span className={styles.tile} />
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
      {text && <span className={styles.tileText}>{text}</span>}
    </span>
  )
}

const createElementIndex = (page: TSetPage) =>
  new Map(page.elements.map((element) => [element.id, element]))

/** Тип «Сетка»: элементы раскладываются плиткой. */
const GridPreview: React.FC<{ page: TSetPage }> = ({ page }) => (
  <span className={styles.gridLayout}>
    {page.elements.slice(0, MAX_PREVIEW_ITEMS).map((element) => (
      <PreviewElement key={element.id} element={element} />
    ))}
  </span>
)

/** Типы «Один ответ» и «Несколько ответов»: список вариантов с маркерами. */
const ChoicePreview: React.FC<{ page: TSetPage; isMultiple: boolean }> = ({ page, isMultiple }) => {
  const correctElementIds = new Set(
    readSetPageAnswers(page)
      .filter((answer) => answer.is_correct)
      .map((answer) => answer.element_id),
  )

  return (
    <span className={styles.listLayout}>
      {page.elements.slice(0, MAX_PREVIEW_ITEMS).map((element) => (
        <span key={element.id} className={styles.listRow}>
          <span
            className={clsx(
              styles.marker,
              isMultiple && styles.markerSquare,
              correctElementIds.has(element.id) && styles.markerCorrect,
            )}
          />
          <span className={styles.listText}>{getElementText(element)}</span>
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

/** Тип «Последовательность»: нумерованный список в порядке `sequence`. */
const SequencePreview: React.FC<{ page: TSetPage }> = ({ page }) => {
  const orderByElementId = new Map(
    readSetPageSequence(page).map((item) => [item.element_id, item.order]),
  )
  const orderedElements = [...page.elements].sort(
    (a, b) => (orderByElementId.get(a.id) ?? 0) - (orderByElementId.get(b.id) ?? 0),
  )

  return (
    <span className={styles.listLayout}>
      {orderedElements.slice(0, MAX_PREVIEW_ITEMS).map((element, index) => (
        <span key={element.id} className={styles.listRow}>
          <span className={styles.orderBadge}>{index + 1}</span>
          <span className={styles.listText}>{getElementText(element)}</span>
        </span>
      ))}
    </span>
  )
}

const renderPreview = (page: TSetPage) => {
  switch (page.type) {
    case 'single_choice':
      return <ChoicePreview page={page} isMultiple={false} />

    case 'multi_choice':
      return <ChoicePreview page={page} isMultiple />

    case 'matching':
      return <MatchingPreview page={page} />

    case 'categories':
      return <CategoriesPreview page={page} />

    case 'sequence':
      return <SequencePreview page={page} />

    default:
      return <GridPreview page={page} />
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

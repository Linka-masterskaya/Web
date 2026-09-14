import { getSetPageTitle, type TSetPage } from '@entities/set'
import { SET_PAGE_TYPE_LABELS } from '@features/set-page-type-selector'
import clsx from 'clsx'
import type { MouseEvent as ReactMouseEvent } from 'react'
import styles from './set-page-card.module.scss'
import { SetPagePreview } from './set-page-preview'

type TSetPageCardProps = {
  page: TSetPage
  /** Позиция страницы в наборе — нужна для названия «Страница N». */
  index: number
  /** Страница лежит в буфере обмена в режиме «вырезать». */
  isCut: boolean
  onOpen: (page: TSetPage) => void
  onOpenContextMenu: (event: ReactMouseEvent<HTMLElement>, page: TSetPage) => void
}

/**
 * Карточка страницы набора: 334×371 = миниатюра 334×303 + зазор 16 + блок
 * с названием и типом страницы 334×52.
 *
 * Контекстное меню действий открывается кликом правой кнопки мыши.
 */
export const SetPageCard: React.FC<TSetPageCardProps> = ({
  page,
  index,
  isCut,
  onOpen,
  onOpenContextMenu,
}) => {
  const title = getSetPageTitle(page, index)
  const pageTypeLabel = SET_PAGE_TYPE_LABELS[page.type]

  return (
    <button
      type="button"
      className={clsx(styles.card, isCut && styles.cardCut)}
      onClick={() => onOpen(page)}
      onContextMenu={(event) => onOpenContextMenu(event, page)}
      aria-label={`Открыть страницу «${title}», ${pageTypeLabel}`}
    >
      <span className={styles.preview}>
        <SetPagePreview page={page} />
      </span>

      <span className={styles.info}>
        <span className={styles.title} title={title}>
          {title}
        </span>
        <span className={styles.subtitle}>{pageTypeLabel}</span>
      </span>
    </button>
  )
}

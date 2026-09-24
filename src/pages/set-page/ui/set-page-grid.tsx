import type { TSetPage } from '@entities/set'
import { ScrollArea, Text } from '@mantine/core'
import { ContextMenu, useContextMenu } from '@shared/ui/context-menu'
import { useMemo } from 'react'
import {
  createSetPageContextMenuConfig,
  type TSetPageContextMenuTarget,
} from '../model/context-menu-config'
import { useSetPageActions } from '../model/use-set-page-actions'
import { SetPageCard } from './set-page-card'
import styles from './set-page-grid.module.scss'

type TSetPageGridProps = {
  setId: string
  pages: TSetPage[]
  onOpenPage: (page: TSetPage) => void
}

/**
 * Сетка карточек страниц набора.
 *
 * Правый клик по карточке открывает меню с действиями над ней, правый клик по
 * пустому месту области — то же меню без цели: доступна только вставка, и она
 * добавляет страницу в конец набора.
 */
export const SetPageGrid: React.FC<TSetPageGridProps> = ({ setId, pages, onOpenPage }) => {
  const {
    clipboard,
    errorMessage,
    isPending,
    copyPage,
    cutPage,
    duplicatePage,
    deletePage,
    pastePage,
  } = useSetPageActions({ setId, pages })

  /*
    Здесь width — это только оценка ширины для клэмпа у края экрана.
    Сам блок меню размеряется по контенту (`max-content`).
  */
  const contextMenu = useContextMenu<TSetPageContextMenuTarget>({
    width: 160,
    estimatedHeight: 200,
  })

  const contextMenuItems = useMemo(
    () =>
      createSetPageContextMenuConfig({
        canPaste: clipboard !== null,
        disabled: isPending,
        onCopy: copyPage,
        onCut: cutPage,
        onDelete: deletePage,
        onDuplicate: duplicatePage,
        onPaste: pastePage,
      }),
    [clipboard, copyPage, cutPage, deletePage, duplicatePage, isPending, pastePage],
  )

  const cutPageId =
    clipboard?.mode === 'cut' && clipboard.sourceSetId === setId ? clipboard.page.id : null

  return (
    <div className={styles.root}>
      {errorMessage && (
        <Text className={styles.error} c="red.6" role="alert">
          {errorMessage}
        </Text>
      )}

      {/* Правый клик по пустому месту области карточек открывает меню без цели. */}
      <ScrollArea
        type="auto"
        scrollbars="y"
        className={styles.scrollArea}
        classNames={{ viewport: styles.viewport }}
        onContextMenu={(event) => {
          contextMenu.open(event, { page: null })
        }}
      >
        <div className={styles.grid}>
          {pages.map((page, index) => (
            <SetPageCard
              key={page.id}
              page={page}
              index={index}
              isCut={page.id === cutPageId}
              onOpen={onOpenPage}
              onOpenContextMenu={(event, targetPage) => {
                // Цель — конкретная карточка; в обработчик области событие не отдаём.
                event.stopPropagation()
                contextMenu.open(event, { page: targetPage })
              }}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Меню живёт вне области прокрутки: якорь позиционируется от viewport. */}
      <ContextMenu<TSetPageContextMenuTarget> items={contextMenuItems} {...contextMenu.menuProps} />
    </div>
  )
}

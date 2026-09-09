import type {
  TFolderContentItem,
  TPackContentItem,
  TSectionContentItem,
} from '@entities/section-content'
import { Blockquote, ScrollArea } from '@mantine/core'
import gridStyles from '@shared/styles/stretch-card-grid.module.scss'
import { Card } from '@shared/ui/card'
import { ContextMenu, type TContextMenuItem, useContextMenu } from '@shared/ui/context-menu'
import { Icon } from '@shared/ui/icon'
import type { FC, MouseEvent as ReactMouseEvent } from 'react'
import styles from './section-contents-cards.module.scss'

type TBackCardAction =
  | {
      type: 'function'
      onClick: () => void
    }
  | {
      type: 'link'
      href: string
    }

type TSectionContentsCardProps = {
  items: readonly TSectionContentItem[]
  backAction: TBackCardAction
  emptyText: string
  onOpenFolder: (folder: TFolderContentItem) => void
  onOpenPack: (pack: TPackContentItem) => void
  packContextMenuItems?: readonly TContextMenuItem<TPackContentItem>[]
}

const isFolderContentItem = (item: TSectionContentItem): item is TFolderContentItem =>
  item.type === 'folder'

const isPackContentItem = (item: TSectionContentItem): item is TPackContentItem =>
  item.type === 'pack'

const getSectionContentIconName = (item: TSectionContentItem) => {
  if (item.type === 'pack') {
    return 'Image'
  } else if (item.kind === 'student') {
    return 'UserRound'
  } else {
    return 'Folder' // в дизайне нет варианта, когда у набора нет картинки, я пока поставила это
  }
}

export const SectionContentsCards: FC<TSectionContentsCardProps> = ({
  items,
  backAction,
  emptyText,
  onOpenFolder,
  onOpenPack,
  packContextMenuItems = [],
}) => {
  const contextMenu = useContextMenu<TPackContentItem>({
    width: 235,
    estimatedHeight: 130,
    viewportMargin: 8,
  })

  return (
    <section aria-label="Содержимое папки" className={styles.root}>
      {items.length === 0 && (
        <Blockquote
          className={styles.emptyText}
          color="blue"
          icon={<Icon name="Info" aria-hidden="true" />}
          iconSize={32}
        >
          {emptyText}
        </Blockquote>
      )}

      <ScrollArea
        type="auto"
        scrollbars="y"
        className={styles.scrollArea}
        classNames={{ viewport: styles.viewport }}
      >
        <div className={gridStyles.grid}>
          <Card
            fill
            className={gridStyles.card}
            variant="icon"
            label="Вернуться назад"
            icon={<Icon name="CornerUpLeft" aria-hidden="true" />}
            action={backAction}
          />
          {items.map((item) => {
            const handleClick = () => {
              if (isFolderContentItem(item)) {
                onOpenFolder(item)
                return
              }
              if (isPackContentItem(item)) {
                onOpenPack(item)
              }
            }

            const onContextMenu =
              isPackContentItem(item) && packContextMenuItems.length > 0
                ? (event: ReactMouseEvent<HTMLElement>) => {
                    contextMenu.open(event, item)
                  }
                : undefined

            return (
              <Card
                key={`${item.type}:${item.id}`}
                fill
                variant="icon"
                label={item.name}
                icon={<Icon name={getSectionContentIconName(item)} aria-hidden="true" />}
                action={{ type: 'function', onClick: handleClick }}
                className={gridStyles.card}
                onContextMenu={onContextMenu}
              />
            )
          })}
        </div>
      </ScrollArea>
      <ContextMenu<TPackContentItem> items={packContextMenuItems} {...contextMenu.menuProps} />
    </section>
  )
}

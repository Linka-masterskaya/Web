import type {
  TFolderContentItem,
  TPackContentItem,
  TSectionContentItem,
} from '@entities/section-content'
// TODO: вернуть после бэкенда is_favorite на contents
// import { useToggleSetFavorite } from '@entities/set'
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
  folderContextMenuItems?: readonly TContextMenuItem<TFolderContentItem>[]
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
  folderContextMenuItems = [],
}) => {
  const contextMenu = useContextMenu<TPackContentItem>()
  const folderContextMenu = useContextMenu<TFolderContentItem>()
  // TODO: вернуть после бэкенда is_favorite на contents
  // const { mutate: toggleFavorite } = useToggleSetFavorite()

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
              isFolderContentItem(item) && folderContextMenuItems.length > 0
                ? (event: ReactMouseEvent<HTMLElement>) => {
                    folderContextMenu.open(event, item)
                  }
                : isPackContentItem(item) && packContextMenuItems.length > 0
                  ? (event: ReactMouseEvent<HTMLElement>) => {
                      contextMenu.open(event, item)
                    }
                  : undefined

            const isPack = isPackContentItem(item)

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
                level={isPack ? (item.difficulty ?? undefined) : undefined}
                age={isPack ? (item.age ?? undefined) : undefined}
                // TODO: вернуть после бэкенда is_favorite на contents
                // favorite={
                //   isPack
                //     ? {
                //         isFavorite: item.isFavorite ?? false,
                //         onToggle: () => {
                //           toggleFavorite({
                //             setId: item.id,
                //             nextFavorite: !(item.isFavorite ?? false),
                //           })
                //         },
                //       }
                //     : undefined
                // }
              />
            )
          })}
        </div>
      </ScrollArea>

      <ContextMenu<TPackContentItem> items={packContextMenuItems} {...contextMenu.menuProps} />

      <ContextMenu<TFolderContentItem>
        items={folderContextMenuItems}
        {...folderContextMenu.menuProps}
      />
    </section>
  )
}

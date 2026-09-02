import type {
  TFolderContentItem,
  TPackContentItem,
  TSectionContentItem,
} from '@entities/section-content'
import { ScrollArea, Text } from '@mantine/core'
import { Card } from '@shared/ui/card'
import { Icon } from '@shared/ui/icon'
import type { FC } from 'react'
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
}) => {
  return (
    <section aria-label="Содержимое папки" className={styles.root}>
      <ScrollArea
        type="auto"
        scrollbars="y"
        className={styles.scrollArea}
        classNames={{ viewport: styles.viewport }}
      >
        <div className={styles.grid}>
          <Card
            className={styles.card}
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

            return (
              <div key={`${item.type}:${item.id}`}>
                <Card
                  variant="icon" //сейчас в ответе api нет информации про image, когда появится, можно будет заменить на:
                  // variant='image'
                  // imageSrc={item.preview_url}
                  // imageAlt={item.name}
                  label={item.name}
                  icon={<Icon name={getSectionContentIconName(item)} aria-hidden="true" />}
                  action={{ type: 'function', onClick: handleClick }}
                  className={styles.card}
                />
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {items.length === 0 && <Text mt="md">{emptyText}</Text>}
    </section>
  )
}

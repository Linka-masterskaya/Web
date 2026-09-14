import { useLibraryPictureContentUrl } from '@entities/library'
import { Center, Skeleton, Text } from '@mantine/core'
import { Card } from '@shared/ui/card'
import clsx from 'clsx'
import styles from './library-cards.module.scss'
import type { TLibraryCardThumbnailProps } from './types'

export const LibraryCardThumbnail: React.FC<TLibraryCardThumbnailProps> = ({
  card,
  isSelected,
  onSelect,
}) => {
  const { data: imageUrl, isLoading, isError } = useLibraryPictureContentUrl(card.id)

  if (isLoading) {
    return <Skeleton className={styles.card} />
  }

  if (isError || !imageUrl) {
    return (
      <Center className={clsx(styles.card, styles.thumbnailError)}>
        <Text c="gray.6" size="sm" ta="center" p="xs">
          Не удалось загрузить превью
        </Text>
      </Center>
    )
  }

  return (
    <Card
      variant="image"
      label={card.title}
      imageSrc={imageUrl}
      imageAlt={card.title}
      className={clsx(styles.card, isSelected && styles.selected)}
      action={{ type: 'function', onClick: () => onSelect(card) }}
    />
  )
}

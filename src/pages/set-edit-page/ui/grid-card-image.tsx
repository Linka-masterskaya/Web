import { getMedia } from '@entities/media'
import type { TSetPageElement } from '@entities/set'
import { Icon } from '@shared/ui/icon'
import { PictureImage } from '@shared/ui/picture-image/picture-image'
import { useQuery } from '@tanstack/react-query'
import styles from '../set-edit-page.module.scss'

export const GridCardImage: React.FC<{ card: TSetPageElement }> = ({ card }) => {
  const media = useQuery({
    queryKey: ['media', card.media_id],
    queryFn: ({ signal }) => getMedia(card.media_id ?? '', signal),
    enabled: card.kind === 'image' && Boolean(card.media_id) && !card.source_picture_id,
  })
  const url = media.data?.url ?? card.media_url
  if (card.source_picture_id) {
    return (
      <PictureImage
        pictureId={card.source_picture_id}
        alt={card.value ?? ''}
        className={styles.cardImage}
      />
    )
  }
  if (card.kind === 'image' && url) {
    return <img src={url} alt={card.value ?? ''} className={styles.cardImage} />
  }
  return (
    <span className={styles.imagePlaceholder}>
      <Icon name="Image" size={36} />
    </span>
  )
}

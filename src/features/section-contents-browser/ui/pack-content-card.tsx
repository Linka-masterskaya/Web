import { useLibraryPictureContentUrl } from '@entities/library'
import type { TPackContentItem } from '@entities/section-content'
import { Card } from '@shared/ui/card'
import { Icon } from '@shared/ui/icon'
import type { MouseEventHandler } from 'react'

type TPackContentCardProps = {
  item: TPackContentItem
  className?: string
  onClick: () => void
  onContextMenu?: MouseEventHandler<HTMLElement>
}

export const PackContentCard: React.FC<TPackContentCardProps> = ({
  item,
  className,
  onClick,
  onContextMenu,
}) => {
  const { data: imageSrc } = useLibraryPictureContentUrl(item.coverSourcePictureId ?? '')

  const action = { type: 'function' as const, onClick }

  if (imageSrc) {
    return (
      <Card
        fill
        className={className}
        variant="image"
        label={item.name}
        imageSrc={imageSrc}
        imageAlt={item.name}
        action={action}
        onContextMenu={onContextMenu}
        level={item.difficulty ?? undefined}
        age={item.age ?? undefined}
      />
    )
  }

  return (
    <Card
      fill
      className={className}
      variant="icon"
      label={item.name}
      icon={<Icon name="Image" aria-hidden="true" />}
      action={action}
      onContextMenu={onContextMenu}
      level={item.difficulty ?? undefined}
      age={item.age ?? undefined}
    />
  )
}

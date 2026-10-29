import clsx from 'clsx'
import { Heart } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router'
import styles from './card.module.scss'
import { CardLevel } from './card-level'
import type { TCardProps } from './types'

export const Card: React.FC<TCardProps> = (props) => {
  const {
    className,
    fill = false,
    variant,
    label,
    level,
    age,
    favorite,
    action,
    onContextMenu,
  } = props
  const cardClassName = clsx(styles.card, fill && styles.fill, className)

  const media =
    variant === 'image' ? (
      <img className={clsx(styles.media, styles.image)} src={props.imageSrc} alt={props.imageAlt} />
    ) : (
      <span className={clsx(styles.media, styles.iconTile)}>{props.icon}</span>
    )

  const levelBadge = level && age != null ? <CardLevel level={level} age={age} /> : null

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    favorite?.onToggle()
  }

  // С избранным нельзя вкладывать <button> в <button>/<a> — клик по карточке и сердечко разделены
  if (favorite) {
    const mainContent = (
      <>
        {media}
        <span className={styles.nameRow}>
          <span className={styles.label} title={label}>
            {label}
          </span>
          <span className={styles.metaSpacer} aria-hidden>
            {levelBadge}
            <span className={styles.favoritePlaceholder} />
          </span>
        </span>
      </>
    )

    return (
      <div className={clsx(cardClassName, styles.cardWithFavorite)}>
        {action.type === 'link' ? (
          <Link className={styles.main} to={action.href} onContextMenu={onContextMenu}>
            {mainContent}
          </Link>
        ) : (
          <button
            type="button"
            className={styles.main}
            onClick={action.onClick}
            onContextMenu={onContextMenu}
          >
            {mainContent}
          </button>
        )}
        <span className={styles.meta}>
          {levelBadge}
          <button
            type="button"
            className={clsx(styles.favorite, favorite.isFavorite && styles.favoriteActive)}
            aria-label={favorite.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            aria-pressed={favorite.isFavorite}
            onClick={handleFavoriteClick}
          >
            <Heart className={styles.favoriteIcon} size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </span>
      </div>
    )
  }

  const content = (
    <>
      {media}
      <span className={styles.nameRow}>
        <span className={styles.label} title={label}>
          {label}
        </span>
        {levelBadge ? <span className={styles.meta}>{levelBadge}</span> : null}
      </span>
    </>
  )

  if (action.type === 'link') {
    return (
      <Link className={cardClassName} to={action.href} onContextMenu={onContextMenu}>
        {content}
      </Link>
    )
  }

  return (
    <button
      className={cardClassName}
      type="button"
      onClick={action.onClick}
      onContextMenu={onContextMenu}
    >
      {content}
    </button>
  )
}

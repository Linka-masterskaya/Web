import clsx from 'clsx'
import styles from './card.module.scss'
import { CardLevel } from './card-level'
import type { TCardProps } from './types'

export const Card: React.FC<TCardProps> = ({
  className,
  variant,
  label,
  level,
  action,
  icon,
  imageSrc,
  imageAlt,
}) => {
  const cardClassName = clsx(styles.card, className)

  const content = (
    <>
      {variant === 'image' ? (
        <img className={clsx(styles.media, styles.image)} src={imageSrc} alt={imageAlt ?? ''} />
      ) : (
        <span className={clsx(styles.media, styles.iconTile)}>{icon}</span>
      )}

      <span className={styles.nameRow}>
        <span className={styles.label} title={label}>
          {label}
        </span>
        {level && <CardLevel level={level} />}
      </span>
    </>
  )

  if (action.type === 'link') {
    return (
      <a className={cardClassName} href={action.href}>
        {content}
      </a>
    )
  }

  return (
    <button className={cardClassName} type="button" onClick={action.onClick}>
      {content}
    </button>
  )
}

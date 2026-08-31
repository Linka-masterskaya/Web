import clsx from 'clsx'
import styles from './card.module.scss'
import { CardLevel } from './card-level'
import type { TCardProps } from './types'

export const Card: React.FC<TCardProps> = (props) => {
  const { className, fill = false, variant, label, level, action, onContextMenu } = props
  const cardClassName = clsx(styles.card, fill && styles.fill, className)

  const content = (
    <>
      {variant === 'image' ? (
        <img
          className={clsx(styles.media, styles.image)}
          src={props.imageSrc}
          alt={props.imageAlt}
        />
      ) : (
        <span className={clsx(styles.media, styles.iconTile)}>{props.icon}</span>
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
      <a onContextMenu={onContextMenu} className={cardClassName} href={action.href}>
        {content}
      </a>
    )
  }

  return (
    <button
      onContextMenu={onContextMenu}
      className={cardClassName}
      type="button"
      onClick={action.onClick}
    >
      {content}
    </button>
  )
}

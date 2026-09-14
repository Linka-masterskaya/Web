import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import styles from './card-grid.module.scss'
import type { TCardGridCardProps } from './types'

export const CardGridCard: React.FC<TCardGridCardProps> = ({
  imageSrc,
  title,
  active = false,
  indicator,
  onClick,
}) => {
  const isCheckSelected = indicator?.type === 'check' && indicator.selected

  return (
    <button
      type="button"
      className={clsx(styles.card, active && styles.cardActive)}
      onClick={onClick}
      aria-pressed={indicator?.type === 'check' ? indicator.selected : undefined}
      aria-label={title ?? 'Карточка'}
    >
      <span className={styles.cardMedia}>
        {imageSrc ? (
          <img className={styles.image} src={imageSrc} alt="" />
        ) : (
          <Icon name="Image" size={44} className={styles.placeholderIcon} />
        )}
      </span>

      {title && <span className={styles.cardTitle}>{title}</span>}

      {indicator?.type === 'check' && (
        <span
          className={clsx(
            styles.check,
            isCheckSelected &&
              (indicator.selectedActive ? styles.checkSelectedActive : styles.checkSelected),
          )}
          aria-hidden="true"
        />
      )}

      {indicator?.type === 'order' && (
        <span className={styles.order} aria-hidden="true">
          {indicator.value}
        </span>
      )}
    </button>
  )
}

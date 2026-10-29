import { getAgeLabel } from '@features/set-settings'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import styles from './card-level.module.scss'
import type { TCardLevelProps } from './types'

const levelConfig: Record<TCardLevelProps['level'], { starKeys: string[] }> = {
  easy: { starKeys: ['star-1'] },
  medium: { starKeys: ['star-1', 'star-2'] },
  hard: { starKeys: ['star-1', 'star-2', 'star-3'] },
}

export const CardLevel: React.FC<TCardLevelProps> = ({ level, age, className }) => {
  const { starKeys } = levelConfig[level]

  return (
    <span className={clsx(styles.wrapper, className)}>
      <span className={styles.badge} aria-hidden>
        {starKeys.map((starKey) => (
          <Icon name="Star" key={starKey} className={styles.star} />
        ))}
      </span>
      <span className={styles.badge}>{getAgeLabel(age)}</span>
    </span>
  )
}

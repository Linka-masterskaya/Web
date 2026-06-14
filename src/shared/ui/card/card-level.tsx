import clsx from 'clsx'
import { Star } from 'lucide-react'
import styles from './card-level.module.scss'
import type { TCardLevelProps } from './types'

const levelConfig: Record<TCardLevelProps['level'], { starKeys: string[]; ageLabel: string }> = {
  easy: { starKeys: ['star-1'], ageLabel: '3-5 лет' },
  medium: { starKeys: ['star-1', 'star-2'], ageLabel: '5-7 лет' },
  hard: { starKeys: ['star-1', 'star-2', 'star-3'], ageLabel: '7-9 лет' },
}

export const CardLevel: React.FC<TCardLevelProps> = ({ level, className }) => {
  const { starKeys, ageLabel } = levelConfig[level]

  return (
    <span className={clsx(styles.wrapper, className)}>
      <span className={styles.badge} aria-hidden>
        {starKeys.map((starKey) => (
          <Star key={starKey} className={styles.star} />
        ))}
      </span>
      <span className={styles.badge}>{ageLabel}</span>
    </span>
  )
}

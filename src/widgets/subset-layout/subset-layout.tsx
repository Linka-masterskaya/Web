import clsx from 'clsx'
import styles from './subset-layout.module.scss'
import type { TSubsetLayoutProps } from './types'

export const SubsetLayout: React.FC<TSubsetLayoutProps> = ({
  leftSlot,
  rightSlot,
  children,
  className,
}) => {
  return (
    <div className={clsx(styles.subsetLayout, className)}>
      {leftSlot}

      {children != null && <div className="content">{children}</div>}

      {rightSlot}
    </div>
  )
}

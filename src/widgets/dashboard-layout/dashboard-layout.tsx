import clsx from 'clsx'
import styles from './dashboard-layout.module.scss'
import type { TDashboardLayoutProps } from './types'

export const DashboardLayout: React.FC<TDashboardLayoutProps> = ({
  breadcrumbsSlot,
  actionsSlot,
  children,
  className,
  ...otherProps
}) => (
  <div className={clsx(styles.layout, className)} {...otherProps}>
    <div className={styles.panel}>
      <div className={styles.breadcrumbs}>{breadcrumbsSlot}</div>
      <div className={styles.actions}>{actionsSlot}</div>
    </div>

    <div className={styles.content}>{children}</div>
  </div>
)

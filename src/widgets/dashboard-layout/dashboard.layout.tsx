import { MainMenu } from '@features/main-menu'
import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './dashboard-layout.module.scss'
import type { TDashboardLayoutProps } from './types'

export const DashboardLayout: React.FC<TDashboardLayoutProps> = ({ className, ...otherProps }) => (
  <div className={clsx(styles.layout, className)} {...otherProps}>
    <aside className={clsx(styles.sidebar, 'temp-border')}>
      <MainMenu className={styles.menu} />
    </aside>

    <main className={clsx(styles.content, 'temp-border')}>
      <Outlet />
    </main>
  </div>
)

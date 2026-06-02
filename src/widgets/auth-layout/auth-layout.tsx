import { MainMenu } from '@features/main-menu'
import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './auth-layout.module.scss'

export const AuthLayout: React.FC = () => (
  <div className={clsx(styles.layout)}>
    <aside className={clsx(styles.column, 'temp-border')}>
      <MainMenu className={styles.menu} />
    </aside>
    <main className={clsx(styles.slot, 'temp-border')}>
      <Outlet />
    </main>
  </div>
)

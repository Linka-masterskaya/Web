import { Logo } from '@shared/ui/logo'
import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './app-layout.module.scss'
import type { TAppLayoutProps } from './types'

export const AppLayout: React.FC<TAppLayoutProps> = ({
  titleSlot,
  searchSlot,
  actionsSlot,
  className,
}) => (
  <div className={clsx(styles.layout, className)}>
    <header className={styles.header}>
      <Logo className={styles.logo} />
      <div className={styles.title}>{titleSlot}</div>
      <div className={styles.search}>{searchSlot}</div>
      <div className={styles.actions}>{actionsSlot}</div>
    </header>

    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
)

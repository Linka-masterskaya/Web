import { Logo } from '@shared/ui/logo'
import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './studio-layout.module.scss'
import type { TStudioLayoutProps } from './types'

export const StudioLayout: React.FC<TStudioLayoutProps> = ({
  titleSlot,
  toolbarSlot,
  primaryActionSlot,
  className,
}) => (
  <div className={clsx(styles.layout, className)}>
    <header className={styles.header}>
      <Logo className={styles.logo} />
      <div className={styles.title}>{titleSlot}</div>
      {toolbarSlot != null && <div className={styles.toolbar}>{toolbarSlot}</div>}
      {primaryActionSlot != null && <div className={styles.primaryAction}>{primaryActionSlot}</div>}
    </header>

    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
)

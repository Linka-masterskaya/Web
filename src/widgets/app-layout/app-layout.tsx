import { FilterFavorite } from '@features/filter-favorite'
import { Logo } from '@shared/ui/logo'
import { ProfileToggleButton } from '@widgets/profile-toggle/profile-toggle'
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
      {searchSlot != null && <div className={styles.search}>{searchSlot}</div>}
      <div className={styles.actions}>
        {actionsSlot}
        <FilterFavorite />
        <ProfileToggleButton />
      </div>
    </header>

    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
)

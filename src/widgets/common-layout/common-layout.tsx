import { FilterFavorite } from '@features/filter-favorite'
import { routerPath } from '@shared/lib/routes'
import { Logo } from '@shared/ui/logo'
import clsx from 'clsx'
import { Outlet, useLocation } from 'react-router'
import styles from './common-layout.module.scss'
import type { TCommonLayoutProps } from './types'

export const CommonLayout: React.FC<TCommonLayoutProps> = ({
  titleSlot,
  actionsSlot,
  className,
}) => {
  const { pathname } = useLocation()
  const dashboardPath = `/${routerPath.dashboard}`
  const isDashboardRoute = pathname === dashboardPath || pathname.startsWith(`${dashboardPath}/`)

  return (
    <div className={clsx(styles.layout, className)}>
      <header className={styles.header}>
        <Logo className={styles.logo} />
        <div className={styles.title}>{titleSlot}</div>
        <div className={styles.actions}>
          {actionsSlot}
          {isDashboardRoute && <FilterFavorite />}
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

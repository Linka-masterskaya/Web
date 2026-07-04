import { Logo } from '@shared/ui/logo'
// import { ProfileToggleButton } from '@widgets/profile-toggle/profile-toggle'
import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './common-layout.module.scss'
import type { TCommonLayoutProps } from './types'

export const CommonLayout: React.FC<TCommonLayoutProps> = ({
  titleSlot,
  actionsSlot,
  className,
}) => (
  <div className={clsx(styles.layout, className)}>
    <header className={styles.header}>
      <Logo className={styles.logo} />
      <div className={styles.title}>{titleSlot}</div>
      <div
        className={styles.actions}

        // Тут Кирилл вольет свои изменения и тогда можно будет добавить отображение этой кнопки здесь
        // {isDashboardRoute && <ProfileToggleButton/>}
      >
        {actionsSlot}
      </div>
    </header>

    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
)

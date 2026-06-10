import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './auth-layout.module.scss'

export type TAuthLayoutProps = {
  decorationSide: 'left' | 'right'
  className?: string
}

export const AuthLayout: React.FC<TAuthLayoutProps> = ({ decorationSide, className = '' }) => {
  return (
    <div
      className={clsx(
        styles.authLayout,
        decorationSide === 'left' ? styles.decorationLeft : styles.decorationRight,
        className,
      )}
    >
      <div className={styles.decoration} />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

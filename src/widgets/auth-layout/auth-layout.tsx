import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './auth-layout.module.scss'

export type TAuthLayoutProps = {
  decorationSide: 'left' | 'right'
  children?: React.ReactNode
  className?: string
}

export const AuthLayout: React.FC<TAuthLayoutProps> = ({ decorationSide, className = '' }) => {
  const isLeft = decorationSide === 'left'

  return (
    <div className={clsx(styles.authLayout, isLeft ? styles.decorationLeft : undefined, className)}>
      <div className={clsx(styles.decoration, isLeft && styles.decorationLeftImage)}>
        <img src="/auth-decoration.jpg" className={styles.decorationImg} alt="" />
      </div>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export const AuthLayoutRight = () => <AuthLayout decorationSide="right" />
export const AuthLayoutLeft = () => <AuthLayout decorationSide="left" />

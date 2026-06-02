import clsx from 'clsx'
import { Outlet } from 'react-router'
import styles from './common-layout.module.scss'

export const CommonLayout: React.FC = () => (
  <div className={clsx(styles.layout)}>
    <Outlet />
  </div>
)

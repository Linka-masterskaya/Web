import { useAuthStore } from '@entities/auth'
import clsx from 'clsx'
import { NavLink } from 'react-router'
import styles from './main-menu.module.scss'
import { getVisibleMenuItems } from './utils/get-visible-menu-items'

export const MainMenu: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  ...otherProps
}) => {
  const isAuth = useAuthStore((user) => user.isAuth)
  const items = getVisibleMenuItems(isAuth)

  return (
    <nav className={clsx(styles.container, className)} {...otherProps}>
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.url}
          end={item.end}
          className={({ isActive }) => clsx(styles.link, isActive && styles.linkActive)}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

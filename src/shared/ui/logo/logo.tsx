import clsx from 'clsx'
import styles from './logo.module.scss'
import type { TLogoProps } from './types'

export const Logo: React.FC<TLogoProps> = ({ alt = 'Logo', className, ...otherProps }) => (
  <img src="/logo.png" alt={alt} className={clsx(styles.logo, className)} {...otherProps} />
)

import clsx from 'clsx'
import logoPng from '../assets/logo.png'
import styles from './logo.module.scss'
import type { TLogoProps } from './types'

export const Logo: React.FC<TLogoProps> = ({ alt = 'Logo', className, ...otherProps }) => (
  <img src={logoPng} alt={alt} className={clsx(styles.logo, className)} {...otherProps} />
)

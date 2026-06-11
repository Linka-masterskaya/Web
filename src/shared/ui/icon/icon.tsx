import type { LucideIcon, LucideProps } from 'lucide-react'
import * as Icons from 'lucide-react'

// Автоматически выводим все доступные имена иконок
type IconName = keyof typeof Icons

// Используем встроенные типы lucide-react
export interface IIconProps extends LucideProps {
  name: IconName
}

export const Icon: React.FC<IIconProps> = ({ name, size = 20, className, ...props }) => {
  const LucideIcon = Icons[name] as LucideIcon

  return <LucideIcon size={size} className={className} {...props} />
}

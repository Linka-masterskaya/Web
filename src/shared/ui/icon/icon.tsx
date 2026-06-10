import * as Icons from 'lucide-react'
import type React from 'react'

// Автоматически выводим типы из импортированных иконок
type IconName = keyof typeof Icons

export interface IIconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  size?: number | string
}

export const Icon: React.FC<IIconProps> = ({ name, size = 20, className, ...props }) => {
  const LucideIcon = Icons[name] as React.ElementType

  return <LucideIcon size={size} className={className} {...props} />
}

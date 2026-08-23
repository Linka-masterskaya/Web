import type { IIconProps } from '@shared/ui/icon'

export type TCreateEntityAction = {
  label: string
  icon: IIconProps['name']
  link?: string
  onClick?: () => void
}

export type TCreateEntityConfig = {
  actions: TCreateEntityAction[]
}

export type TCreateEntityProps = {
  config: TCreateEntityConfig
  className?: string
}

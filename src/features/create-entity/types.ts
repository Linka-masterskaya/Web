import type { IIconProps } from '@shared/ui/icon'

export type TCreateEntityAction = {
  label: string
  link: string
  icon: IIconProps['name']
}

export type TCreateEntityConfig = {
  actions: TCreateEntityAction[]
}

export type TCreateEntityProps = {
  config: TCreateEntityConfig
  className?: string
}

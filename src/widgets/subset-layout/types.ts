import type { ReactNode } from 'react'

export type TSubsetLayoutProps = {
  leftSlot?: ReactNode
  leftCollapsedSlot?: ReactNode
  rightSlot?: ReactNode
  rightCollapsedSlot?: ReactNode
  leftTitle?: ReactNode
  rightTitle?: ReactNode
  children?: ReactNode
  className?: string
  collapsible?: boolean
  defaultLeftOpened?: boolean
  defaultRightOpened?: boolean
}

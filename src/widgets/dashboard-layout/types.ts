import type { HTMLAttributes, ReactNode } from 'react'

export type TDashboardLayoutProps = HTMLAttributes<HTMLDivElement> & {
  breadcrumbsSlot?: ReactNode
  actionsSlot?: ReactNode
  children: ReactNode
}

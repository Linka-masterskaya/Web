import type { ReactNode } from 'react'

export type TPopupLayoutProps = {
  onClose?: () => void
  title?: string
  children: ReactNode
}

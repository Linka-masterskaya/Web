import type { ReactNode } from 'react'

export type TSidePanelProps = {
  side: 'left' | 'right'
  opened: boolean
  onToggle: () => void
  children?: ReactNode
}

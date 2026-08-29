import type { ReactNode } from 'react'

export type TSidePanelSide = 'left' | 'right'

export type TSidePanelProps = {
  id: string
  side: TSidePanelSide
  title?: ReactNode
  opened: boolean
  collapsible: boolean
  onToggle: () => void
  collapsedContent?: ReactNode
  children?: ReactNode
}

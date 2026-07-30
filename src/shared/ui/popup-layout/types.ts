import type { MantineSpacing } from '@mantine/core'
import type { ReactNode } from 'react'

export type TPopupLayoutProps = {
  onClose?: () => void
  title?: string
  contentGap?: MantineSpacing | number
  children: ReactNode
}

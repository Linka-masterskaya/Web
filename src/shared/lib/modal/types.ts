import type { ModalProps } from '@mantine/core'
import type { ReactNode } from 'react'

export type TModalOptions = Pick<
  ModalProps,
  | 'title'
  | 'size'
  | 'centered'
  | 'withCloseButton'
  | 'closeOnClickOutside'
  | 'closeOnEscape'
  | 'padding'
  | 'radius'
  | 'transitionProps'
> & {
  onClose?: () => void
}

export type TModalOpenParams = {
  content: ReactNode
} & TModalOptions

export type TModalContextValue = {
  isOpen: boolean
  open: (params: TModalOpenParams) => void
  close: () => void
}

export type TModalProviderProps = {
  children: ReactNode
}

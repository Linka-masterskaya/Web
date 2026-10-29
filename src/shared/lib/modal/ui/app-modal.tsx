import { Modal } from '@mantine/core'
import type { ReactNode } from 'react'
import type { TModalOptions } from '../types'

type TAppModalProps = {
  opened: boolean
  content: ReactNode
  options: TModalOptions
  onClose: () => void
  onExited: () => void
}

export const AppModal: React.FC<TAppModalProps> = ({
  opened,
  content,
  options,
  onClose,
  onExited,
}) => {
  const {
    title,
    size = 'md',
    centered = true,
    withCloseButton = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    padding,
    radius,
    transitionProps,
  } = options

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      withCloseButton={withCloseButton}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      padding={padding}
      radius={radius}
      transitionProps={{
        ...transitionProps,
        onExited: () => {
          transitionProps?.onExited?.()
          onExited()
        },
      }}
    >
      {content}
    </Modal>
  )
}

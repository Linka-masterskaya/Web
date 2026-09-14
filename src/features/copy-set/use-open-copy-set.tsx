import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { CopySetModal } from './copy-set-modal'
import type { TOpenCopySetParams } from './types'

export const useOpenCopySet = () => {
  const { open, close } = useModal()

  return useCallback(
    ({ setId, setName, targetSection, onSuccess }: TOpenCopySetParams) => {
      open({
        content: (
          <CopySetModal
            setId={setId}
            setName={setName}
            targetSection={targetSection}
            onClose={close}
            onSuccess={onSuccess}
          />
        ),
        size: 518,
        padding: 0,
        radius: 20,
        withCloseButton: false,
        closeOnClickOutside: false,
        closeOnEscape: false,
        transitionProps: {
          transition: 'fade',
        },
      })
    },
    [open, close],
  )
}

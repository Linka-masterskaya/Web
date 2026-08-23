import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { CreateSetModal } from './create-set-modal'
import type { TOpenCreateSetParams } from './types'

export const useOpenCreateSet = () => {
  const { open, close } = useModal()

  return useCallback(
    ({ folderId = null, onSuccess }: TOpenCreateSetParams = {}) => {
      open({
        content: (
          <CreateSetModal folderId={folderId} onClose={close} onSuccess={onSuccess} />
        ),
        size: 518,
        padding: 0,
        radius: 20,
        withCloseButton: false,
      })
    },
    [close, open],
  )
}
